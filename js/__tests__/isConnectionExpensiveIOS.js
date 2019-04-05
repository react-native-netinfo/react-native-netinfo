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
  Platform.OS = 'ios';
  return Platform;
});

import NetInfo from '../index';

describe('react-native-netinfo', () => {
  describe('isConnectionExpensive', () => {
    describe('iOS', () => {
      it('should reject with an error when called', () => {
        return expect(NetInfo.isConnectionExpensive()).rejects.toThrowError();
      });
    });
  });
});
