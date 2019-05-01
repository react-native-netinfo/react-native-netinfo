/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {
  convertState,
  warnOnce,
  isConnected,
  isConnectionExpensive,
} from '../deprecatedUtils';
import {NetInfoState} from '../types';
import {NetInfoData} from '../deprecatedTypes';

interface TestCase {
  title: string;
  input: NetInfoState;
  isConnected: boolean;
  isExpensive: boolean;
  depreacted: NetInfoData;
}

describe('Deprecated utils', () => {
  const TEST_CASES: TestCase[] = [
    {
      title: 'None',
      input: {
        type: 'none',
        isConnected: false,
        details: null,
      },
      isConnected: false,
      isExpensive: false,
      depreacted: {
        type: 'none',
        effectiveType: 'unknown',
      },
    },
    {
      title: 'Unknown',
      input: {
        type: 'unknown',
        isConnected: false,
        details: null,
      },
      isConnected: false,
      isExpensive: false,
      depreacted: {
        type: 'unknown',
        effectiveType: 'unknown',
      },
    },
    {
      title: 'Wifi',
      input: {
        type: 'wifi',
        isConnected: true,
        details: {
          isConnectionExpensive: false,
        },
      },
      isConnected: true,
      isExpensive: false,
      depreacted: {
        type: 'wifi',
        effectiveType: 'unknown',
      },
    },
    {
      title: 'Cellular with generation',
      input: {
        type: 'cellular',
        isConnected: true,
        details: {
          isConnectionExpensive: true,
          cellularGeneration: '3g',
        },
      },
      isConnected: true,
      isExpensive: true,
      depreacted: {
        type: 'cellular',
        effectiveType: '3g',
      },
    },
    {
      title: 'Cellular without generation',
      input: {
        type: 'cellular',
        isConnected: true,
        details: {
          isConnectionExpensive: true,
          cellularGeneration: null,
        },
      },
      isConnected: true,
      isExpensive: true,
      depreacted: {
        type: 'cellular',
        effectiveType: 'unknown',
      },
    },
    {
      title: 'Bluetooth',
      input: {
        type: 'bluetooth',
        isConnected: true,
        details: {
          isConnectionExpensive: false,
        },
      },
      isConnected: true,
      isExpensive: false,
      depreacted: {
        type: 'bluetooth',
        effectiveType: 'unknown',
      },
    },
    {
      title: 'Ethernet',
      input: {
        type: 'ethernet',
        isConnected: true,
        details: {
          isConnectionExpensive: false,
        },
      },
      isConnected: true,
      isExpensive: false,
      depreacted: {
        type: 'ethernet',
        effectiveType: 'unknown',
      },
    },
    {
      title: 'Wimax',
      input: {
        type: 'wimax',
        isConnected: true,
        details: {
          isConnectionExpensive: false,
        },
      },
      isConnected: true,
      isExpensive: false,
      depreacted: {
        type: 'wimax',
        effectiveType: 'unknown',
      },
    },
  ];

  describe('convertState', () => {
    TEST_CASES.forEach(testCase => {
      it(`should convert the state correctly for ${testCase.title}`, () => {
        expect(convertState(testCase.input)).toEqual(testCase.depreacted);
      });
    });
  });

  describe('isConnected', () => {
    TEST_CASES.forEach(testCase => {
      it(`should return the correct state for ${testCase.title}`, () => {
        expect(isConnected(testCase.input)).toEqual(testCase.isConnected);
      });
    });
  });

  describe('isConnectionExpensive', () => {
    TEST_CASES.forEach(testCase => {
      describe('Android', () => {
        beforeEach(() => {
          jest.mock('Platform', () => {
            const Platform = jest.requireActual('Platform');
            Platform.OS = 'android';
            return Platform;
          });
        });

        afterEach(() => {
          jest.clearAllMocks();
        });

        it(`should return the correct state for ${
          testCase.title
        } on Android`, () => {
          expect(isConnectionExpensive(testCase.input)).toEqual(
            testCase.isExpensive,
          );
        });
      });
    });
  });

  describe('warnOnce', () => {
    it('logs warning messages to the console exactly once', () => {
      console.warn = jest.fn();

      warnOnce('test-message', 'This is a log message');
      warnOnce('test-message', 'This is a second log message');

      expect(console.warn).toHaveBeenCalledWith('This is a log message');
      expect(console.warn).toHaveBeenCalledTimes(1);
    });
  });
});
