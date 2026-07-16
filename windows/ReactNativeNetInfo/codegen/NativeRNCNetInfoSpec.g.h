
/*
 * This file is auto-generated from a NativeModule spec file in js.
 *
 * This is a C++ Spec class that should be used with MakeTurboModuleProvider to register native modules
 * in a way that also verifies at compile time that the native module matches the interface required
 * by the TurboModule JS spec.
 */
#pragma once
// clang-format off


#include <NativeModules.h>
#include <tuple>

namespace ReactNativeNetInfoCodegen {

struct RNCNetInfoSpec : winrt::Microsoft::ReactNative::TurboModuleSpec {
  static constexpr auto methods = std::tuple{
      Method<void(::React::JSValue) noexcept>{0, L"configure"},
      Method<void(std::string, Promise<::React::JSValue>) noexcept>{1, L"getCurrentState"},
      Method<void(std::string) noexcept>{2, L"addListener"},
      Method<void(double) noexcept>{3, L"removeListeners"},
  };

  template <class TModule>
  static constexpr void ValidateModule() noexcept {
    constexpr auto methodCheckResults = CheckMethods<TModule, RNCNetInfoSpec>();

    REACT_SHOW_METHOD_SPEC_ERRORS(
          0,
          "configure",
          "    REACT_METHOD(configure) void configure(::React::JSValue && config) noexcept { /* implementation */ }\n"
          "    REACT_METHOD(configure) static void configure(::React::JSValue && config) noexcept { /* implementation */ }\n");
    REACT_SHOW_METHOD_SPEC_ERRORS(
          1,
          "getCurrentState",
          "    REACT_METHOD(getCurrentState) void getCurrentState(std::string requestedInterface, ::React::ReactPromise<::React::JSValue> &&result) noexcept { /* implementation */ }\n"
          "    REACT_METHOD(getCurrentState) static void getCurrentState(std::string requestedInterface, ::React::ReactPromise<::React::JSValue> &&result) noexcept { /* implementation */ }\n");
    REACT_SHOW_METHOD_SPEC_ERRORS(
          2,
          "addListener",
          "    REACT_METHOD(addListener) void addListener(std::string eventName) noexcept { /* implementation */ }\n"
          "    REACT_METHOD(addListener) static void addListener(std::string eventName) noexcept { /* implementation */ }\n");
    REACT_SHOW_METHOD_SPEC_ERRORS(
          3,
          "removeListeners",
          "    REACT_METHOD(removeListeners) void removeListeners(double count) noexcept { /* implementation */ }\n"
          "    REACT_METHOD(removeListeners) static void removeListeners(double count) noexcept { /* implementation */ }\n");
  }
};

} // namespace ReactNativeNetInfoCodegen
