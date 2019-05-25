// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Windows.Networking.Connectivity;

namespace ReactNativeCommunity.NetInfo
{
    class DefaultNetworkInformation : INetworkInformation
    {
        public event NetworkStatusChangedEventHandler NetworkStatusChanged;

        public void Start()
        {
            NetworkInformation.NetworkStatusChanged += OnNetworkStatusChanged;
        }

        public void Stop()
        {
            NetworkInformation.NetworkStatusChanged -= OnNetworkStatusChanged;
        }

        public IConnectionProfile GetInternetConnectionProfile()
        {
            var profile = NetworkInformation.GetInternetConnectionProfile();
            return profile != null
                ? new ConnectionProfileImpl(profile)
                : null;
        }

        private void OnNetworkStatusChanged(object sender)
        {
            NetworkStatusChanged?.Invoke(sender);
        }

        class ConnectionProfileImpl : IConnectionProfile
        {
            private readonly ConnectionProfile _profile;

            public ConnectionProfileImpl(ConnectionProfile profile)
            {
                _profile = profile;
            }

            public NetworkConnectivityLevel ConnectivityLevel
            {
                get
                {
                    return _profile.GetNetworkConnectivityLevel();
                }
            }

            public NetworkConnectionType ConnectionType
            {
                get
                {
                    if (_profile.IsWlanConnectionProfile)
                    {
                        return NetworkConnectionType.Wifi;
                    }
                    else if (_profile.IsWwanConnectionProfile)
                    {
                        return NetworkConnectionType.Cellular;
                    }

                    var networkAdapter = _profile.NetworkAdapter;
                    if (networkAdapter == null)
                    {
                        return NetworkConnectionType.Unknown;
                    }

                    // Possible values: https://www.iana.org/assignments/ianaiftype-mib/ianaiftype-mib
                    if (networkAdapter.IanaInterfaceType == 6u)
                    {
                        return NetworkConnectionType.Ethernet;
                    }
                    else
                    {
                        return NetworkConnectionType.Other;
                    }
                }
            }

            public CellularGeneration CellularGeneration
            {
                get
                {
                    if (!_profile.IsWwanConnectionProfile)
                    {
                        return CellularGeneration.None;
                    }

                    var dataClass = _profile.WwanConnectionProfileDetails.GetCurrentDataClass();

                    switch (dataClass) {
                        case WwanDataClass.None:
                            return CellularGeneration.None;
                        case WwanDataClass.Edge:
                        case WwanDataClass.Gprs:
                            return CellularGeneration.Generation2;
                        case WwanDataClass.Cdma1xEvdo:
                        case WwanDataClass.Cdma1xEvdoRevA:
                        case WwanDataClass.Cdma1xEvdoRevB:
                        case WwanDataClass.Cdma1xEvdv:
                        case WwanDataClass.Cdma1xRtt:
                        case WwanDataClass.Cdma3xRtt:
                        case WwanDataClass.Hsdpa:
                        case WwanDataClass.Hsupa:
                        case WwanDataClass.Umts:
                            return CellularGeneration.Generation3;
                        case WwanDataClass.CdmaUmb:
                        case WwanDataClass.LteAdvanced:
                            return CellularGeneration.Generation4;
                        case WwanDataClass.Custom:
                        default:
                            return CellularGeneration.Unknown;
                    }
                }
            }

            public NetworkCostType ConnectionCost
            {
                get
                {
                    return _profile.GetConnectionCost().NetworkCostType;
                }
            }
        }
    }
}
