/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @flow
 */

jest.mock('Platform', () => {
  const Platform = jest.requireActual('Platform');
  Platform.OS = 'android';
  return Platform;
});

import NetInfo from '../index';
import {RNCNetInfo} from '../nativeInterface';

describe('react-native-netinfo', () => {
  describe('isConnectionExpensive', () => {
    describe('Android', () => {
      it('should pass on errors through the promise chain', () => {
        const expectedError = new Error('A test error');
        RNCNetInfo.isConnectionMetered.mockRejectedValue(expectedError);
        return expect(NetInfo.isConnectionExpensive()).rejects.toBe(
          expectedError,
        );
      });
    });
  });
});
