// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

#include "pch.h"
#include "RNCNetInfo.h"

#include <winrt/Windows.Devices.WiFi.h>

namespace winrt {
    using namespace Windows::Foundation;
    using namespace Windows::Networking::Connectivity;
    using namespace Windows::Devices::WiFi;
}

using namespace winrt::Microsoft::ReactNative;

namespace winrt::ReactNativeNetInfo::implementation {

    static constexpr auto CONNECTION_TYPE_CELLULAR = "cellular";
    static constexpr auto CONNECTION_TYPE_ETHERNET = "ethernet";
    static constexpr auto CONNECTION_TYPE_NONE = "none";
    static constexpr auto CONNECTION_TYPE_UNKNOWN = "unknown";
    static constexpr auto CONNECTION_TYPE_WIFI = "wifi";
    static constexpr auto CONNECTION_TYPE_OTHER = "other";

    static constexpr auto CELLULAR_GENERATION_2G = "2g";
    static constexpr auto CELLULAR_GENERATION_3G = "3g";
    static constexpr auto CELLULAR_GENERATION_4G = "4g";
    static constexpr auto CELLULAR_GENERATION_NONE = nullptr;
    static constexpr auto CELLULAR_GENERATION_UNKNOWN = nullptr;

    static constexpr auto WIFI_GENERATION_1 = "WiFi 1";
    static constexpr auto WIFI_GENERATION_2 = "WiFi 2";
    static constexpr auto WIFI_GENERATION_3 = "WiFi 3";
    static constexpr auto WIFI_GENERATION_4 = "WiFi 4";
    static constexpr auto WIFI_GENERATION_5 = "WiFi 5";
    static constexpr auto WIFI_GENERATION_6 = "WiFi 6";
    static constexpr auto WIFI_GENERATION_UNKNOWN = nullptr;

    std::optional<std::string> GetCellularGeneration(winrt::WwanDataClass dataClass) {
        switch (dataClass) {
        case WwanDataClass::None:
            return CELLULAR_GENERATION_NONE;
        case WwanDataClass::Edge:
        case WwanDataClass::Gprs:
            return CELLULAR_GENERATION_2G;
        case WwanDataClass::Cdma1xEvdo:
        case WwanDataClass::Cdma1xEvdoRevA:
        case WwanDataClass::Cdma1xEvdoRevB:
        case WwanDataClass::Cdma1xEvdv:
        case WwanDataClass::Cdma1xRtt:
        case WwanDataClass::Cdma3xRtt:
        case WwanDataClass::Hsdpa:
        case WwanDataClass::Hsupa:
        case WwanDataClass::Umts:
            return CELLULAR_GENERATION_3G;
        case WwanDataClass::CdmaUmb:
        case WwanDataClass::LteAdvanced:
            return CELLULAR_GENERATION_4G;
        case WwanDataClass::Custom:
        default:
            return CELLULAR_GENERATION_UNKNOWN;
        }
    }

    std::optional<std::string> GetWifiGeneration(winrt::WiFiPhyKind kind) {
        switch (kind) {
        case WiFiPhyKind::Dsss: // 802.11b
            return WIFI_GENERATION_1;
        case WiFiPhyKind::Ofdm: // 802.11a
            return WIFI_GENERATION_2;
        case WiFiPhyKind::Erp:  // 802.11g
            return WIFI_GENERATION_3;
        case WiFiPhyKind::HT: // 802.11n
            return WIFI_GENERATION_4;
        case WiFiPhyKind::Vht: // 802.11ac
            return WIFI_GENERATION_5;
        case WiFiPhyKind::HE: // 802.11ax
            return WIFI_GENERATION_6;
        default:
            return WIFI_GENERATION_UNKNOWN;
        }
    }

    winrt::IAsyncOperation<winrt::WiFiAvailableNetwork> GetWiFiNetwork(winrt::NetworkAdapter adapter, winrt::hstring ssid)
    {
        // Unfortunately UWP doesn't have any APIs for getting WiFi network info for an existing connection. We have to trigger a scan
        // of available networks and walk through them to get details.
        try {
            // This call only works if the app has the "wiFiControl" capability enabled in its appxmanifest, otherwise it will throw.
            auto wifiAdapters = co_await WiFiAdapter::FindAllAdaptersAsync();
            for (const auto& wifiAdapter : wifiAdapters)
            {
                if (wifiAdapter.NetworkAdapter().NetworkAdapterId() == adapter.NetworkAdapterId()) {
                    auto networks = wifiAdapter.NetworkReport().AvailableNetworks();
                    for (const auto& network : networks) {
                        if (network.Ssid() == ssid) {
                            co_return network;
                        }
                    }
                }
            }
        }
        catch (...) {}
        co_return nullptr;
    }

    void RNCNetInfo::Initialize(winrt::Microsoft::ReactNative::ReactContext const& /*reactContext*/) noexcept {

        // NetworkStatusChanged callback is captured by value on purpose. The event handler is called asynchronously and thus can fire even
        // after we've already revoked it in our destructor during module teardown. In such a case, a reference
        // to "this" or "this->NetworkStatusChanged" would be invalid.
        m_networkStatusChangedRevoker = NetworkInformation::NetworkStatusChanged(winrt::auto_revoke, [callback = NetworkStatusChanged](const winrt::IInspectable& /*sender*/) -> winrt::fire_and_forget {
            try {
                // Copy lambda capture into a local so it still exists after the co_await.
                auto localCallback = callback;
                localCallback(co_await GetNetworkStatus());
            }
            catch (...) {}
            });
    }

    winrt::fire_and_forget RNCNetInfo::getCurrentState(std::string requestedInterface, winrt::Microsoft::ReactNative::ReactPromise<NetInfoState> promise) noexcept {
        // Jump to background to avoid blocking the JS thread while we gather the requested data
        co_await winrt::resume_background();

        promise.Resolve(co_await GetNetworkStatus());
    }

    /*static*/ std::future<NetInfoState> RNCNetInfo::GetNetworkStatus() {
        NetInfoState state{};

        // https://docs.microsoft.com/en-us/uwp/api/windows.networking.connectivity.connectionprofile
        try {
            auto profile = NetworkInformation::GetInternetConnectionProfile();
            if (profile) {
                auto networkAdapter = profile.NetworkAdapter();
                auto connectivityLevel = profile.GetNetworkConnectivityLevel();
                auto signal = profile.GetSignalBars();
                auto costType = profile.GetConnectionCost().NetworkCostType();

                state.isConnected = connectivityLevel != NetworkConnectivityLevel::None;

                if (state.isConnected) {
                    NetInfoDetails details{};

                    state.isInternetReachable = connectivityLevel == NetworkConnectivityLevel::InternetAccess;
                    details.isConnectionExpensive = costType == NetworkCostType::Fixed || costType == NetworkCostType::Variable;
                    if (signal) {
                        details.strength = winrt::unbox_value<uint8_t>(signal) * 20; // Signal strength is 0-5 but we want 0-100.
                    }

                    if (profile.IsWlanConnectionProfile()) {
                        auto wlanDetails = profile.WlanConnectionProfileDetails();
                        auto ssid = wlanDetails.GetConnectedSsid();
                        auto network = co_await GetWiFiNetwork(networkAdapter, ssid);

                        state.type = CONNECTION_TYPE_WIFI;
                        details.ssid = winrt::to_string(ssid);
                        if (network) {
                            details.bssid = winrt::to_string(network.Bssid());
                            details.frequency = network.ChannelCenterFrequencyInKilohertz() / 1000; // Convert to Mhz
                            details.wifiGeneration = GetWifiGeneration(network.PhyKind());
                        }
                    }
                    else if (profile.IsWwanConnectionProfile()) {
                        auto wwanDetails = profile.WwanConnectionProfileDetails();
                        auto dataClass = wwanDetails.GetCurrentDataClass();

                        state.type = CONNECTION_TYPE_CELLULAR;
                        details.cellularGeneration = GetCellularGeneration(dataClass);
                    }
                    else if (networkAdapter) {
                        // Possible values: https://docs.microsoft.com/en-us/uwp/api/windows.networking.connectivity.networkadapter.ianainterfacetype
                        if (networkAdapter.IanaInterfaceType() == 6u) {
                            state.type = CONNECTION_TYPE_ETHERNET;
                        }
                        else {
                            state.type = CONNECTION_TYPE_OTHER;
                        }
                    }
                    else {
                        state.type = CONNECTION_TYPE_UNKNOWN;
                    }

                    state.details = std::move(details);
                }
            }
        }
        catch (...) {
        }

        co_return state;
    }
}