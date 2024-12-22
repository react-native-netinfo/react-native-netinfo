/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
package com.reactnativecommunity.netinfo;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;

/** Module that monitors and provides information about the connectivity state of the device. */
@ReactModule(name = NetInfoModule.NAME)
public class NetInfoModule extends ReactContextBaseJavaModule implements AmazonFireDeviceConnectivityPoller.ConnectivityChangedCallback {
    public static final String NAME = "RNCNetInfo";

    private final AmazonFireDeviceConnectivityPoller mAmazonConnectivityChecker;

    public NetInfoModule(ReactApplicationContext reactContext) {
        super(reactContext);

        ConnectivityReceiverDelegate.getInstance().createNetworkConnectivityReceiverIfNeed(reactContext);

        mAmazonConnectivityChecker = new AmazonFireDeviceConnectivityPoller(reactContext, this);
    }

    @Override
    public void initialize() {
        ConnectivityReceiverDelegate.getInstance().register(getReactApplicationContext());
        mAmazonConnectivityChecker.register();
    }

    // the upstream method was removed in react-native 0.74
    // this stub remains for backwards compatibility so that react-native < 0.74
    // (which will still call onCatalystInstanceDestroy) will continue to function
    public void onCatalystInstanceDestroy() {
        invalidate();
    }

    // This should have an `@Override` tag, but the method does not exist until
    // react-native >= 0.74, which would cause linting errors across versions
    // once minimum supported react-native here is 0.74+, add the tag
    public void invalidate() {
        mAmazonConnectivityChecker.unregister();
        ConnectivityReceiverDelegate.getInstance().unregister(getReactApplicationContext());
    }

    @Override
    public String getName() {
        return NAME;
    }

    @ReactMethod
    public void getCurrentState(final String requestedInterface, final Promise promise) {
        ConnectivityReceiverDelegate.getInstance().getCurrentState(requestedInterface, promise);
    }

    @Override
    public void onAmazonFireDeviceConnectivityChanged(boolean isConnected) {
        ConnectivityReceiverDelegate.getInstance().setIsInternetReachableOverride(isConnected);
    }

    @ReactMethod
    public void addListener(String eventName) {
        ConnectivityReceiverDelegate.getInstance().addReactListener(getReactApplicationContext());
    }

    @ReactMethod
    public void removeListeners(Integer count) {
        ConnectivityReceiverDelegate.getInstance().removeReactListener(getReactApplicationContext(), count);
    }
}
