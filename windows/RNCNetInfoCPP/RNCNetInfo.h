// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
#pragma once

#include "pch.h"
#include <functional>
#include "NativeModules.h"
#include "NetworkInfo.h"

namespace winrt::ReactNativeNetInfo::implementation {

    REACT_MODULE(RNCNetInfo);
    struct RNCNetInfo {
        NetworkInfo networkInfo;

        RNCNetInfo() {
            networkInfo.StatusChanged([&](const auto& /*sender*/) {
                NetworkStatusChanged(CreateNetInfoStateObject());
                });
        }

        REACT_EVENT(NetworkStatusChanged, L"netInfo.networkStatusDidChange");
        std::function<void(JSValue)> NetworkStatusChanged;

        REACT_METHOD(getCurrentState);
        void getCurrentState(std::string requestedInterface,
            ReactPromise<JSValue> const& promise) noexcept {
            promise.Resolve(CreateNetInfoStateObject());
        }

        JSValue CreateNetInfoStateObject()
        {
            auto isConnected = networkInfo.IsConnected();
            auto type = networkInfo.ConnectivityType();
            auto detailsWriter = MakeJSValueTreeWriter();
            if (isConnected) {
                detailsWriter.WriteObjectBegin();
                WriteProperty(detailsWriter, L"isConnectionExpensive", networkInfo.IsConnectionExpensive());
                if (type == NetworkInfo::CONNECTION_TYPE_CELLULAR)
                {
                    WriteProperty(detailsWriter, L"cellularGeneration", networkInfo.CellularGeneration());
                }
                if (type == NetworkInfo::CONNECTION_TYPE_WIFI)
                {
                    WriteProperty(detailsWriter, L"frequency", networkInfo.GetFrequency());
                    WriteProperty(detailsWriter, L"ssid", networkInfo.GetSsid());
                    WriteProperty(detailsWriter, L"strength", networkInfo.GetStrength());
                }
                detailsWriter.WriteObjectEnd();
            }

            auto writer = MakeJSValueTreeWriter();
            writer.WriteObjectBegin();
            WriteProperty(writer, L"type", type);
            WriteProperty(writer, L"isConnected", isConnected);
            if (isConnected) {
                WriteProperty(writer, L"details", TakeJSValue(detailsWriter));
            }
            writer.WriteObjectEnd();
            return TakeJSValue(writer);
        }
    };
}