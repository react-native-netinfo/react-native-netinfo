/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import NetInfo from '../../index';
import Subscriptions from '../../internal/subscriptions';
import DeprecatedSubscriptions from '../../internal/deprecatedSubscriptions';
import NativeInterface from '../../internal/nativeInterface';
import {
  NetInfoStateType,
  NetInfoCellularGeneration,
} from '../../internal/types';

type JestMockNativeInterface = jest.Mocked<typeof NativeInterface>;
/// @ts-ignore
const MockNativeInterface: JestMockNativeInterface = NativeInterface;

const DEVICE_CONNECTIVITY_EVENT = 'netInfo.networkStatusDidChange';

describe('Deprecated', () => {
  describe('isConnected', () => {
    beforeEach(() => {
      Subscriptions.clear();
      DeprecatedSubscriptions.clear();

      MockNativeInterface.getCurrentState.mockResolvedValue({
        type: NetInfoStateType.cellular,
        isConnected: true,
        details: {
          isConnectionExpensive: true,
          cellularGeneration: NetInfoCellularGeneration['3g'],
        },
      });
    });

    describe('fetch', () => {
      it('should resolve to true when the native module returns a connected state', () => {
        MockNativeInterface.getCurrentState.mockResolvedValue({
          type: NetInfoStateType.cellular,
          isConnected: true,
          details: {
            isConnectionExpensive: true,
            cellularGeneration: NetInfoCellularGeneration['3g'],
          },
        });

        return expect(NetInfo.isConnected.fetch()).resolves.toBe(true);
      });

      it('should resolve to true when the native module returns a not connected state', () => {
        MockNativeInterface.getCurrentState.mockResolvedValue({
          type: NetInfoStateType.unknown,
          isConnected: false,
          details: null,
        });

        return expect(NetInfo.isConnected.fetch()).resolves.toBe(false);
      });

      it('should pass on errors through the promise chain', () => {
        const expectedError = new Error('A test error');

        MockNativeInterface.getCurrentState.mockRejectedValue(expectedError);

        return expect(NetInfo.getConnectionInfo()).rejects.toBe(expectedError);
      });
    });

    describe('Event listener management', () => {
      it('should add the listener to the native module when passing the correct event name', () => {
        NetInfo.isConnected.addEventListener('connectionChange', jest.fn());
        expect(MockNativeInterface.addListener).toBeCalledWith(
          DEVICE_CONNECTIVITY_EVENT,
        );
      });

      it('should do nothing when passing the wrong event name', () => {
        // $FlowExpectedError We are testing passing in the wrong name
        NetInfo.isConnected.addEventListener('WRONGNAME', jest.fn());
        expect(MockNativeInterface.addListener).not.toBeCalled();
      });

      it('should remove the listener from the native module when calling removeEventListener', () => {
        const listener = jest.fn();
        NetInfo.isConnected.addEventListener('connectionChange', listener);
        NetInfo.isConnected.removeEventListener('connectionChange', listener);
        expect(MockNativeInterface.removeListeners).toBeCalled();
      });

      it('should remove the listener from the native module when calling remove on the returned subscription', () => {
        const listener = jest.fn();
        const subscription = NetInfo.isConnected.addEventListener(
          'connectionChange',
          listener,
        );
        subscription.remove();
        expect(MockNativeInterface.removeListeners).toBeCalled();
      });

      it('should not remove the listener from the native module when calling remove on the returned subscription if there is another subscription', () => {
        const listener1 = jest.fn();
        const listener2 = jest.fn();
        const subscription1 = NetInfo.isConnected.addEventListener(
          'connectionChange',
          listener1,
        );
        const subscription2 = NetInfo.isConnected.addEventListener(
          'connectionChange',
          listener2,
        );

        subscription1.remove();
        expect(MockNativeInterface.removeListeners).not.toBeCalled();

        subscription2.remove();
        expect(MockNativeInterface.removeListeners).toBeCalled();
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
          details: {
            isConnectionExpensive: true,
            cellularGeneration: '3g',
          },
        });
        NativeInterface.eventEmitter.emit(DEVICE_CONNECTIVITY_EVENT, {
          type: 'wifi',
          isConnected: true,
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
          details: null,
        });

        expect(listener1).not.toBeCalled();
        expect(listener2).toBeCalledWith(false);
      });
    });
  });
});
