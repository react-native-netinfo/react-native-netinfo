// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using Windows.Networking.Connectivity;

namespace ReactNativeCommunity.NetInfo
{
    public enum NetworkConnectionType
    {
        Unknown,
        None,
        Cellular,
        Ethernet,
        Wifi,
        Other
    }

    public enum CellularGeneration
    {
        Unknown,
        None,
        Generation2,
        Generation3,
        Generation4
    }

    /// <summary>
    /// An interface for network connection profiles.
    /// </summary>
    public interface IConnectionProfile
    {
        /// <summary>
        /// A value that indicates the network connectivity level.
        /// </summary>
        NetworkConnectivityLevel ConnectivityLevel { get; }

        /// <summary>
        /// A value that indicates the network connection type.
        /// </summary>
        NetworkConnectionType ConnectionType { get; }

        /// <summary>
        /// A value that indicates the cellular generation currently in use, if ConnectionType is Cellular.
        /// </summary>
        CellularGeneration CellularGeneration { get; }

        /// <summary>
        /// A value that indicates the network connection cost, i.e. is the connection metered.
        /// </summary>
        NetworkCostType ConnectionCost { get; }
    }
}
