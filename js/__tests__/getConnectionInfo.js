/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @flow
 */

import NetInfo from '../index';
import {RNCNetInfo} from '../nativeInterface';

describe('react-native-netinfo', () => {
  describe('getConnectionInfo', () => {
    it('should pass on the responses when the library promise returns', () => {
      const expectedConnectionType = 'cellular';
      const expectedEffectiveConnectionType = '3g';

      RNCNetInfo.getCurrentConnectivity.mockResolvedValue({
        type: expectedConnectionType,
        effectiveType: expectedEffectiveConnectionType,
      });

      return expect(NetInfo.getConnectionInfo()).resolves.toEqual({
        type: expectedConnectionType,
        effectiveType: expectedEffectiveConnectionType,
      });
    });

    it('should pass on errors through the promise chain', () => {
      const expectedError = new Error('A test error');

      RNCNetInfo.getCurrentConnectivity.mockRejectedValue(expectedError);

      return expect(NetInfo.getConnectionInfo()).rejects.toBe(expectedError);
    });
  });
});
