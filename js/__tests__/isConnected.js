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
import {RNCNetInfo, NetInfoEventEmitter} from '../nativeInterface';

const CONNECTED_STATES = [
  {type: 'cellular', connected: true},
  {type: 'wifi', connected: true},
  {type: 'bluetooth', connected: true},
  {type: 'ethernet', connected: true},
  {type: 'wimax', connected: true},
  {type: 'none', connected: false},
  {type: 'unknown', connected: false},
];

describe('react-native-netinfo', () => {
  describe('isConnected', () => {
    beforeEach(() => {
      NetInfo.clearEventListeners();

      RNCNetInfo.getCurrentConnectivity.mockResolvedValue({
        type: 'cellular',
        effectiveType: '3g',
      });
    });

    describe('fetch', () => {
      CONNECTED_STATES.map(({type, connected}) => {
        it(`should resolve to ${connected.toString()} when the native module returns a ${type} state`, () => {
          NativeModules.RNCNetInfo.getCurrentConnectivity.mockResolvedValue({
            type: type,
            effectiveType: 'unknown',
          });

          return expect(NetInfo.isConnected.fetch()).resolves.toBe(connected);
        });
      });

      it('should pass on errors through the promise chain', () => {
        const expectedError = new Error('A test error');

        NativeModules.RNCNetInfo.getCurrentConnectivity.mockRejectedValue(
          expectedError,
        );

        return expect(NetInfo.getConnectionInfo()).rejects.toBe(expectedError);
      });
    });

    describe('Event listener management', () => {
      it('should add the listener to the native module when passing the correct event name', () => {
        NetInfo.isConnected.addEventListener('connectionChange', jest.fn());
        expect(NativeModules.RNCNetInfo.addListener).toBeCalledWith(
          NetInfo.Events.NetworkStatusDidChange,
        );
      });

      it('should do nothing when passing the wrong event name', () => {
        // $FlowExpectedError We are testing passing in the wrong name
        NetInfo.isConnected.addEventListener('WRONGNAME', jest.fn());
        expect(NativeModules.RNCNetInfo.addListener).not.toBeCalled();
      });

      it('should remove the listener from the native module when calling removeEventListener', () => {
        const listener = jest.fn();
        NetInfo.isConnected.addEventListener('connectionChange', listener);
        NetInfo.isConnected.removeEventListener('connectionChange', listener);
        expect(NativeModules.RNCNetInfo.removeListeners).toBeCalled();
      });

      it('should remove the listener from the native module when calling remove on the returned subscription', () => {
        const listener = jest.fn();
        const subscription = NetInfo.isConnected.addEventListener(
          'connectionChange',
          listener,
        );
        subscription.remove();
        expect(NativeModules.RNCNetInfo.removeListeners).toBeCalled();
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
        expect(NativeModules.RNCNetInfo.removeListeners).not.toBeCalled();

        subscription2.remove();
        expect(NativeModules.RNCNetInfo.removeListeners).toBeCalled();
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

        NetInfoEventEmitter.emit(NetInfo.Events.NetworkStatusDidChange, {
          type: 'cellular',
          effectiveType: '4g',
        });

        expect(listener).toBeCalledWith(true);
      });

      it('should call the listener multiple times when multiple native events are emmitted', () => {
        const listener = jest.fn();
        NetInfo.isConnected.addEventListener('connectionChange', listener);

        NetInfoEventEmitter.emit(NetInfo.Events.NetworkStatusDidChange, {
          type: 'cellular',
          effectiveType: '3g',
        });
        NetInfoEventEmitter.emit(NetInfo.Events.NetworkStatusDidChange, {
          type: 'wifi',
          effectiveType: 'unknown',
        });

        // The additional time is from the call to "getCurrentConnectivity" on listening
        expect(listener).toBeCalledTimes(3);
      });

      it('should call all listeners when the native event is emmitted', () => {
        const listener1 = jest.fn();
        const listener2 = jest.fn();
        NetInfo.isConnected.addEventListener('connectionChange', listener1);
        NetInfo.isConnected.addEventListener('connectionChange', listener2);

        NetInfoEventEmitter.emit(NetInfo.Events.NetworkStatusDidChange, {
          type: 'cellular',
          effectiveType: '2g',
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

        NetInfoEventEmitter.emit(NetInfo.Events.NetworkStatusDidChange, {
          type: 'cellular',
          effectiveType: '3g',
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

        NetInfoEventEmitter.emit(NetInfo.Events.NetworkStatusDidChange, {
          type: 'unknown',
          effectiveType: 'unknown',
        });

        expect(listener1).not.toBeCalled();
        expect(listener2).toBeCalledWith(false);
      });
    });
  });
});
