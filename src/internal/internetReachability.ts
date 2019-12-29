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
    isInternetReachable: boolean | null | undefined,
  ): void => {
    if (this._isInternetReachable === isInternetReachable) {
      return;
    }

    this._isInternetReachable = isInternetReachable;
    this._listener(this._isInternetReachable);
  };

  private _setExpectsConnection = (expectsConnection: boolean): void => {
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

    if (expectsConnection) {
      // If we expect a connection, start the process for finding if we have one
      // Set the state to "null" if it was previously false
      if (!this._isInternetReachable) {
        this._setIsInternetReachable(null);
      }
      // Start a network request to check for internet
      this._currentInternetReachabilityCheckHandler = this._checkInternetReachability();
    } else {
      // If we don't expect a connection, just change the state to "false"
      this._setIsInternetReachable(false);
    }
  };

  private _checkInternetReachability = (): InternetReachabilityCheckHandler => {
    // We wrap the promise to allow us to cancel the pending request, if needed
    let hasCanceled = false;

    const promise = fetch(this._configuration.reachabilityUrl)
      .then(
        (response): Promise<boolean | 'canceled'> => {
          if (!hasCanceled) {
            return this._configuration.reachabilityTest(response);
          } else {
            return Promise.resolve('canceled');
          }
        },
      )
      .then(
        (result): void => {
          if (result !== 'canceled') {
            this._setIsInternetReachable(result);
            const nextTimeoutInterval = this._isInternetReachable
              ? this._configuration.reachabilityLongTimeout
              : this._configuration.reachabilityShortTimeout;
            this._currentTimeoutHandle = setTimeout(
              this._checkInternetReachability,
              nextTimeoutInterval,
            );
          }
        },
      )
      .catch(
        (): void => {
          this._setIsInternetReachable(false);
          this._currentTimeoutHandle = setTimeout(
            this._checkInternetReachability,
            this._configuration.reachabilityShortTimeout,
          );
        },
      );

    return {
      promise,
      cancel: (): void => {
        hasCanceled = true;
      },
    };
  };

  public update = (state: PrivateTypes.NetInfoNativeModuleState): void => {
    if (typeof state.isInternetReachable === 'boolean') {
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
