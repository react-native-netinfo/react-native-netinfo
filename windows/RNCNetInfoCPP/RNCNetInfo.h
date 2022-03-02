// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
#pragma once

#include <functional>
#include <future>
#include <winrt/Microsoft.ReactNative.h>
#include <winrt/Windows.Foundation.h>
#include <winrt/Windows.Networking.Connectivity.h>
#include "NativeModules.h"

namespace winrt::ReactNativeNetInfo::implementation {

    REACT_STRUCT(NetInfoDetails);
    struct NetInfoDetails {
        REACT_FIELD(isConnectionExpensive);
        bool isConnectionExpensive;
        REACT_FIELD(cellularGeneration);
        std::optional<std::string> cellularGeneration;
        REACT_FIELD(wifiGeneration);
        std::optional<std::string> wifiGeneration;

        REACT_FIELD(ssid);
        std::optional<std::string> ssid;

        REACT_FIELD(bssid);
        std::optional<std::string> bssid;

        REACT_FIELD(strength);
        std::optional<int> strength;

        REACT_FIELD(frequency);
        std::optional<int> frequency;
    };

    REACT_STRUCT(NetInfoState);
    struct NetInfoState {
        /// <summary>
        /// The type of the active network connection
        /// </summary>
        /// <param name=""></param>
        REACT_FIELD(type);
        std::string type;

        /// <summary>
        /// Is there an active network connection
        /// </summary>
        /// <param name=""></param>
        REACT_FIELD(isConnected);
        bool isConnected;

        /// <summary>
        /// IP Address of the current connection if available
        /// </summary>
        /// <param name=""></param>
        REACT_FIELD(ipAddress);
        std::string ipAddress;

        /// <summary>
        /// Is the internet reachable with the active network
        /// </summary>
        /// <param name=""></param>
        REACT_FIELD(isInternetReachable);
        std::optional<bool> isInternetReachable;

        REACT_FIELD(details);
        std::optional<NetInfoDetails> details;
    };

    REACT_MODULE(RNCNetInfo);
    struct RNCNetInfo {
    public:
        REACT_INIT(Initialize);
        void Initialize(winrt::Microsoft::ReactNative::ReactContext const& reactContext) noexcept;

        REACT_METHOD(getCurrentState);
        winrt::fire_and_forget getCurrentState(std::string requestedInterface, winrt::Microsoft::ReactNative::ReactPromise<NetInfoState> promise) noexcept;

        REACT_EVENT(NetworkStatusChanged, L"netInfo.networkStatusDidChange");
        std::function<void(NetInfoState)> NetworkStatusChanged;

        static std::future<NetInfoState> GetNetworkStatus(std::string const& requestedInterface = "");

    private:
        winrt::Windows::Networking::Connectivity::NetworkInformation::NetworkStatusChanged_revoker m_networkStatusChangedRevoker{};
    };
}