/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import * as PrivateTypes from './privateTypes';

const REACHABILITY_URL = 'https://clients3.google.com/generate_204';
const LONG_TIMEOUT = 60 * 1000; // 60s
const SHORT_TIMEOUT = 5 * 1000; // 5s

const _subscriptions = new Set<
  PrivateTypes.NetInfoInternetReachabilityChangeListener
>();
let _isInternetReachable: boolean | null = null;
let _currentInternetReachabilityCheckHandler: InternetReachabilityCheckHandler | null = null;
let _currentTimeoutHandle: number | null = null;

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

  const promise = fetch(REACHABILITY_URL)
    .then(
      (response): void => {
        if (!hasCanceled) {
          setIsInternetReachable(response.status === 204);
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

export default {
  update,
  currentState,
  clear,
  addSubscription,
};
