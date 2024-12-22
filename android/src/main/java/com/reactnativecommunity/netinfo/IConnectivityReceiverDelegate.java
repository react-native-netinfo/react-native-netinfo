package com.reactnativecommunity.netinfo;

import com.facebook.common.internal.Supplier;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableMap;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

public interface IConnectivityReceiverDelegate {

  void sendConnectivityChangedEvent(@Nonnull String eventName, @Nonnull Supplier<ReadableMap> data);

  void register(@Nonnull ReactApplicationContext context);

  void unregister(@Nonnull ReactApplicationContext context);

  void getCurrentState(@Nullable final String requestedInterface, @Nonnull final Promise promise);

  void setIsInternetReachableOverride(boolean isInternetReachableOverride);
}
