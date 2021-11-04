// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

#include "pch.h"
#include "NetworkInfo.h"

namespace winrt{
    using namespace Windows::Foundation;
	using namespace Windows::Networking::Connectivity;
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

}
