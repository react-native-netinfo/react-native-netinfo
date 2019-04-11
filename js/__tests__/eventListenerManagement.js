/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @flow
 */

import {NativeModules} from 'react-native';
import NetInfo from '../index';

describe('react-native-netinfo', () => {
  describe('Event listener management', () => {
    beforeEach(() => {
      NetInfo.clearEventListeners();

      NativeModules.RNCNetInfo.getCurrentConnectivity.mockResolvedValue({
        type: 'cellular',
        effectiveType: '3g',
      });
    });

    it('should add the listener to the native module when passing the correct event name', () => {
      NetInfo.addEventListener('connectionChange', jest.fn());
      expect(NativeModules.RNCNetInfo.addListener).toBeCalledWith(
        NetInfo.Events.NetworkStatusDidChange,
      );
    });

    it('should do nothing when passing the wrong event name', () => {
      // $FlowExpectedError We are testing passing in the wrong name
      NetInfo.addEventListener('WRONGNAME', jest.fn());
      expect(NativeModules.RNCNetInfo.addListener).not.toBeCalled();
    });

    it('should not error when calling remove on an invalid subscription', () => {
      // $FlowExpectedError We are testing passing in the wrong name
      const subscription = NetInfo.addEventListener('WRONGNAME', jest.fn());
      subscription.remove();
      expect(NativeModules.RNCNetInfo.addListener).not.toBeCalled();
    });

    it('should remove the listener from the native module when calling removeEventListener', () => {
      const listener = jest.fn();
      NetInfo.addEventListener('connectionChange', listener);
      NetInfo.removeEventListener('connectionChange', listener);
      expect(NativeModules.RNCNetInfo.removeListeners).toBeCalled();
    });

    it('should not call the native module if asked to remove a listener which was never added', () => {
      NetInfo.removeEventListener('connectionChange', jest.fn());
      expect(NativeModules.RNCNetInfo.removeListeners).not.toBeCalled();
    });

    it('should remove the listener from the native module when calling remove on the returned subscription', () => {
      const listener = jest.fn();
      const subscription = NetInfo.addEventListener(
        'connectionChange',
        listener,
      );
      subscription.remove();
      expect(NativeModules.RNCNetInfo.removeListeners).toBeCalled();
    });
  });
});
