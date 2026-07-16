// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

#pragma once

#include "pch.h"
#include "resource.h"

#if __has_include("codegen/NativeRNCNetInfoDataTypes.g.h")
  #include "codegen/NativeRNCNetInfoDataTypes.g.h"
#endif
#include "codegen/NativeRNCNetInfoSpec.g.h"

#include "NativeModules.h"

#include <functional>
#include <memory>
#include <optional>
#include <string>

#include <winrt/Windows.Foundation.h>
#include <winrt/Windows.Networking.Connectivity.h>

namespace winrt::ReactNativeNetInfo
{

REACT_STRUCT(NetInfoDetails)
struct NetInfoDetails {
  REACT_FIELD(isConnectionExpensive)
  bool isConnectionExpensive;

  REACT_FIELD(cellularGeneration)
  std::optional<std::string> cellularGeneration;

  REACT_FIELD(wifiGeneration)
  std::optional<std::string> wifiGeneration;

  REACT_FIELD(ssid)
  std::optional<std::string> ssid;

  REACT_FIELD(bssid)
  std::optional<std::string> bssid;

  REACT_FIELD(strength)
  std::optional<int> strength;

  REACT_FIELD(frequency)
  std::optional<int> frequency;
};

REACT_STRUCT(NetInfoState)
struct NetInfoState {
  /// <summary>
  /// The type of the active network connection
  /// </summary>
  REACT_FIELD(type)
  std::string type;

  /// <summary>
  /// Is there an active network connection
  /// </summary>
  REACT_FIELD(isConnected)
  bool isConnected;

  /// <summary>
  /// IP Address of the current connection if available
  /// </summary>
  REACT_FIELD(ipAddress)
  std::string ipAddress;

  /// <summary>
  /// Is the internet reachable with the active network
  /// </summary>
  REACT_FIELD(isInternetReachable)
  std::optional<bool> isInternetReachable;

  REACT_FIELD(details)
  std::optional<NetInfoDetails> details;
};

REACT_MODULE(RNCNetInfo)
struct RNCNetInfo
{
  using ModuleSpec = ReactNativeNetInfoCodegen::RNCNetInfoSpec;

  REACT_INIT(Initialize)
  void Initialize(React::ReactContext const &reactContext) noexcept;

  REACT_METHOD(configure)
  void configure(React::JSValue &&config) noexcept;

  REACT_METHOD(getCurrentState)
  winrt::fire_and_forget getCurrentState(std::string requestedInterface, React::ReactPromise<React::JSValue> promise) noexcept;

  REACT_METHOD(addListener)
  void addListener(std::string eventName) noexcept;

  REACT_METHOD(removeListeners)
  void removeListeners(double count) noexcept;

  REACT_EVENT(NetworkStatusChanged, L"netInfo.networkStatusDidChange")
  std::function<void(NetInfoState)> NetworkStatusChanged;

  static winrt::Windows::Foundation::IAsyncAction GetNetworkStatus(std::string requestedInterface, std::shared_ptr<NetInfoState> state);

private:
  winrt::Windows::Networking::Connectivity::NetworkInformation::NetworkStatusChanged_revoker m_networkStatusChangedRevoker{};
};

} // namespace winrt::ReactNativeNetInfo
