/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import fetchMock from 'jest-fetch-mock';
import DEFAULT_CONFIGURATION from '../internal/defaultConfiguration';
import InternetReachability from '../internal/internetReachability';
import {NetInfoStateType} from '../internal/types';

fetchMock.enableMocks();

const createConfiguration = () => ({
  ...DEFAULT_CONFIGURATION,
  reachabilityLongTimeout: 1000,
  reachabilityShortTimeout: 100,
  reachabilityRequestTimeout: 50,
  useNativeReachability: false,
});

const connectedState = {
  type: NetInfoStateType.wifi,
  isConnected: true,
  details: {
    isConnectionExpensive: false,
    ssid: 'test-ssid',
    bssid: '00:00:00:00:00:00',
    strength: 0,
    ipAddress: '192.168.0.1',
    subnet: '255.255.255.0',
    frequency: 0,
    linkSpeed: 0,
    rxLinkSpeed: 0,
    txLinkSpeed: 0,
  },
};

describe('reportConnected', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('cancels any in-flight reachability request', async () => {
    let capturedSignal: AbortSignal | undefined;
    fetchMock.mockImplementation((_, options) => {
      if (capturedSignal == null) {
        capturedSignal = options?.signal as AbortSignal | undefined;
      }
      return new Promise(() => {});
    });

    const configuration = createConfiguration();
    const listener = jest.fn();
    const reachability = new InternetReachability(configuration, listener);

    reachability.update(connectedState);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(capturedSignal).toBeDefined();
    expect(capturedSignal?.aborted).toBe(false);

    reachability.reportConnected();

    await jest.runOnlyPendingTimersAsync();

    expect(capturedSignal?.aborted).toBe(true);
    expect(listener).toHaveBeenCalledWith(true);
  });

  it('delays the next reachability request until the long timeout', () => {
    fetchMock.mockImplementation(() => new Promise(() => {}));
    const configuration = createConfiguration();
    const listener = jest.fn();
    const reachability = new InternetReachability(configuration, listener);

    reachability.update(connectedState);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    reachability.reportConnected();

    jest.advanceTimersByTime(configuration.reachabilityLongTimeout - 1);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(1);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
