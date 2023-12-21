/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import * as PrivateTypes from './privateTypes';
import * as Types from './types';

interface InternetReachabilityCheckHandler {
  promise: Promise<void>;
  cancel: () => void;
}

export default class InternetReachability {
  private _configuration: Types.NetInfoConfiguration;
  private _listener: PrivateTypes.NetInfoInternetReachabilityChangeListener;
  private _isInternetReachable: boolean | null | undefined = undefined;
  private _currentInternetReachabilityCheckHandler: InternetReachabilityCheckHandler | null = null;
  private _currentTimeoutHandle: ReturnType<typeof setTimeout> | null = null;

  constructor(
    configuration: Types.NetInfoConfiguration,
    listener: PrivateTypes.NetInfoInternetReachabilityChangeListener,
  ) {
    this._configuration = configuration;
    this._listener = listener;
  }

  private _setIsInternetReachable = (
    isInternetReachable: boolean | null,
  ): void => {
    if (this._isInternetReachable === isInternetReachable) {
      return;
    }

    this._isInternetReachable = isInternetReachable;
    this._listener(this._isInternetReachable);
  };

  private _setExpectsConnection = (expectsConnection: boolean | null): void => {
    // Cancel any pending check
    if (this._currentInternetReachabilityCheckHandler !== null) {
      this._currentInternetReachabilityCheckHandler.cancel();
      this._currentInternetReachabilityCheckHandler = null;
    }
    // Cancel any pending timeout
    if (this._currentTimeoutHandle !== null) {
      clearTimeout(this._currentTimeoutHandle);
      this._currentTimeoutHandle = null;
    }

    if (expectsConnection && this._configuration.reachabilityShouldRun()) {
      // If we expect a connection, start the process for finding if we have one
      // Set the state to "null" if it was previously false
      if (!this._isInternetReachable) {
        this._setIsInternetReachable(null);
      }
      // Start a network request to check for internet
      this._currentInternetReachabilityCheckHandler = this._checkInternetReachability();
    } else {
      // If we don't expect a connection or don't run reachability check, just change the state to "false"
      this._setIsInternetReachable(false);
    }
  };

  private _checkInternetReachability = (): InternetReachabilityCheckHandler => {
    const controller = new AbortController();

    const responsePromise = fetch(this._configuration.reachabilityUrl, {
      headers: this._configuration.reachabilityHeaders,
      method: this._configuration.reachabilityMethod,
      cache: 'no-cache',
      signal: controller.signal,
    });

    // Create promise that will reject after the request timeout has been reached
    let timeoutHandle: ReturnType<typeof setTimeout>;
    const timeoutPromise = new Promise<Response>((_, reject): void => {
      timeoutHandle = setTimeout(
        (): void => reject('timedout'),
        this._configuration.reachabilityRequestTimeout,
      );
    });

    // Create promise that makes it possible to cancel a pending request through a reject
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    let cancel: () => void = (): void => {};
    const cancelPromise = new Promise<Response>((_, reject): void => {
      cancel = (): void => reject('canceled');
    });

    const promise = Promise.race([
      responsePromise,
      timeoutPromise,
      cancelPromise,
    ])
      .then(
        (response): Promise<boolean> => {
          return this._configuration.reachabilityTest(response);
        },
      )
      .then(
        (result): void => {
          this._setIsInternetReachable(result);
          const nextTimeoutInterval = this._isInternetReachable
            ? this._configuration.reachabilityLongTimeout
            : this._configuration.reachabilityShortTimeout;
          this._currentTimeoutHandle = setTimeout(
            this._checkInternetReachability,
            nextTimeoutInterval,
          );
        },
      )
      .catch(
        (error: Error | 'timedout' | 'canceled'): void => {
          if ('canceled' === error) {
            controller.abort();
          } else {
            if ('timedout' === error) {
              controller.abort();
            }
            
            this._setIsInternetReachable(false);
            this._currentTimeoutHandle = setTimeout(
              this._checkInternetReachability,
              this._configuration.reachabilityShortTimeout,
            );
          }
        },
      )
      // Clear request timeout and propagate any errors
      .then(
        (): void => {
          clearTimeout(timeoutHandle);
        },
        (error: Error): void => {
          clearTimeout(timeoutHandle);
          throw error;
        },
      );

    return {
      promise,
      cancel,
    };
  };

  public update = (state: PrivateTypes.NetInfoNativeModuleState): void => {
    if (
      typeof state.isInternetReachable === 'boolean' &&
      this._configuration.useNativeReachability
    ) {
      this._setIsInternetReachable(state.isInternetReachable);
    } else {
      this._setExpectsConnection(state.isConnected);
    }
  };

  public currentState = (): boolean | null | undefined => {
    return this._isInternetReachable;
  };

  public tearDown = (): void => {
    // Cancel any pending check
    if (this._currentInternetReachabilityCheckHandler !== null) {
      this._currentInternetReachabilityCheckHandler.cancel();
      this._currentInternetReachabilityCheckHandler = null;
    }

    // Cancel any pending timeout
    if (this._currentTimeoutHandle !== null) {
      clearTimeout(this._currentTimeoutHandle);
      this._currentTimeoutHandle = null;
    }
  };
}
