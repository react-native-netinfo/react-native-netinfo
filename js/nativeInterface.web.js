/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Evan Bacon.
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import findIndex from 'array-find-index';
import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import invariant from 'fbjs/lib/invariant';


// Map React Native events to browser equivalents
const eventTypesMap = {
    change: 'change',
    connectionChange: 'change',
};
const eventTypes = Object.keys(eventTypesMap);

const connectionListeners = [];
const netInfoListeners = [];


// Prevent the underlying event handlers from leaking and include additional
// properties available in browsers
// TODO: Bacon: Refactor the native values so we aren't doing this weird emulation.
function getConnectionInfoObject() {
  const connection = getConnection();
  const result = {
    connectionType: 'unknown',
    effectiveConnectionType: 'unknown',
  };
  if (!connection) {
    return result;
  }
  for (const prop in connection) {
    const value = connection[prop];
    if (typeof value !== 'function' && value != null) {
      result[prop] = value;
    }
  }
  return {
    connectionType: result.type,
    effectiveConnectionType: result.effectiveType,
      ...result,
    };
}

function getConnection() {
// https://developer.mozilla.org/en-US/docs/Web/API/Navigator/connection#Browser_compatibility
    if (ExecutionEnvironment.canUseDOM) {
        return (window.navigator.connection ||
        window.navigator.mozConnection ||
        window.navigator.webkitConnection);
    }
    return null;
}

/**
 * We export the native interface in this way to give easy shared access to it between the
 * JavaScript code and the tests
 */
export const RNCNetInfo = {
    async getCurrentConnectivity(): Promise<any> {
        return getConnectionInfoObject();
    },
    // TODO: Bacon: is `isConnectionMetered` supported?
};

export const NetInfoEventEmitter = {
    addEventListener(type: string, handler: Function) {
        if (type === 'networkStatusDidChange') {
            const connection = getConnection();
            if (!connection) {
                console.error(
                  'Network Connection API is not supported. Not listening for connection type changes.'
                );
                return {
                  remove: () => {},
                };
            }
            const wrappedHandler = () => handler(getConnectionInfoObject());
            netInfoListeners.push([handler, wrappedHandler]);
            connection.addEventListener(eventTypesMap[type], wrappedHandler);
        } else {
            const onlineCallback = () => handler(getConnectionInfoObject());
            const offlineCallback = () => handler(getConnectionInfoObject());
            connectionListeners.push([handler, onlineCallback, offlineCallback]);

            window.addEventListener('online', onlineCallback, false);
            window.addEventListener('offline', offlineCallback, false);
        }

        return {
            remove() {
                if (type === 'networkStatusDidChange') {
                    const listenerIndex = findIndex(netInfoListeners, pair => pair[0] === handler);
                    invariant(listenerIndex !== -1, 'Trying to remove NetInfo listener for unregistered handler');
                    const [, wrappedHandler] = netInfoListeners[listenerIndex];
                    const connection = getConnection();
                    if (!connection) {
                        throw new Error(
                          'Network Connection API is not supported. Not listening for connection type changes.'
                        );
                    }
                    connection.removeEventListener(eventTypesMap[type], wrappedHandler);
                    netInfoListeners.splice(listenerIndex, 1);
                    return;
                }
                invariant(
                  eventTypes.indexOf(type) !== -1,
                  'Trying to subscribe to unknown event: "%s"',
                  type
                );
                if (type === 'change') {
                  console.warn('Listening to event `change` is deprecated. Use `connectionChange` instead.');
                }

                const listenerIndex = findIndex(connectionListeners, pair => pair[0] === handler);
                invariant(
                  listenerIndex !== -1,
                  'Trying to remove NetInfo connection listener for unregistered handler'
                );
                const [, onlineCallback, offlineCallback] = connectionListeners[listenerIndex];

                window.removeEventListener('online', onlineCallback, false);
                window.removeEventListener('offline', offlineCallback, false);

                connectionListeners.splice(listenerIndex, 1);
            },
        };
    },
};
