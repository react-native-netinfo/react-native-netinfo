/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import NetInfo from '../index';
import NativeInterface from '../internal/nativeInterface';
import Subscriptions from '../internal/subscriptions';
import {NetInfoStateType} from '../internal/types';

type JestMockNativeInterface = jest.Mocked<typeof NativeInterface>;
/// @ts-ignore
const MockNativeInterface: JestMockNativeInterface = NativeInterface;

const DEVICE_CONNECTIVITY_EVENT = 'netInfo.networkStatusDidChange';

describe('@react-native-community/netinfo', () => {
  describe('Event listener management', () => {
    beforeEach(() => {
      Subscriptions.clear();

      MockNativeInterface.getCurrentState.mockResolvedValue({
        type: NetInfoStateType.none,
        isConnected: false,
        details: null,
      });
    });

    it('should add the listener to the native module when passing the correct event name', () => {
      NetInfo.addEventListener(jest.fn());
      expect(MockNativeInterface.addListener).toBeCalledWith(
        DEVICE_CONNECTIVITY_EVENT,
      );
    });

    it('should not error when calling remove on an invalid subscription', () => {
      // $FlowExpectedError We are testing passing in the wrong name
      const subscription = NetInfo.addEventListener('WRONGNAME', jest.fn());
      subscription.remove();
      expect(MockNativeInterface.addListener).not.toBeCalled();
    });

    it('should remove the listener from the native module when calling removeEventListener', () => {
      const listener = jest.fn();
      const unsubscribe = NetInfo.addEventListener(listener);
      unsubscribe();
      expect(MockNativeInterface.removeListeners).toBeCalled();
    });

    it('should not call the native module if asked to remove a listener which was never added', () => {
      const listener = jest.fn();
      const unsubscribe = NetInfo.addEventListener(listener);
      unsubscribe();
      MockNativeInterface.removeListeners.mockReset();

      unsubscribe();
      expect(MockNativeInterface.removeListeners).not.toBeCalled();
    });
  });
});
