/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
package com.reactnativecommunity.netinfo;

import android.os.Build;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;

/** Module that monitors and provides information about the connectivity state of the device. */
public class NetInfoModuleImpl implements AmazonFireDeviceConnectivityPoller.ConnectivityChangedCallback {
    public static final String NAME = "RNCNetInfo";

    private final ConnectivityReceiver mConnectivityReceiver;
    private final AmazonFireDeviceConnectivityPoller mAmazonConnectivityChecker;

    private int numberOfListeners = 0;

    public NetInfoModuleImpl(ReactApplicationContext reactContext) {
        // Create the connectivity receiver based on the API level we are running on
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            mConnectivityReceiver = new NetworkCallbackConnectivityReceiver(reactContext);
        } else {
            mConnectivityReceiver = new BroadcastReceiverConnectivityReceiver(reactContext);
        }

        mAmazonConnectivityChecker = new AmazonFireDeviceConnectivityPoller(reactContext, this);
    }


    public void initialize() {
        mConnectivityReceiver.register();
        mAmazonConnectivityChecker.register();
    }

    public void onCatalystInstanceDestroy() {
        mAmazonConnectivityChecker.unregister();
        mConnectivityReceiver.unregister();
    }


    @ReactMethod
    public void getCurrentState(final String requestedInterface, final Promise promise) {
        mConnectivityReceiver.getCurrentState(requestedInterface, promise);
    }

    @Override
    public void onAmazonFireDeviceConnectivityChanged(boolean isConnected) {
        mConnectivityReceiver.setIsInternetReachableOverride(isConnected);
    }


    public void addListener(String eventName) {
        numberOfListeners++;
        mConnectivityReceiver.hasListener = true;
    }


    public void removeListeners(double count) {
        numberOfListeners -= count;
        if (numberOfListeners == 0) {
            mConnectivityReceiver.hasListener = false;
        }
    }
}
