/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import NetInfo from '../../index';
import NativeInterface from '../../internal/nativeInterface';
import {
  NetInfoStateType,
  NetInfoCellularGeneration,
} from '../../internal/types';

const DEVICE_CONNECTIVITY_EVENT = 'netInfo.networkStatusDidChange';

describe('Deprecated', () => {
  describe('isConnected', () => {
    describe('fetch', () => {
      it('should resolve to true when the native module returns a connected state', () => {
        NativeInterface.eventEmitter.emit(DEVICE_CONNECTIVITY_EVENT, {
          type: NetInfoStateType.cellular,
          isConnected: true,
          isInternetReachable: true,
          details: {
            isConnectionExpensive: true,
            cellularGeneration: NetInfoCellularGeneration['3g'],
          },
        });

        return expect(NetInfo.isConnected.fetch()).resolves.toBe(true);
      });

      it('should resolve to true when the native module returns a not connected state', () => {
        NativeInterface.eventEmitter.emit(DEVICE_CONNECTIVITY_EVENT, {
          type: NetInfoStateType.unknown,
          isConnected: false,
          isInternetReachable: false,
          details: null,
        });

        return expect(NetInfo.isConnected.fetch()).resolves.toBe(false);
      });
    });

    describe('Event listener callbacks', () => {
      it('should call the listener when listening even if no event is emitted', () => {
        const listener = jest.fn();
        NetInfo.isConnected.addEventListener('connectionChange', listener);

        expect(listener).toBeCalledWith(true);
      });

      it('should call the listener when the native event is emmitted', () => {
        const listener = jest.fn();
        NetInfo.isConnected.addEventListener('connectionChange', listener);

        NativeInterface.eventEmitter.emit(DEVICE_CONNECTIVITY_EVENT, {
          type: 'cellular',
          isConnected: true,
          isInternetReachable: true,
          details: {
            isConnectionExpensive: true,
            cellularGeneration: '4g',
          },
        });

        expect(listener).toBeCalledWith(true);
      });

      it('should call the listener multiple times when multiple native events are emmitted', () => {
        const listener = jest.fn();
        NetInfo.isConnected.addEventListener('connectionChange', listener);

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
            isConnectionExpensive: false,
          },
        });

        // The additional time is from the call to "getCurrentConnectivity" on listening
        expect(listener).toBeCalledTimes(3);
      });

      it('should call all listeners when the native event is emmitted', () => {
        const listener1 = jest.fn();
        const listener2 = jest.fn();
        NetInfo.isConnected.addEventListener('connectionChange', listener1);
        NetInfo.isConnected.addEventListener('connectionChange', listener2);

        NativeInterface.eventEmitter.emit(DEVICE_CONNECTIVITY_EVENT, {
          type: 'cellular',
          isConnected: true,
          isInternetReachable: true,
          details: {
            isConnectionExpensive: true,
            cellularGeneration: '2g',
          },
        });

        expect(listener1).toBeCalledWith(true);
        expect(listener2).toBeCalledWith(true);
      });

      it('should not call the listener after being removed', () => {
        const listener = jest.fn();
        NetInfo.isConnected.addEventListener('connectionChange', listener);
        NetInfo.isConnected.removeEventListener('connectionChange', listener);

        // This clears the stats from the call which was made on listening
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
        NetInfo.isConnected.addEventListener('connectionChange', listener1);
        NetInfo.isConnected.addEventListener('connectionChange', listener2);

        NetInfo.isConnected.removeEventListener('connectionChange', listener1);

        // This clears the stats from the call which was made on listening
        listener1.mockClear();
        listener2.mockClear();

        NativeInterface.eventEmitter.emit(DEVICE_CONNECTIVITY_EVENT, {
          type: 'unknown',
          isConnected: false,
          isInternetReachable: false,
          details: null,
        });

        expect(listener1).not.toBeCalled();
        expect(listener2).toBeCalledWith(false);
      });
    });
  });
});
