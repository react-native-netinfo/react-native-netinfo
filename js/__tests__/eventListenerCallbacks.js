/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @flow
 */
/* eslint-env jest */

import NetInfo from '../index';
import {NetInfoEventEmitter} from '../nativeInterface';

describe('react-native-netinfo', () => {
  describe('Event listener callbacks', () => {
    it('should call the listener when the native event is emmitted', () => {
      const listener = jest.fn();
      NetInfo.addEventListener('connectionChange', listener);

      const expectedConnectionType = 'cellular';
      const expectedEffectiveConnectionType = '3g';

      NetInfoEventEmitter.emit(NetInfo.Events.NetworkStatusDidChange, {
        connectionType: expectedConnectionType,
        effectiveConnectionType: expectedEffectiveConnectionType,
      });

      expect(listener).toBeCalledWith({
        type: expectedConnectionType,
        effectiveType: expectedEffectiveConnectionType,
      });
    });

    it('should call the listener multiple times when multiple native events are emmitted', () => {
      const listener = jest.fn();
      NetInfo.addEventListener('connectionChange', listener);

      NetInfoEventEmitter.emit(NetInfo.Events.NetworkStatusDidChange, {
        connectionType: 'cellular',
        effectiveConnectionType: '3g',
      });
      NetInfoEventEmitter.emit(NetInfo.Events.NetworkStatusDidChange, {
        connectionType: 'wifi',
        effectiveConnectionType: 'unknown',
      });

      expect(listener).toBeCalledTimes(2);
    });

    it('should call all listeners when the native event is emmitted', () => {
      const listener1 = jest.fn();
      const listener2 = jest.fn();
      NetInfo.addEventListener('connectionChange', listener1);
      NetInfo.addEventListener('connectionChange', listener2);

      const expectedConnectionType = 'cellular';
      const expectedEffectiveConnectionType = '3g';

      NetInfoEventEmitter.emit(NetInfo.Events.NetworkStatusDidChange, {
        connectionType: expectedConnectionType,
        effectiveConnectionType: expectedEffectiveConnectionType,
      });

      const expectedResults = {
        type: expectedConnectionType,
        effectiveType: expectedEffectiveConnectionType,
      };

      expect(listener1).toBeCalledWith(expectedResults);
      expect(listener2).toBeCalledWith(expectedResults);
    });

    it('should not call the listener after being removed', () => {
      const listener = jest.fn();
      NetInfo.addEventListener('connectionChange', listener);
      NetInfo.removeEventListener('connectionChange', listener);

      NetInfoEventEmitter.emit(NetInfo.Events.NetworkStatusDidChange, {
        connectionType: 'cellular',
        effectiveConnectionType: '3g',
      });

      expect(listener).not.toBeCalled();
    });

    it('should call the remaining listeners when one has been removed', () => {
      const listener1 = jest.fn();
      const listener2 = jest.fn();
      NetInfo.addEventListener('connectionChange', listener1);
      NetInfo.addEventListener('connectionChange', listener2);

      NetInfo.removeEventListener('connectionChange', listener1);

      const expectedConnectionType = 'cellular';
      const expectedEffectiveConnectionType = '3g';

      NetInfoEventEmitter.emit(NetInfo.Events.NetworkStatusDidChange, {
        connectionType: expectedConnectionType,
        effectiveConnectionType: expectedEffectiveConnectionType,
      });

      expect(listener1).not.toBeCalled();
      expect(listener2).toBeCalledWith({
        type: expectedConnectionType,
        effectiveType: expectedEffectiveConnectionType,
      });
    });
  });
});
