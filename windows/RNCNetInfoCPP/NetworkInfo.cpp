// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

#include "pch.h"
#include "NetworkInfo.h"

namespace winrt{
    using namespace Windows::Foundation;
	using namespace Windows::Networking::Connectivity;
    using namespace Windows::Devices::WiFi;
}

namespace winrt::ReactNativeNetInfo::implementation {

    NetworkInfo::NetworkInfo() {
        GetConnectionProfile();

        m_networkStatusChangedRevoker = NetworkInformation::NetworkStatusChanged(winrt::auto_revoke, [&](const winrt::IInspectable& sender) {
                GetConnectionProfile();

                if (m_statusChangedHandler) {
                    m_statusChangedHandler(sender);
                }
            });
    }

    void NetworkInfo::StatusChanged(const NetworkStatusChangedEventHandler& handler) {
        m_statusChangedHandler = handler;
    }

    bool NetworkInfo::IsConnected() {
        return m_profile && m_profile.GetNetworkConnectivityLevel() != NetworkConnectivityLevel::None;
    }

    void NetworkInfo::GetConnectionProfile() {
        try
        {
            m_profile = NetworkInformation::GetInternetConnectionProfile();
        }
        catch (const std::exception&)
        {
            m_profile = { nullptr };
        }
    }

    std::string NetworkInfo::ConnectivityType() {
        if (!m_profile) {
            return CONNECTION_TYPE_NONE;
        }
        if (m_profile.IsWlanConnectionProfile()) {
            return CONNECTION_TYPE_WIFI;
        }
        if (m_profile.IsWwanConnectionProfile()) {
            return CONNECTION_TYPE_CELLULAR;
        }

        auto networkAdapter = m_profile.NetworkAdapter();
        if (!networkAdapter) {
            return CONNECTION_TYPE_UNKNOWN;
        }
        // Possible values: https://docs.microsoft.com/en-us/uwp/api/windows.networking.connectivity.networkadapter.ianainterfacetype
        if (networkAdapter.IanaInterfaceType() == 6u) {
            return CONNECTION_TYPE_ETHERNET;
        }
        else {
            return CONNECTION_TYPE_OTHER;
        }
    }

    std::string NetworkInfo::CellularGeneration() {
        if (!m_profile.IsWwanConnectionProfile()) {
            return CELLULAR_GENERATION_NONE;
        }

        auto dataClass = m_profile.WwanConnectionProfileDetails().GetCurrentDataClass();
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

    bool NetworkInfo::IsConnectionExpensive() {
        if (!m_profile) {
            return false;
        }

        auto costType = m_profile.GetConnectionCost().NetworkCostType();
        return costType == NetworkCostType::Fixed || costType == NetworkCostType::Variable;
    }

    std::string NetworkInfo::GetSsid() {
        if (!m_profile.IsWlanConnectionProfile()) {
            return "";
        }
        return winrt::to_string(m_profile.WlanConnectionProfileDetails().GetConnectedSsid().c_str());
    }

    uint8_t NetworkInfo::GetStrength() {
        if (!m_profile.IsWlanConnectionProfile()) {
            return 0;
        }
        return m_profile.GetSignalBars().GetUInt8() * 20;
    }

    IAsyncOperation<int64_t> NetworkInfo::GetFrequency() noexcept {
        try
        {
            if (!m_profile.IsWlanConnectionProfile()) {
                return 0;
            }

            auto inetSsid = m_profile.WlanConnectionProfileDetails().GetConnectedSsid();

            auto connectedNetwork = co_await getConnectedNetwork(inetSsid);
            const auto frequency =
                connectedNetwork ? static_cast<int64_t>(connectedNetwork.ChannelCenterFrequencyInKilohertz()) : 0;

            return frequency;
        }
        catch (...)
        {
            return 0;
        }
    }

    IAsyncOperation<WiFiAdapter> NetworkInfo::getConnectedWiFiAdapter(winrt::hstring inetSsid)
    {
        auto wifiAdapters = co_await WiFiAdapter::FindAllAdaptersAsync();

        for (WiFiAdapter wifiAdapter : wifiAdapters)
        {
            auto networkAdapter = wifiAdapter.NetworkAdapter();
            auto connectedProfile = co_await networkAdapter.GetConnectedProfileAsync();

            // check each WiFi adapter for a connected profile
            if (connectedProfile && connectedProfile.IsWlanConnectionProfile())
            {
                // Ensure the connected profile is the same as the internet profile
                auto connectedSsid = connectedProfile.WlanConnectionProfileDetails().GetConnectedSsid();
                if (connectedSsid == inetSsid)
                {
                    return wifiAdapter;
                }
            }
        }

        return WiFiAdapter(nullptr);
    }

    IAsyncOperation<WiFiAvailableNetwork> NetworkInfo::getConnectedNetwork(winrt::hstring inetSsid)
    {
        auto wifiAdapter = co_await getConnectedWiFiAdapter(inetSsid);

        auto availableNetworks = wifiAdapter.NetworkReport().AvailableNetworks();
        for (WiFiAvailableNetwork availableNetwork : availableNetworks)
        {
            if (availableNetwork.Ssid() == inetSsid)
            {
                return availableNetwork;
            }
        }

        return WiFiAvailableNetwork(nullptr);
    }
}
