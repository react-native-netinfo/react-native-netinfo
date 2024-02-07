package com.reactnativecommunity.netinfo;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;

public class NetInfoModule extends NativeRNCNetInfoSpec {

    private NetInfoModuleImpl implementation;

    NetInfoModule(ReactApplicationContext context) {
        super(context);
        implementation = new NetInfoModuleImpl(context);
    }

    @Override
    public String getName() {
        return NetInfoModuleImpl.NAME;
    }

    @ReactMethod
    public void getCurrentState(final String requestedInterface, final Promise promise) {
        implementation.getCurrentState(requestedInterface, promise);
    }

    @ReactMethod
    public void configure(ReadableMap config) {
        // iOS only
    }

    @ReactMethod
    public void addListener(String eventName) {
        implementation.addListener(eventName);
    }

    @ReactMethod
    public void removeListeners(double count) {
        implementation.removeListeners(count);
    }
    
    @Override
    public void onCatalystInstanceDestroy() {
        implementation.onCatalystInstanceDestroy();
    }

    @Override
    public void initialize() {
        implementation.initialize();
    }
}
