/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
package com.reactnativecommunity.netinfo;

import android.os.Build;

import com.facebook.common.internal.Supplier;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.lang.ref.WeakReference;
import java.util.Objects;
import java.util.concurrent.CopyOnWriteArraySet;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

/** Module that monitors and provides information about the connectivity state of the device. */
@ReactModule(name = NetInfoModule.NAME)
public class NetInfoModule extends ReactContextBaseJavaModule implements AmazonFireDeviceConnectivityPoller.ConnectivityChangedCallback {
    public static final String NAME = "RNCNetInfo";

    private static ConnectivityReceiver sConnectivityReceiver;
    private static CopyOnWriteArraySet<WeakReactApplicationContext> sListeners;
    private final AmazonFireDeviceConnectivityPoller mAmazonConnectivityChecker;

    public NetInfoModule(ReactApplicationContext reactContext) {
        super(reactContext);

        createNetworkConnectivityReceiverIfNeed(reactContext);

        mAmazonConnectivityChecker = new AmazonFireDeviceConnectivityPoller(reactContext, this);
    }

    @Override
    public void initialize() {
        register(getReactApplicationContext());
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
        unregister(getReactApplicationContext());
    }

    @Override
    public String getName() {
        return NAME;
    }

    @ReactMethod
    public void getCurrentState(final String requestedInterface, final Promise promise) {
        getConnectivityState(requestedInterface, promise);
    }

    @Override
    public void onAmazonFireDeviceConnectivityChanged(boolean isConnected) {
        setIsInternetReachableOverride(isConnected);
    }

    @ReactMethod
    public void addListener(String eventName) {
        addReactListener(getReactApplicationContext());
    }

    @ReactMethod
    public void removeListeners(Integer count) {
        removeReactListener(getReactApplicationContext(), count);
    }

    public static synchronized void sendConnectivityChangedEvent(@Nonnull String eventName,
                                                          @Nonnull Supplier<ReadableMap> data) {
        if (sListeners.isEmpty()) {
            return;
        }

        for (WeakReactApplicationContext weak : sListeners) {
            final ReactApplicationContext context = weak.mContext.get();
            if (context != null && context.hasActiveReactInstance()) {
                // the event data to emit must be from supplier get method,
                // otherwise there may be some map consumed exceptions from React Native.
                context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName,
                    data.get());
            }
        }
    }

    private static synchronized ConnectivityReceiver createNetworkConnectivityReceiverIfNeed(
        @Nonnull ReactApplicationContext context) {
        if (sConnectivityReceiver == null) {
            // Create the connectivity receiver based on the API level we are running on
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                sConnectivityReceiver = new NetworkCallbackConnectivityReceiver(context);
            } else {
                sConnectivityReceiver = new BroadcastReceiverConnectivityReceiver(context);
            }
        }
        if (sListeners == null) {
            sListeners = new CopyOnWriteArraySet<>();
        }
        return sConnectivityReceiver;
    }

    private static synchronized void register(@Nonnull ReactApplicationContext context) {
        if (sListeners.isEmpty()) {
            // register to system service
            createNetworkConnectivityReceiverIfNeed(context).register();
        }
        sListeners.add(new WeakReactApplicationContext(context));
    }

    private static synchronized void unregister(@Nonnull ReactApplicationContext context) {
        sListeners.remove(new WeakReactApplicationContext(context));

        clearListenersIfShould();

        if (sListeners.isEmpty()) {
            destroyNetworkConnectivityReceiverIfNeed();
        }
    }

    private static void destroyNetworkConnectivityReceiverIfNeed() {
        if (sConnectivityReceiver != null) {
            sConnectivityReceiver.unregister();
            sConnectivityReceiver = null;
        }
    }

    /**
     * clear the listeners set if no context alive.
     */
    private static void clearListenersIfShould() {
        boolean should = true;
        for (WeakReactApplicationContext weak : sListeners) {
            if (weak.mContext.get() != null) {
                should = false;
                break;
            }
        }
        if (should) {
            sListeners.clear();
        }
    }

    private static synchronized void getConnectivityState(@Nullable String requestedInterface,
                                                     @Nonnull Promise promise) {
        if (sConnectivityReceiver == null) {
            promise.reject("-999", "not register network info listener");
            return;
        }

        sConnectivityReceiver.getCurrentState(requestedInterface, promise);
    }

    private static synchronized void setIsInternetReachableOverride(
        boolean isInternetReachableOverride) {
        if (sConnectivityReceiver == null) {
            return;
        }

        sConnectivityReceiver.setIsInternetReachableOverride(isInternetReachableOverride);
    }

    private static void addReactListener(@Nonnull ReactApplicationContext context) {
        createNetworkConnectivityReceiverIfNeed(context).mNumberOfReactListeners.incrementAndGet();
    }

    private static void removeReactListener(@Nonnull ReactApplicationContext context, int count) {
        createNetworkConnectivityReceiverIfNeed(context).mNumberOfReactListeners.addAndGet(-count);
    }

    private static class WeakReactApplicationContext {
        private final WeakReference<ReactApplicationContext> mContext;

        public WeakReactApplicationContext(@Nonnull ReactApplicationContext context) {
            mContext = new WeakReference<>(context);
        }

        @Override
        public boolean equals(@Nullable Object obj) {
            if (this == obj) {
                return true;
            }

            if (obj == null || getClass() != obj.getClass()) {
                return false;
            }

            WeakReactApplicationContext that = (WeakReactApplicationContext) obj;
            ReactApplicationContext context = mContext.get();
            ReactApplicationContext thatContext = that.mContext.get();
            if (context != null) {
                return context.equals(thatContext);
            }

            return thatContext == null;
        }

        @Override
        public int hashCode() {
            return Objects.hashCode(mContext.get());
        }
    }
}

