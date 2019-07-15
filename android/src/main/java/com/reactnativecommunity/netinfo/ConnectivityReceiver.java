/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
package com.reactnativecommunity.netinfo;

import android.content.Context;
import android.net.ConnectivityManager;
import androidx.core.net.ConnectivityManagerCompat;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.reactnativecommunity.netinfo.types.CellularGeneration;
import com.reactnativecommunity.netinfo.types.ConnectionType;
import javax.annotation.Nonnull;
import javax.annotation.Nullable;

abstract class ConnectivityReceiver {

    private final ConnectivityManager mConnectivityManager;
    private final ReactApplicationContext mReactContext;

    @Nonnull private ConnectionType mConnectionType = ConnectionType.UNKNOWN;
    @Nullable private CellularGeneration mCellularGeneration = null;
    private boolean mIsInternetReachable = false;

    ConnectivityReceiver(ReactApplicationContext reactContext) {
        mReactContext = reactContext;
        mConnectivityManager =
                (ConnectivityManager) reactContext.getSystemService(Context.CONNECTIVITY_SERVICE);
    }

    abstract void register();

    abstract void unregister();

    public void getCurrentState(Promise promise) {
        promise.resolve(createConnectivityEventMap());
    }

    ReactApplicationContext getReactContext() {
        return mReactContext;
    }

    ConnectivityManager getConnectivityManager() {
        return mConnectivityManager;
    }

    void updateConnectivity(
            @Nonnull ConnectionType connectionType,
            @Nullable CellularGeneration cellularGeneration,
            boolean isInternetReachable) {
        // It is possible to get multiple broadcasts for the same connectivity change, so we only
        // update and send an event when the connectivity has indeed changed.
        boolean connectionTypeChanged = connectionType != mConnectionType;
        boolean cellularGenerationChanged = cellularGeneration != mCellularGeneration;
        boolean isInternetReachableChanged = isInternetReachable != mIsInternetReachable;

        if (connectionTypeChanged || cellularGenerationChanged || isInternetReachableChanged) {
            mConnectionType = connectionType;
            mCellularGeneration = cellularGeneration;
            mIsInternetReachable = isInternetReachable;
            sendConnectivityChangedEvent();
        }
    }

    private void sendConnectivityChangedEvent() {
        getReactContext()
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("netInfo.networkStatusDidChange", createConnectivityEventMap());
    }

    private WritableMap createConnectivityEventMap() {
        WritableMap event = new WritableNativeMap();

        // Add the connection type information
        event.putString("type", mConnectionType.label);

        // Add the connection state information
        boolean isConnected =
                !mConnectionType.equals(ConnectionType.NONE)
                        && !mConnectionType.equals(ConnectionType.UNKNOWN);
        event.putBoolean("isConnected", isConnected);

        // Add the internet reachable information
        event.putBoolean("isInternetReachable", mIsInternetReachable);

        // Add the details, if there are any
        WritableMap details = null;
        if (isConnected) {
            details = new WritableNativeMap();

            boolean isConnectionExpensive =
                    ConnectivityManagerCompat.isActiveNetworkMetered(getConnectivityManager());
            details.putBoolean("isConnectionExpensive", isConnectionExpensive);

            if (mConnectionType.equals(ConnectionType.CELLULAR) && mCellularGeneration != null) {
                details.putString("cellularGeneration", mCellularGeneration.label);
            }
        }
        event.putMap("details", details);

        return event;
    }
}
