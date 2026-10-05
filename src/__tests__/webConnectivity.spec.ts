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

describeOnWeb('web connectivity events', () => {
  let originalConnection: PropertyDescriptor | undefined;
  let nativeModule: NetInfoNativeModule;
  let listener: jest.Mock;
  let subscribed = false;

  beforeEach(() => {
    originalConnection = Object.getOwnPropertyDescriptor(
      navigator,
      'connection',
    );
    listener = jest.fn();
  });

  afterEach(() => {
    if (subscribed) {
      nativeModule.removeListeners(DEVICE_CONNECTIVITY_EVENT, listener);
      subscribed = false;
    }
    if (originalConnection) {
      Object.defineProperty(navigator, 'connection', originalConnection);
    } else {
      Reflect.deleteProperty(navigator, 'connection');
    }
    jest.restoreAllMocks();
  });

  it.each([true, false])(
    'reports window online/offline events with connection API = %s',
    (hasConnection) => {
      const connection = new EventTarget();
      Object.defineProperty(navigator, 'connection', {
        configurable: true,
        value: hasConnection ? connection : undefined,
      });
      const online = jest.spyOn(navigator, 'onLine', 'get');
      online.mockReturnValue(false);

      jest.isolateModules(() => {
        nativeModule = jest.requireActual(
          '../internal/nativeModule.web',
        ).default;
      });
      nativeModule.addListener(DEVICE_CONNECTIVITY_EVENT, listener);
      subscribed = true;

      // Chrome can emit connection.change before navigator.onLine changes.
      if (hasConnection) {
        connection.dispatchEvent(new Event('change'));
        expect(listener).toHaveBeenLastCalledWith(
          expect.objectContaining({isConnected: false}),
        );
      }

      online.mockReturnValue(true);
      window.dispatchEvent(new Event('online'));
      expect(listener).toHaveBeenLastCalledWith(
        expect.objectContaining({isConnected: true}),
      );

      online.mockReturnValue(false);
      window.dispatchEvent(new Event('offline'));
      expect(listener).toHaveBeenLastCalledWith(
        expect.objectContaining({isConnected: false}),
      );

      nativeModule.removeListeners(DEVICE_CONNECTIVITY_EVENT, listener);
      subscribed = false;
      listener.mockClear();
      online.mockReturnValue(true);
      window.dispatchEvent(new Event('online'));
      window.dispatchEvent(new Event('offline'));
      connection.dispatchEvent(new Event('change'));
      expect(listener).not.toHaveBeenCalled();
    },
  );
});
