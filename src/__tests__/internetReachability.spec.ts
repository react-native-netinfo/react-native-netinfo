/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import defaultConfiguration from '../internal/defaultConfiguration';
import InternetReachability from '../internal/internetReachability';
import type {NetInfoNativeModuleState} from '../internal/privateTypes';

describe('InternetReachability', () => {
  let hadFetch: boolean;
  let originalFetch: typeof fetch | undefined;

  beforeEach(() => {
    jest.useFakeTimers();
    hadFetch = 'fetch' in global;
    originalFetch = global.fetch;
    Object.defineProperty(global, 'fetch', {
      configurable: true,
      writable: true,
      value: jest.fn(() => new Promise<Response>(() => undefined)),
    });
  });

  afterEach(() => {
    if (hadFetch) {
      global.fetch = originalFetch as typeof fetch;
    } else {
      Reflect.deleteProperty(global, 'fetch');
    }
    jest.restoreAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('does not clear a request timeout after it has fired', async () => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
    const listener = jest.fn();
    const internetReachability = new InternetReachability(
      {
        ...defaultConfiguration,
        useNativeReachability: false,
        reachabilityRequestTimeout: 100,
        reachabilityShortTimeout: 1_000,
      },
      listener,
    );

    internetReachability.update({
      type: 'wifi',
      isConnected: true,
    } as NetInfoNativeModuleState);
    await jest.advanceTimersByTimeAsync(100);

    expect(listener).toHaveBeenLastCalledWith(false);
    expect(clearTimeoutSpy).not.toHaveBeenCalled();

    internetReachability.tearDown();
  });
});
