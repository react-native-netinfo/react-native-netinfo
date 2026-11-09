/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import InternetReachability from '../internal/internetReachability';
import {NetInfoNativeModuleState} from '../internal/privateTypes';
import {NetInfoConfiguration} from '../internal/types';

interface Probe {
  signal: AbortSignal;
  reject: (error: Error) => void;
  resolve: (status: number) => void;
}

const configuration: NetInfoConfiguration = {
  reachabilityUrl: 'https://clients3.google.com/generate_204',
  reachabilityMethod: 'HEAD',
  reachabilityHeaders: {},
  reachabilityTest: (response: Response): Promise<boolean> =>
    Promise.resolve(response.status === 204),
  reachabilityShortTimeout: 5 * 1000,
  reachabilityLongTimeout: 60 * 1000,
  reachabilityRequestTimeout: 15 * 1000,
  reachabilityShouldRun: (): boolean => true,
  shouldFetchWiFiSSID: false,
  useNativeReachability: true,
};

// A platform that reports no reachability of its own, such as iOS
const connectedState = {
  type: 'wifi',
  isConnected: true,
  details: null,
} as unknown as NetInfoNativeModuleState;

const SUSPENSION = 52 * 60 * 1000;

const flush = (): Promise<void> => jest.advanceTimersByTimeAsync(0);

// While the app is suspended nothing runs, and the wall clock moves on. When
// it resumes, every overdue timer fires at once, and promise reactions run
// after them, together with those of a request that failed at the same
// moment. A synchronous advance does the same: it fires the timers that fall
// due without running promise reactions in between.
const suspendAndResume = async (onResume?: () => void): Promise<void> => {
  onResume?.();
  jest.advanceTimersByTime(SUSPENSION);
  await flush();
};

describe('InternetReachability', () => {
  const realFetch = global.fetch;
  let probes: Probe[];
  let listener: jest.Mock;
  let reachability: InternetReachability;

  beforeEach(() => {
    jest.useFakeTimers();
    probes = [];
    global.fetch = jest.fn(
      (_input: RequestInfo | URL, init?: RequestInit): Promise<Response> =>
        new Promise<Response>((resolve, reject): void => {
          probes.push({
            signal: init?.signal as AbortSignal,
            reject,
            resolve: (status: number): void =>
              resolve({status} as Response),
          });
        }),
    ) as typeof global.fetch;
    listener = jest.fn();
    reachability = new InternetReachability(configuration, listener);
  });

  afterEach(() => {
    reachability.tearDown();
    global.fetch = realFetch;
    jest.useRealTimers();
  });

  const startPeriodicCheck = async (): Promise<void> => {
    reachability.update(connectedState);
    probes[0].resolve(204);
    await flush();
    expect(listener.mock.calls).toEqual([[null], [true]]);

    await jest.advanceTimersByTimeAsync(
      configuration.reachabilityLongTimeout,
    );
    expect(probes).toHaveLength(2);
  };

  describe('when the app is suspended during a check', () => {
    it.each([
      ['the overdue request timeout fires', undefined],
      [
        'the request fails',
        (): void => probes[1].reject(new TypeError('Network request failed')),
      ],
    ])(
      'repeats the check instead of reporting no internet when %s on resume',
      async (_, onResume) => {
        await startPeriodicCheck();
        await jest.advanceTimersByTimeAsync(5 * 1000);

        await suspendAndResume(onResume);

        expect(listener.mock.calls).toEqual([[null], [true]]);
        expect(probes).toHaveLength(3);
        expect(probes[1].signal.aborted).toBe(true);

        probes[2].resolve(204);
        await flush();
        expect(listener.mock.calls).toEqual([[null], [true]]);
        await jest.advanceTimersByTimeAsync(
          configuration.reachabilityLongTimeout,
        );
        expect(probes).toHaveLength(4);
      },
    );

    it('reports no internet when the repeated check fails', async () => {
      await startPeriodicCheck();
      await suspendAndResume();

      probes[2].reject(new TypeError('Network request failed'));
      await flush();

      expect(listener).toHaveBeenLastCalledWith(false);
      await jest.advanceTimersByTimeAsync(
        configuration.reachabilityShortTimeout,
      );
      expect(probes).toHaveLength(4);
    });
  });

  describe('while the app runs', () => {
    it.each([
      [
        'times out',
        (): Promise<void> =>
          jest.advanceTimersByTimeAsync(
            configuration.reachabilityRequestTimeout,
          ),
      ],
      [
        'fails',
        (): Promise<void> => {
          probes[1].reject(new TypeError('Network request failed'));
          return flush();
        },
      ],
    ])(
      'reports no internet when a check %s and retries it',
      async (_, fail) => {
        await startPeriodicCheck();

        await fail();

        expect(listener).toHaveBeenLastCalledWith(false);
        expect(probes).toHaveLength(2);
        await jest.advanceTimersByTimeAsync(
          configuration.reachabilityShortTimeout,
        );
        expect(probes).toHaveLength(3);
      },
    );
  });
});
