package com.reactnativecommunity.netinfo;

import androidx.annotation.Nullable;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.model.ReactModuleInfo;
import com.facebook.react.module.model.ReactModuleInfoProvider;
import com.facebook.react.TurboReactPackage;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class NetInfoPackage extends TurboReactPackage {

  @Nullable
  @Override
  public NativeModule getModule(String name, ReactApplicationContext reactContext) {
          if (name.equals(NetInfoModuleImpl.NAME)) {
              return new NetInfoModule(reactContext);
          } else {
              return null;
          }
  }

  @Override
  public ReactModuleInfoProvider getReactModuleInfoProvider() {
           return () -> {
                    final Map<String, ReactModuleInfo> moduleInfos = new HashMap<>();
                    boolean turboModulesEnabled = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
                    moduleInfos.put(
                                    NetInfoModuleImpl.NAME,
                                    new ReactModuleInfo(
                                                    NetInfoModuleImpl.NAME,
                                                    NetInfoModuleImpl.NAME,
                                                    false, // canOverrideExistingModule
                                                    false, // needsEagerInit
                                                    true, // hasConstants
                                                    false, // isCxxModule
                                                    turboModulesEnabled // isTurboModule
                                            ));
                    return moduleInfos;
                };
  }
}
