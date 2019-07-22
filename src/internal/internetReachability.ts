/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import * as Types from './types';
import * as PrivateTypes from './privateTypes';

let reachabilityUrl = 'https://clients3.google.com/generate_204';
let reachabilityTest: Types.NetInfoInternetReachabilityTest = (
  response,
): boolean => response.status === 204;

const LONG_TIMEOUT = 60 * 1000; // 60s
const SHORT_TIMEOUT = 5 * 1000; // 5s

const _subscriptions = new Set<
  PrivateTypes.NetInfoInternetReachabilityChangeListener
>();
let _isInternetReachable: boolean | null = null;
let _currentInternetReachabilityCheckHandler: InternetReachabilityCheckHandler | null = null;
let _currentTimeoutHandle: number | null = null;
let _lastState: PrivateTypes.NetInfoNativeModuleState | null = null;

function setIsInternetReachable(isInternetReachable: boolean | null): void {
  if (_isInternetReachable === isInternetReachable) {
    return;
  }

  _isInternetReachable = isInternetReachable;
  _subscriptions.forEach(
    (listener): void => {
      listener(_isInternetReachable);
    },
  );
}

interface InternetReachabilityCheckHandler {
  promise: Promise<void>;
  cancel: () => void;
}
function checkInternetReachability(): InternetReachabilityCheckHandler {
  // We wraop the promise to allow us to cancel the pending request, if needed
  let hasCanceled = false;

  const promise = fetch(reachabilityUrl)
    .then(
      (response): void => {
        if (!hasCanceled) {
          const testResult = reachabilityTest(response);
          setIsInternetReachable(testResult);
          const nextTimeoutInterval = _isInternetReachable
            ? LONG_TIMEOUT
            : SHORT_TIMEOUT;
          _currentTimeoutHandle = setTimeout(
            checkInternetReachability,
            nextTimeoutInterval,
          );
        }
      },
    )
    .catch(
      (): void => {
        setIsInternetReachable(false);
        _currentTimeoutHandle = setTimeout(
          checkInternetReachability,
          SHORT_TIMEOUT,
        );
      },
    );

  return {
    promise,
    cancel: (): void => {
      hasCanceled = true;
    },
  };
}

function setExpectsConnection(expectsConnection: boolean): void {
  // Cancel any pending check
  if (_currentInternetReachabilityCheckHandler !== null) {
    _currentInternetReachabilityCheckHandler.cancel();
    _currentInternetReachabilityCheckHandler = null;
  }
  // Cancel any pending timeout
  if (_currentTimeoutHandle !== null) {
    clearTimeout(_currentTimeoutHandle);
    _currentTimeoutHandle = null;
  }

  if (expectsConnection) {
    // If we expect a connection, start the process for finding if we have one
    // Set the state to "null" if it was previously false
    if (!_isInternetReachable) {
      setIsInternetReachable(null);
    }
    // Start a network request to check for internet
    _currentInternetReachabilityCheckHandler = checkInternetReachability();
  } else {
    // If we don't expect a connection, just change the state to "false"
    setIsInternetReachable(false);
  }
}

export function clear(): void {
  // Cancel any pending check
  if (_currentInternetReachabilityCheckHandler !== null) {
    _currentInternetReachabilityCheckHandler.cancel();
    _currentInternetReachabilityCheckHandler = null;
  }

  // Cancel any pending timeout
  if (_currentTimeoutHandle !== null) {
    clearTimeout(_currentTimeoutHandle);
    _currentTimeoutHandle = null;
  }

  // Clear the subscriptions
  _subscriptions.clear();
}

export function update(state: PrivateTypes.NetInfoNativeModuleState): void {
  _lastState = state;
  if (typeof state.isInternetReachable === 'boolean') {
    setIsInternetReachable(state.isInternetReachable);
  } else {
    setExpectsConnection(state.isConnected);
  }
}

export function currentState(): boolean | null {
  return _isInternetReachable;
}

export function addSubscription(
  listener: PrivateTypes.NetInfoInternetReachabilityChangeListener,
): () => void {
  _subscriptions.add(listener);

  return (): void => {
    _subscriptions.delete(listener);
  };
}

export function setCustomTest(
  url: string,
  test: Types.NetInfoInternetReachabilityTest,
): void {
  // Set the new URL and test
  reachabilityUrl = url;
  reachabilityTest = test;

  // If we have some state, call "update" with it again to trigger the new custom reachability check
  if (_lastState) {
    update(_lastState);
  }
}

export default {
  update,
  currentState,
  clear,
  addSubscription,
  setCustomTest,
};
