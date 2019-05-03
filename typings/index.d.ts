/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

type ChangeEventName = 'connectionChange';

declare let NetInfo: {
  /**
   * Adds an event handler. Supported events:
   *
   * - `connectionChange`: Fires when the network status changes. The argument to the event
   *   handler is an object with keys:
   *   - `type`: A `DeprecatedConnectionType` (listed above)
   *   - `effectiveType`: An `EffectiveConnectionType` (listed above)
   */
  addEventListener: (
    eventName: ChangeEventName,
    listener: (result: NetInfo.NetInfoData) => void,
  ) => {remove: () => void};

  /**
   * Removes the listener for network status changes.
   */
  removeEventListener: (
    eventName: ChangeEventName,
    listener: (result: NetInfo.NetInfoData) => void,
  ) => void;

  /**
   * Returns a promise that resolves to an object with `type` and `effectiveType` keys
   * whose values are a `NetInfoType` and an `NetInfoEffectiveType`, (described above),
   * respectively.
   */
  getConnectionInfo: () => Promise<NetInfo.NetInfoData>;

  /**
   * An object with the same methods as above but the listener receives a
   * boolean which represents the internet connectivity.
   * Use this if you are only interested with whether the device has internet
   * connectivity.
   */
  isConnected: {
    fetch: () => Promise<boolean>,

    /**
     * eventName is expected to be `change`(deprecated) or `connectionChange`
     */
    addEventListener: (
      eventName: ChangeEventName,
      listener: (result: boolean) => void,
    ) => {remove: () => void},

    /**
     * eventName is expected to be `change`(deprecated) or `connectionChange`
     */
    removeEventListener: (
      eventName: ChangeEventName,
      listener: (result: boolean) => void,
    ) => void,
  };

  /**
   * Detect if the current active connection is
   * metered or not. A network is classified as metered when the user is
   * sensitive to heavy data usage on that connection due to monetary
   * costs, data limitations or battery/performance issues.
   */
  isConnectionExpensive: () => Promise<boolean>;
}

declare namespace NetInfo {
  export type NetInfoType =
    // iOS & Android
    | 'none'
    | 'cellular'
    | 'unknown'
    | 'wifi'
    // Android only
    | 'bluetooth'
    | 'ethernet'
    | 'wimax';

  export type NetInfoEffectiveType = 'unknown' | '2g' | '3g' | '4g';

  export interface NetInfoData {
    type: NetInfoType;
    effectiveType: NetInfoEffectiveType;
  }
}

export = NetInfo;
