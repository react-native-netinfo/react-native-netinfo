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

const DEVICE_CONNECTIVITY_EVENT = 'netInfo.networkStatusDidChange';

describe('react-native-community/netinfo', () => {
  describe('Event listener callbacks', () => {
    it('should call the listener on listening', done => {
      const listener = jest.fn();
      NetInfo.addEventListener(listener);

      setImmediate(() => {
        expect(listener).toBeCalled();
        done();
      });
    });

    it('should call the listener on listening with multiple listeners', done => {
      const listener1 = jest.fn();
      const listener2 = jest.fn();
      NetInfo.addEventListener(listener1);
      NetInfo.addEventListener(listener2);

      setImmediate(() => {
        expect(listener1).toBeCalled();
        expect(listener2).toBeCalled();
        done();
      });
    });

    it('should call the listener when the native event is emmitted', () => {
      const listener = jest.fn();
      NetInfo.addEventListener(listener);

      const expectedConnectionType = 'wifi';
      const expectedEffectiveConnectionType = 'unknown';
      const expectedConnectionInfo = {
        type: expectedConnectionType,
        isConnected: true,
        isInternetReachable: true,
        details: {
          isConnectionExpensive: true,
          cellularGeneration: expectedEffectiveConnectionType,
        },
      };

      NativeInterface.eventEmitter.emit(
        DEVICE_CONNECTIVITY_EVENT,
        expectedConnectionInfo,
      );

      expect(listener).toBeCalledWith(expectedConnectionInfo);
    });

    it('should call the listener multiple times when multiple native events are emmitted', () => {
      const listener = jest.fn();
      NetInfo.addEventListener(listener);

      NativeInterface.eventEmitter.emit(DEVICE_CONNECTIVITY_EVENT, {
        type: 'cellular',
        isConnected: true,
        isInternetReachable: true,
        details: {
          isConnectionExpensive: true,
          cellularGeneration: '3g',
        },
      });
      NativeInterface.eventEmitter.emit(DEVICE_CONNECTIVITY_EVENT, {
        type: 'wifi',
        isConnected: true,
        isInternetReachable: true,
        details: {
          isConnectionExpensive: true,
          cellularGeneration: 'unknown',
        },
      });

      // The additional time is from the call on listen
      expect(listener).toBeCalledTimes(3);
    });

    it('should call all listeners when the native event is emmitted', () => {
      const listener1 = jest.fn();
      const listener2 = jest.fn();
      NetInfo.addEventListener(listener1);
      NetInfo.addEventListener(listener2);

      const expectedConnectionType = 'wifi';
      const expectedEffectiveConnectionType = 'unknown';

      const expectedConnectionInfo = {
        type: expectedConnectionType,
        isConnected: true,
        isInternetReachable: true,
        details: {
          isConnectionExpensive: true,
          cellularGeneration: expectedEffectiveConnectionType,
        },
      };

      NativeInterface.eventEmitter.emit(
        DEVICE_CONNECTIVITY_EVENT,
        expectedConnectionInfo,
      );

      expect(listener1).toBeCalledWith(expectedConnectionInfo);
      expect(listener2).toBeCalledWith(expectedConnectionInfo);
    });

    it('should not call the listener after being removed', () => {
      const listener = jest.fn();
      const unsubscribe = NetInfo.addEventListener(listener);
      unsubscribe();

      // Clear the stats from the call on listen
      listener.mockClear();

      NativeInterface.eventEmitter.emit(DEVICE_CONNECTIVITY_EVENT, {
        type: 'cellular',
        isConnected: true,
        isInternetReachable: true,
        details: {
          isConnectionExpensive: true,
          cellularGeneration: '3g',
        },
      });

      expect(listener).not.toBeCalled();
    });

    it('should call the remaining listeners when one has been removed', () => {
      const listener1 = jest.fn();
      const listener2 = jest.fn();
      const unsubscribe1 = NetInfo.addEventListener(listener1);
      NetInfo.addEventListener(listener2);

      unsubscribe1();

      // Clear the stats from the call on listen
      listener1.mockClear();

      const expectedConnectionType = 'wifi';
      const expectedEffectiveConnectionType = 'unknown';

      const expectedConnectionInfo = {
        type: expectedConnectionType,
        isConnected: true,
        isInternetReachable: true,
        details: {
          isConnectionExpensive: true,
          cellularGeneration: expectedEffectiveConnectionType,
        },
      };

      NativeInterface.eventEmitter.emit(
        DEVICE_CONNECTIVITY_EVENT,
        expectedConnectionInfo,
      );

      expect(listener1).not.toBeCalled();
      expect(listener2).toBeCalledWith(expectedConnectionInfo);
    });
  });
});
