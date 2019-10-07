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
import {
  NetInfoState,
  NetInfoStateType,
  NetInfoCellularGeneration,
} from '../types';
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
        type: NetInfoStateType.none,
        isConnected: false,
        isInternetReachable: false,
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
        type: NetInfoStateType.unknown,
        isConnected: false,
        isInternetReachable: false,
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
        type: NetInfoStateType.wifi,
        isConnected: true,
        isInternetReachable: true,
        details: {
          isConnectionExpensive: false,
          ipAddress: '1.2.3.4',
          subnet: '0.0.0.0',
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
        type: NetInfoStateType.cellular,
        isConnected: true,
        isInternetReachable: true,
        details: {
          isConnectionExpensive: true,
          cellularGeneration: NetInfoCellularGeneration['3g'],
          carrier: 'carrier',
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
        type: NetInfoStateType.cellular,
        isConnected: true,
        isInternetReachable: true,
        details: {
          isConnectionExpensive: true,
          cellularGeneration: null,
          carrier: 'carrier',
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
        type: NetInfoStateType.bluetooth,
        isConnected: true,
        isInternetReachable: true,
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
        type: NetInfoStateType.ethernet,
        isConnected: true,
        isInternetReachable: true,
        details: {
          isConnectionExpensive: false,
          ipAddress: '1.2.3.4',
          subnet: '0.0.0.0',
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
        type: NetInfoStateType.wimax,
        isConnected: true,
        isInternetReachable: true,
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
    {
      title: 'VPN',
      input: {
        type: NetInfoStateType.vpn,
        isConnected: true,
        isInternetReachable: true,
        details: {
          isConnectionExpensive: false,
        },
      },
      isConnected: true,
      isExpensive: false,
      depreacted: {
        type: 'unknown',
        effectiveType: 'unknown',
      },
    },
    {
      title: 'Other',
      input: {
        type: NetInfoStateType.other,
        isConnected: true,
        isInternetReachable: true,
        details: {
          isConnectionExpensive: false,
        },
      },
      isConnected: true,
      isExpensive: false,
      depreacted: {
        type: 'unknown',
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

      warnOnce();
      warnOnce();

      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('Warning:'),
      );
      expect(console.warn).toHaveBeenCalledTimes(1);
    });
  });
});
