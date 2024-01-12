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
    static constexpr auto CELLULAR_GENERATION_NONE = std::nullopt;
    static constexpr auto CELLULAR_GENERATION_UNKNOWN = std::nullopt;

    static constexpr auto WIFI_GENERATION_1 = "WiFi 1";
    static constexpr auto WIFI_GENERATION_2 = "WiFi 2";
    static constexpr auto WIFI_GENERATION_3 = "WiFi 3";
    static constexpr auto WIFI_GENERATION_4 = "WiFi 4";
    static constexpr auto WIFI_GENERATION_5 = "WiFi 5";
    static constexpr auto WIFI_GENERATION_6 = "WiFi 6";
    static constexpr auto WIFI_GENERATION_UNKNOWN = std::nullopt;

    std::optional<std::string> GetCellularGeneration(winrt::WwanDataClass dataClass) {
        if (dataClass == WwanDataClass::None) {
            return CELLULAR_GENERATION_NONE;
        } else if ((uint32_t)(dataClass & (WwanDataClass::Edge | WwanDataClass::Gprs)) != 0) {
            return CELLULAR_GENERATION_2G;
        } else if ((uint32_t)(dataClass &
                   ((WwanDataClass::Cdma1xEvdo | WwanDataClass::Cdma1xEvdoRevA | WwanDataClass::Cdma1xEvdoRevB |
                     WwanDataClass::Cdma1xEvdv | WwanDataClass::Cdma1xRtt | WwanDataClass::Cdma3xRtt | WwanDataClass::Hsdpa |
                                            WwanDataClass::Hsupa | WwanDataClass::Umts))) != 0) {
            return CELLULAR_GENERATION_3G;
        } else if ((uint32_t)(dataClass & (WwanDataClass::CdmaUmb | WwanDataClass::LteAdvanced)) != 0) {
            return CELLULAR_GENERATION_4G;
        }

        return CELLULAR_GENERATION_UNKNOWN;
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

    std::string getIpAddressSync() noexcept
    {
      try {
        auto icp = Windows::Networking::Connectivity::NetworkInformation::GetInternetConnectionProfile();
        if (!icp || !icp.NetworkAdapter())
        {
          return "unknown";
        }
        else
        {
          auto hostnames = Windows::Networking::Connectivity::NetworkInformation::GetHostNames();
          for (auto const& hostname : hostnames)
          {
            if (
              hostname.Type() == Windows::Networking::HostNameType::Ipv4 &&
              hostname.IPInformation() &&
              hostname.IPInformation().NetworkAdapter() &&
              hostname.IPInformation().NetworkAdapter().NetworkAdapterId() == icp.NetworkAdapter().NetworkAdapterId())
            {
              return winrt::to_string(hostname.CanonicalName());
            }
          }
          return "unknown";
        }
      }
      catch (...) {
        return "unknown";
      }
    }

    IAsyncAction ChainGetNetworkStatus(IAsyncAction previousRequest, std::future<NetInfoState> currentRequest, std::function<void(NetInfoState)> onComplete) {
        auto state = co_await currentRequest;
        if (previousRequest) {
            co_await previousRequest;
        }
        onComplete(state);
    }

    void RNCNetInfo::Initialize(winrt::Microsoft::ReactNative::ReactContext const& /*reactContext*/) noexcept {
        // NetworkStatusChanged callback is captured by value on purpose. The event handler is called asynchronously and thus can fire even
        // after we've already revoked it in our destructor during module teardown. In such a case, a reference
        // to "this" or "this->NetworkStatusChanged" would be invalid.
        m_networkStatusChangedRevoker = NetworkInformation::NetworkStatusChanged(winrt::auto_revoke, [callback = NetworkStatusChanged, previousRequest = IAsyncAction(nullptr), mutex = std::make_unique<std::mutex>()](const winrt::IInspectable& /*sender*/) mutable  {
            try {
                // Kick off building a status object. Most of this will run synchronously, but getting extra WiFi details will run async at the end.
                auto currentRequest = GetNetworkStatus();
                // To guarantee ordering of events sent to JS, wait for any previous NetworkStatusChanged events to be processed.
                // We atomically swap our latest request into place so that the next downstream NetworkStatusChanged can wait on us.
                // Note that we're NOT blocking inside the lock. Either ChainGetNetworkStatus completes synchronously or it hits real async work and yields. But we don't
                // wait on the response, we just store the IAsyncAction object.
                {
                    std::scoped_lock lock(*mutex);
                    previousRequest = ChainGetNetworkStatus(previousRequest, std::move(currentRequest), callback);
                }
            }
            catch (...) {}
        });
    }

    winrt::fire_and_forget RNCNetInfo::getCurrentState(std::string requestedInterface, winrt::Microsoft::ReactNative::ReactPromise<NetInfoState> promise) noexcept {
        // Jump to background to avoid blocking the JS thread while we gather the requested data
        co_await winrt::resume_background();

        promise.Resolve(co_await GetNetworkStatus(requestedInterface));
    }

    /*static*/ std::future<NetInfoState> RNCNetInfo::GetNetworkStatus(std::string const& requestedInterface) {
        NetInfoState state{};

        // https://docs.microsoft.com/en-us/uwp/api/windows.networking.connectivity.connectionprofile
        try {
            auto profile = NetworkInformation::GetInternetConnectionProfile();
            if (profile) {
                auto networkAdapter = profile.NetworkAdapter();
                auto connectivityLevel = profile.GetNetworkConnectivityLevel();
                auto signal = profile.GetSignalBars();
                auto costType = profile.GetConnectionCost().NetworkCostType();
                auto isWifiConnection = profile.IsWlanConnectionProfile() || requestedInterface.find("wifi") != std::string::npos;
                auto isCellularConnection = profile.IsWwanConnectionProfile() || requestedInterface.find("cellular") != std::string::npos;
                auto isEthernetConnection = networkAdapter || requestedInterface.find("ethernet") != std::string::npos;
                auto isConnectionExpensive = costType == NetworkCostType::Fixed || costType == NetworkCostType::Variable;

                state.isConnected = connectivityLevel != NetworkConnectivityLevel::None;

                NetInfoDetails details{};
                if (state.isConnected) {
                    if (signal) {
                        details.strength = winrt::unbox_value<uint8_t>(signal) * 20; // Signal strength is 0-5 but we want 0-100.
                    }
                    state.ipAddress = getIpAddressSync();
                    if (isWifiConnection) {
                        if (!profile.IsWlanConnectionProfile()) {
                            throw (std::runtime_error("Wifi profile is not available"));
                        }

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
                    else if (isCellularConnection) {
                        if (!profile.IsWwanConnectionProfile()) {
                            throw (std::runtime_error("Cellular profile is not available"));
                        }

                        auto wwanDetails = profile.WwanConnectionProfileDetails();
                        auto dataClass = wwanDetails.GetCurrentDataClass();

                        state.type = CONNECTION_TYPE_CELLULAR;
                        details.cellularGeneration = GetCellularGeneration(dataClass);
                    }
                    else if (isEthernetConnection) {
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
                    details.isConnectionExpensive = isConnectionExpensive;

                    state.isInternetReachable = connectivityLevel == NetworkConnectivityLevel::InternetAccess;
                    state.details = std::move(details);
                    
                }
            }
        }
        catch (...) {
            // If we throw an error we cannot reliably ensure that the network properties are valid so we will reset all the network info properties
            state = {};
        }

        co_return state;
    }
}