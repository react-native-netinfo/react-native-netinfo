package com.reactnativecommunity.netinfo;

import android.os.Build;

import com.facebook.common.internal.Supplier;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.lang.ref.WeakReference;
import java.util.Objects;
import java.util.concurrent.CopyOnWriteArraySet;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

public class ConnectivityReceiverDelegate implements IConnectivityReceiverDelegate {

  @Nullable
  private ConnectivityReceiver mConnectivityReceiver = null;

  private final CopyOnWriteArraySet<WeakReactApplicationContext> mListeners;

  private ConnectivityReceiverDelegate() {
    mListeners = new CopyOnWriteArraySet<>();
  }

  public static ConnectivityReceiverDelegate getInstance() {
    return InstanceHolder.INSTANCE;
  }

  public void addReactListener(@Nonnull ReactApplicationContext context) {
    createNetworkConnectivityReceiverIfNeed(context).mNumberOfReactListeners.incrementAndGet();
  }

  public void removeReactListener(@Nonnull ReactApplicationContext context, int count) {
    createNetworkConnectivityReceiverIfNeed(context).mNumberOfReactListeners.addAndGet(-count);
  }

  public synchronized ConnectivityReceiver createNetworkConnectivityReceiverIfNeed(@Nonnull ReactApplicationContext context) {
    if (mConnectivityReceiver == null) {
      // Create the connectivity receiver based on the API level we are running on
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
        mConnectivityReceiver = new NetworkCallbackConnectivityReceiver(context);
      } else {
        mConnectivityReceiver = new BroadcastReceiverConnectivityReceiver(context);
      }
      mConnectivityReceiver.setReceiverDelegate(this);
    }
    return mConnectivityReceiver;
  }

  @Override
  public synchronized void sendConnectivityChangedEvent(@Nonnull String eventName,
                                                        @Nonnull Supplier<ReadableMap> data) {
    if (mListeners.isEmpty()) {
      return;
    }

    for (WeakReactApplicationContext weak : mListeners) {
      final ReactApplicationContext context = weak.mContext.get();
      if (context != null && context.hasActiveReactInstance()) {
        // the event data to emit must be from supplier get method,
        // otherwise there may be some map consumed exceptions from React Native.
        context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName,
            data.get());
      }
    }
  }

  @Override
  public synchronized void register(@Nonnull ReactApplicationContext context) {
    if (mListeners.isEmpty()) {
      // register to system service
      createNetworkConnectivityReceiverIfNeed(context).register();
    }
    mListeners.add(new WeakReactApplicationContext(context));
  }

  @Override
  public synchronized void unregister(@Nonnull ReactApplicationContext context) {
    mListeners.remove(new WeakReactApplicationContext(context));

    clearListenersIfShould();

    if (mListeners.isEmpty()) {
      destroyNetworkConnectivityReceiverIfNeed();
    }
  }

  private void destroyNetworkConnectivityReceiverIfNeed() {
    if (mConnectivityReceiver != null) {
      mConnectivityReceiver.unregister();
      mConnectivityReceiver = null;
    }
  }

  /**
   * clear the listeners set if no context alive.
   */
  private void clearListenersIfShould() {
    boolean should = true;
    for (WeakReactApplicationContext weak : mListeners) {
      if (weak.mContext.get() != null) {
        should = false;
        break;
      }
    }
    if (should) {
      mListeners.clear();
    }
  }

  @Override
  public synchronized void getCurrentState(@javax.annotation.Nullable String requestedInterface,
                                           @Nonnull Promise promise) {
    if (mConnectivityReceiver == null) {
      promise.reject("-999", "not register network info listener");
      return;
    }

    mConnectivityReceiver.getCurrentState(requestedInterface, promise);
  }

  @Override
  public synchronized void setIsInternetReachableOverride(boolean isInternetReachableOverride) {
    if (mConnectivityReceiver == null) {
      return;
    }

    mConnectivityReceiver.setIsInternetReachableOverride(isInternetReachableOverride);
  }

  private static class InstanceHolder {
    private static final ConnectivityReceiverDelegate INSTANCE = new ConnectivityReceiverDelegate();
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
