// Copyright (c) Microsoft Corporation. All rights reserved.
// Portions derived from React Native:
// Copyright (c) 2015-present, Facebook, Inc.
// Licensed under the MIT License.

using Newtonsoft.Json.Linq;
using ReactNative.Bridge;
using ReactNative.Modules.Core;
using Windows.Networking.Connectivity;

namespace ReactNativeCommunity.NetInfo
{
    /// <summary>
    /// Module that monitors and provides information about the connectivity
    /// state of the device.
    /// </summary>
    public class RNCNetInfoModule : ReactContextNativeModuleBase, ILifecycleEventListener
    {
        // These constants need to match the strings defined in types.ts
        private const string CONNECTION_TYPE_CELLULAR = "cellular";
        private const string CONNECTION_TYPE_ETHERNET = "ethernet";
        private const string CONNECTION_TYPE_NONE = "none";
        private const string CONNECTION_TYPE_UNKNOWN = "unknown";
        private const string CONNECTION_TYPE_WIFI = "wifi";
        private const string CONNECTION_TYPE_OTHER = "other";

        private const string CELLULAR_GENERATION_2G = "2g";
        private const string CELLULAR_GENERATION_3G = "3g";
        private const string CELLULAR_GENERATION_4G = "4g";
        private const string CELLULAR_GENERATION_NONE = null;
        private const string CELLULAR_GENERATION_UNKNOWN = null;

        private readonly INetworkInformation _networkInfo;

        /// <summary>
        /// Instantiates the <see cref="RNCNetInfoModule"/>.
        /// </summary>
        /// <param name="reactContext">The React context.</param>
        public RNCNetInfoModule(ReactContext reactContext)
            : this(new DefaultNetworkInformation(), reactContext)
        {
        }

        /// <summary>
        /// Instantiates the <see cref="RNCNetInfoModule"/>.
        /// </summary>
        /// <param name="networkInfo">The network information.</param>
        /// <param name="reactContext">The React context.</param>
        public RNCNetInfoModule(INetworkInformation networkInfo, ReactContext reactContext)
            : base(reactContext)
        {
            _networkInfo = networkInfo;
        }

        /// <summary>
        /// Gets the name of the native module.
        /// </summary>
        public override string Name
        {
            get
            {
                return "RNCNetInfo";
            }
        }

        /// <summary>
        /// Gets the current connectivity state of the app.
        /// </summary>
        /// <param name="string">The interface from which to obtain the information (not currently supported)</param>
        /// <param name="promise">A promise to resolve the request.</param>
        [ReactMethod]
        public void getCurrentState(String requestedInterface, IPromise promise)
        {
            promise.Resolve(CreateConnectivityEventMap());
        }

        /// <summary>
        /// Called when the application host is destroyed.
        /// </summary>
        public void OnDestroy()
        {
        }

        /// <summary>
        /// Called when the application host is resumed.
        /// </summary>
        public void OnResume()
        {
            _networkInfo.Start();
            _networkInfo.NetworkStatusChanged += OnStatusChanged;
        }

        /// <summary>
        /// Called when the application host is suspended.
        /// </summary>
        public void OnSuspend()
        {
            _networkInfo.NetworkStatusChanged -= OnStatusChanged;
            _networkInfo.Stop();
        }

        /// <summary>
        /// Called when the React instance is initialized.
        /// </summary>
        public override void Initialize()
        {
            Context.AddLifecycleEventListener(this);
        }

        private JObject CreateConnectivityEventMap()
        {
            var eventMap = new JObject();

            // Add the connection type information
            var type = GetConnectivityType();
            eventMap.Add("type", type);

            // Add the connection state information
            var isConnected = GetIsConnected();
            eventMap.Add("isConnected", isConnected);

            // Add the details, if there are any
            JObject details = null;
            if (isConnected)
            {
                details = new JObject();

                var isConnectionExpensive = GetIsConnectionExpensive();
                details.Add("isConnectionExpensive", isConnectionExpensive);

                if (type == CONNECTION_TYPE_CELLULAR)
                {
                    var cellularGeneration = GetCellularGeneration();
                    details.Add("cellularGeneration", cellularGeneration);
                }
            }
            eventMap.Add("details", details);

            return eventMap;
        }

        private string GetConnectivityType()
        {
            var profile = _networkInfo.GetInternetConnectionProfile();
            if (profile == null)
            {
                return CONNECTION_TYPE_NONE;
            }

            switch (profile.ConnectionType)
            {
                case NetworkConnectionType.Unknown:
                    return CONNECTION_TYPE_UNKNOWN;
                case NetworkConnectionType.None:
                    return CONNECTION_TYPE_NONE;
                case NetworkConnectionType.Cellular:
                    return CONNECTION_TYPE_CELLULAR;
                case NetworkConnectionType.Ethernet:
                    return CONNECTION_TYPE_ETHERNET;
                case NetworkConnectionType.Wifi:
                    return CONNECTION_TYPE_WIFI;
                case NetworkConnectionType.Other:
                    return CONNECTION_TYPE_OTHER;
                default:
                    return CONNECTION_TYPE_UNKNOWN;
            }
        }

        private string GetCellularGeneration()
        {
            var profile = _networkInfo.GetInternetConnectionProfile();
            if (profile == null)
            {
                return CELLULAR_GENERATION_NONE;
            }

            switch (profile.CellularGeneration)
            {
                case CellularGeneration.Unknown:
                    return CELLULAR_GENERATION_UNKNOWN;
                case CellularGeneration.None:
                    return CELLULAR_GENERATION_NONE;
                case CellularGeneration.Generation2:
                    return CELLULAR_GENERATION_2G;
                case CellularGeneration.Generation3:
                    return CELLULAR_GENERATION_3G;
                case CellularGeneration.Generation4:
                    return CELLULAR_GENERATION_4G;
                default:
                    return CELLULAR_GENERATION_UNKNOWN;
            }
        }

        private bool GetIsConnected()
        {
            var profile = _networkInfo.GetInternetConnectionProfile();
            return profile != null && profile.ConnectivityLevel != NetworkConnectivityLevel.None;
        }

        private bool GetIsConnectionExpensive()
        {
            var profile = _networkInfo.GetInternetConnectionProfile();
            if (profile == null)
            {
                return false;
            }

            var connectionCost = profile.ConnectionCost;
            return connectionCost == NetworkCostType.Fixed || connectionCost == NetworkCostType.Variable;
        }

        private void OnStatusChanged(object ignored)
        {
            var connectivity = CreateConnectivityEventMap();
            Context.GetJavaScriptModule<RCTDeviceEventEmitter>()
                .emit("netInfo.networkStatusDidChange", CreateConnectivityEventMap());
        }
    }
}
