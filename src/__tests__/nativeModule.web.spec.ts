/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {Platform} from 'react-native';
import {DEVICE_CONNECTIVITY_EVENT} from '../internal/privateTypes';

import type {NetInfoNativeModule} from '../internal/privateTypes';

const describeOnWeb = Platform.OS === 'web' ? describe : describe.skip;

describeOnWeb('web native module', () => {
  let originalConnectionDescriptor: PropertyDescriptor | undefined;

  const partialConnectionCases: [string, ('add' | 'remove')[]][] = [
    ['neither event method', []],
    ['only addEventListener', ['add']],
    ['only removeEventListener', ['remove']],
  ];

  beforeAll(() => {
    originalConnectionDescriptor = Object.getOwnPropertyDescriptor(
      window.navigator,
      'connection',
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetModules();

    if (originalConnectionDescriptor) {
      Object.defineProperty(
        window.navigator,
        'connection',
        originalConnectionDescriptor,
      );
    } else {
      Reflect.deleteProperty(window.navigator, 'connection');
    }
  });

  it.each(partialConnectionCases)(
    'falls back to window events with %s',
    (_description, availableMethods) => {
      const addConnectionListener = jest.fn();
      const removeConnectionListener = jest.fn();

      Object.defineProperty(window.navigator, 'connection', {
        configurable: true,
        value: {
          type: 'wifi',
          effectiveType: '4g',
          saveData: false,
          ...(availableMethods.includes('add') && {
            addEventListener: addConnectionListener,
          }),
          ...(availableMethods.includes('remove') && {
            removeEventListener: removeConnectionListener,
          }),
        },
      });

      const addWindowListener = jest.spyOn(window, 'addEventListener');
      const removeWindowListener = jest.spyOn(window, 'removeEventListener');
      let nativeModule!: NetInfoNativeModule;

      jest.isolateModules(() => {
        nativeModule = jest.requireActual<{
          default: NetInfoNativeModule;
        }>('../internal/nativeModule.web').default;
      });

      const listener = jest.fn();

      expect(() =>
        nativeModule.addListener(DEVICE_CONNECTIVITY_EVENT, listener),
      ).not.toThrow();

      const onlineListener = addWindowListener.mock.calls.find(
        ([event]) => event === 'online',
      )?.[1];
      const offlineListener = addWindowListener.mock.calls.find(
        ([event]) => event === 'offline',
      )?.[1];

      expect(onlineListener).toEqual(expect.any(Function));
      expect(offlineListener).toBe(onlineListener);

      (onlineListener as EventListener)(new Event('online'));

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({type: 'wifi'}),
      );

      nativeModule.removeListeners(DEVICE_CONNECTIVITY_EVENT, listener);

      expect(
        removeWindowListener.mock.calls.find(
          ([event]) => event === 'online',
        )?.[1],
      ).toBe(onlineListener);
      expect(
        removeWindowListener.mock.calls.find(
          ([event]) => event === 'offline',
        )?.[1],
      ).toBe(offlineListener);
      expect(addConnectionListener).not.toHaveBeenCalled();
      expect(removeConnectionListener).not.toHaveBeenCalled();
    },
  );

  it('uses connection change events when the complete API is available', () => {
    const addConnectionListener = jest.fn();
    const removeConnectionListener = jest.fn();

    Object.defineProperty(window.navigator, 'connection', {
      configurable: true,
      value: {
        type: 'wifi',
        effectiveType: '4g',
        saveData: false,
        addEventListener: addConnectionListener,
        removeEventListener: removeConnectionListener,
      },
    });

    const addWindowListener = jest.spyOn(window, 'addEventListener');
    let nativeModule!: NetInfoNativeModule;

    jest.isolateModules(() => {
      nativeModule = jest.requireActual<{
        default: NetInfoNativeModule;
      }>('../internal/nativeModule.web').default;
    });

    const listener = jest.fn();

    nativeModule.addListener(DEVICE_CONNECTIVITY_EVENT, listener);

    const connectionListener = addConnectionListener.mock.calls[0]?.[1];

    expect(addConnectionListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function),
    );
    expect(
      addWindowListener.mock.calls.some(
        ([event]) => event === 'online' || event === 'offline',
      ),
    ).toBe(false);

    nativeModule.removeListeners(DEVICE_CONNECTIVITY_EVENT, listener);

    expect(removeConnectionListener).toHaveBeenCalledWith(
      'change',
      connectionListener,
    );
  });
});
