/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import fetchMock from 'jest-fetch-mock';
import NetInfo from '../index';
import NativeInterface from '../internal/nativeInterface';
import {NetInfoStateType, NetInfoCellularGeneration} from '../internal/types';
import {DEVICE_CONNECTIVITY_EVENT} from '../internal/privateTypes';

// Mock modules
fetchMock.enableMocks();
jest.mock('../internal/nativeModule');
const mockNativeModule = jest.requireMock('../internal/nativeModule').default;

beforeEach(() => {
  mockNativeModule.getCurrentState.mockReset();
});

describe('@react-native-community/netinfo fetch', () => {
  describe('with cellular data types', () => {
    describe('5g cellular generation', () => {
      function dataProvider() {
        return [
          {
            description:
              'should resolve the promise correctly with expected 5g settings',
            expectedConnectionInfo: {
              type: NetInfoStateType.cellular,
              isConnected: true,
              isInternetReachable: true,
              details: {
                isConnectionExpensive: true,
                cellularGeneration: NetInfoCellularGeneration['5g'],
              },
            },
          },
          {
            description:
              'should resolve the promise correctly when 5g returns not connected',
            expectedConnectionInfo: {
              type: NetInfoStateType.cellular,
              isConnected: false,
              isInternetReachable: true,
              details: {
                isConnectionExpensive: true,
                cellularGeneration: NetInfoCellularGeneration['5g'],
              },
            },
          },
          {
            description:
              'should resolve the promise correctly when 5g returns internet not reachable',
            expectedConnectionInfo: {
              type: NetInfoStateType.cellular,
              isConnected: true,
              isInternetReachable: false,
              details: {
                isConnectionExpensive: true,
                cellularGeneration: NetInfoCellularGeneration['5g'],
              },
            },
          },
        ];
      }

      dataProvider().forEach(testCase => {
        it(testCase.description, () => {
          mockNativeModule.getCurrentState.mockResolvedValue(
            testCase.expectedConnectionInfo,
          );

          NativeInterface.eventEmitter.emit(
            DEVICE_CONNECTIVITY_EVENT,
            testCase.expectedConnectionInfo,
          );
          expect(NetInfo.fetch()).resolves.toEqual(
            testCase.expectedConnectionInfo,
          );
        });
      });
    });

    describe('4g cellular generation', () => {
      function dataProvider() {
        return [
          {
            description:
              'should resolve the promise correctly with expected 4g settings',
            expectedConnectionInfo: {
              type: NetInfoStateType.cellular,
              isConnected: true,
              isInternetReachable: true,
              details: {
                isConnectionExpensive: true,
                cellularGeneration: NetInfoCellularGeneration['4g'],
              },
            },
          },
          {
            description:
              'should resolve the promise correctly when 4g returns not connected',
            expectedConnectionInfo: {
              type: NetInfoStateType.cellular,
              isConnected: false,
              isInternetReachable: true,
              details: {
                isConnectionExpensive: true,
                cellularGeneration: NetInfoCellularGeneration['4g'],
              },
            },
          },
          {
            description:
              'should resolve the promise correctly when 4g returns internet not reachable',
            expectedConnectionInfo: {
              type: NetInfoStateType.cellular,
              isConnected: true,
              isInternetReachable: false,
              details: {
                isConnectionExpensive: true,
                cellularGeneration: NetInfoCellularGeneration['4g'],
              },
            },
          },
        ];
      }

      dataProvider().forEach(testCase => {
        it(testCase.description, () => {
          mockNativeModule.getCurrentState.mockResolvedValue(
            testCase.expectedConnectionInfo,
          );

          NativeInterface.eventEmitter.emit(
            DEVICE_CONNECTIVITY_EVENT,
            testCase.expectedConnectionInfo,
          );
          expect(NetInfo.fetch()).resolves.toEqual(
            testCase.expectedConnectionInfo,
          );
        });
      });
    });

    describe('3g cellular generation', () => {
      function dataProvider() {
        return [
          {
            description:
              'should resolve the promise correctly with expected settings',
            expectedConnectionInfo: {
              type: NetInfoStateType.cellular,
              isConnected: true,
              isInternetReachable: true,
              details: {
                isConnectionExpensive: true,
                cellularGeneration: NetInfoCellularGeneration['3g'],
              },
            },
          },
          {
            description:
              'should resolve the promise correctly when not connected',
            expectedConnectionInfo: {
              type: NetInfoStateType.cellular,
              isConnected: false,
              isInternetReachable: true,
              details: {
                isConnectionExpensive: true,
                cellularGeneration: NetInfoCellularGeneration['3g'],
              },
            },
          },
          {
            description:
              'should resolve the promise correctly when internet is not reachable',
            expectedConnectionInfo: {
              type: NetInfoStateType.cellular,
              isConnected: true,
              isInternetReachable: false,
              details: {
                isConnectionExpensive: true,
                cellularGeneration: NetInfoCellularGeneration['3g'],
              },
            },
          },
        ];
      }

      dataProvider().forEach(testCase => {
        it(testCase.description, () => {
          mockNativeModule.getCurrentState.mockResolvedValue(
            testCase.expectedConnectionInfo,
          );

          NativeInterface.eventEmitter.emit(
            DEVICE_CONNECTIVITY_EVENT,
            testCase.expectedConnectionInfo,
          );
          expect(NetInfo.fetch()).resolves.toEqual(
            testCase.expectedConnectionInfo,
          );
        });
      });
    });

    describe('2g cellular generation', () => {
      function dataProvider() {
        return [
          {
            description:
              'should resolve the promise correctly with expected settings',
            expectedConnectionInfo: {
              type: NetInfoStateType.cellular,
              isConnected: true,
              isInternetReachable: true,
              details: {
                isConnectionExpensive: true,
                cellularGeneration: NetInfoCellularGeneration['2g'],
              },
            },
          },
          {
            description:
              'should resolve the promise correctly when not connected',
            expectedConnectionInfo: {
              type: NetInfoStateType.cellular,
              isConnected: false,
              isInternetReachable: true,
              details: {
                isConnectionExpensive: true,
                cellularGeneration: NetInfoCellularGeneration['2g'],
              },
            },
          },
          {
            description:
              'should resolve the promise correctly when internet is not reachable',
            expectedConnectionInfo: {
              type: NetInfoStateType.cellular,
              isConnected: true,
              isInternetReachable: false,
              details: {
                isConnectionExpensive: true,
                cellularGeneration: NetInfoCellularGeneration['2g'],
              },
            },
          },
        ];
      }

      dataProvider().forEach(testCase => {
        it(testCase.description, () => {
          mockNativeModule.getCurrentState.mockResolvedValue(
            testCase.expectedConnectionInfo,
          );

          NativeInterface.eventEmitter.emit(
            DEVICE_CONNECTIVITY_EVENT,
            testCase.expectedConnectionInfo,
          );
          expect(NetInfo.fetch()).resolves.toEqual(
            testCase.expectedConnectionInfo,
          );
        });
      });
    });

    describe('null cellular generation', () => {
      function dataProvider() {
        return [
          {
            description:
              'should resolve the promise correctly with expected settings',
            expectedConnectionInfo: {
              type: NetInfoStateType.cellular,
              isConnected: true,
              isInternetReachable: true,
              details: {
                isConnectionExpensive: true,
                cellularGeneration: null,
              },
            },
          },
          {
            description:
              'should resolve the promise correctly when not connected',
            expectedConnectionInfo: {
              type: NetInfoStateType.cellular,
              isConnected: false,
              isInternetReachable: true,
              details: {
                isConnectionExpensive: true,
                cellularGeneration: null,
              },
            },
          },
          {
            description:
              'should resolve the promise correctly when internet is not reachable',
            expectedConnectionInfo: {
              type: NetInfoStateType.cellular,
              isConnected: true,
              isInternetReachable: false,
              details: {
                isConnectionExpensive: true,
                cellularGeneration: null,
              },
            },
          },
        ];
      }

      dataProvider().forEach(testCase => {
        it(testCase.description, () => {
          mockNativeModule.getCurrentState.mockResolvedValue(
            testCase.expectedConnectionInfo,
          );

          NativeInterface.eventEmitter.emit(
            DEVICE_CONNECTIVITY_EVENT,
            testCase.expectedConnectionInfo,
          );
          expect(NetInfo.fetch()).resolves.toEqual(
            testCase.expectedConnectionInfo,
          );
        });
      });
    });
  });

  describe('with unknown and no connection data types', () => {
    function dataProvider() {
      return [
        {
          description:
            'should resolve the promise correctly when no connection is established (airplane mode)',
          expectedConnectionInfo: {
            type: NetInfoStateType.none,
            isConnected: false,
            isInternetReachable: true,
            details: null,
          },
        },
        {
          description:
            'should resolve the promise correctly when connection type cannot be determined',
          expectedConnectionInfo: {
            type: NetInfoStateType.unknown,
            isConnected: false,
            isInternetReachable: true,
            details: null,
          },
        },
      ];
    }

    dataProvider().forEach(testCase => {
      it(testCase.description, () => {
        mockNativeModule.getCurrentState.mockResolvedValue(
          testCase.expectedConnectionInfo,
        );

        NativeInterface.eventEmitter.emit(
          DEVICE_CONNECTIVITY_EVENT,
          testCase.expectedConnectionInfo,
        );
        expect(NetInfo.fetch()).resolves.toEqual(
          testCase.expectedConnectionInfo,
        );
      });
    });
  });

  describe('rejected promises are handled', () => {
    it('will properly reject a promise if the connection request cannot be resolved', async () => {
      const rejectionMessage = 'nope, no connection info for you';

      // Mock `_fetchCurrentState` in the State constructor.
      mockNativeModule.getCurrentState.mockResolvedValueOnce({
        type: NetInfoStateType.cellular,
        isConnected: true,
        isInternetReachable: true,
        details: {
          isConnectionExpensive: true,
          cellularGeneration: NetInfoCellularGeneration['4g'],
        },
      });

      mockNativeModule.getCurrentState.mockRejectedValue(
        new Error(rejectionMessage),
      );

      try {
        await NetInfo.fetch();
      } catch (error) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(error.message).toMatch(rejectionMessage);
      }
    });
  });

  describe('with configuration options', () => {
    beforeAll(() => {
      // Prevent `_checkInternetReachability` from rescheduling.
      jest.useFakeTimers();
    });

    beforeEach(() => {
      fetchMock.resetMocks();
    });

    describe('reachabilityShouldRun', () => {
      function dataProvider() {
        return [
          {
            description: 'reachabilityShouldRun returns true',
            configuration: {
              reachabilityShouldRun: () => true,
            },
            expectedConnectionInfo: {
              type: 'wifi',
              isConnected: true,
              details: {
                isConnectionExpensive: true,
                cellularGeneration: 'unknown',
              },
            },
            expectedIsInternetReachable: null,
            expectFetchToBeCalled: true,
          },
          {
            description: 'reachabilityShouldRun returns false',
            configuration: {
              reachabilityShouldRun: () => false,
            },
            expectedConnectionInfo: {
              type: 'wifi',
              isConnected: true,
              details: {
                isConnectionExpensive: true,
                cellularGeneration: 'unknown',
              },
            },
            expectedIsInternetReachable: false,
            expectFetchToBeCalled: false,
          },
        ];
      }

      dataProvider().forEach(testCase => {
        it(testCase.description, async () => {
          mockNativeModule.getCurrentState.mockResolvedValue(
            testCase.expectedConnectionInfo,
          );

          // Configure NetInfo.
          NetInfo.configure(testCase.configuration);

          await expect(NetInfo.fetch()).resolves.toEqual({
            ...testCase.expectedConnectionInfo,
            isInternetReachable: testCase.expectedIsInternetReachable,
          });

          testCase.expectFetchToBeCalled
            ? expect(fetchMock).toHaveBeenCalled()
            : expect(fetchMock).not.toHaveBeenCalled();
        });
      });
    });
  });
});
