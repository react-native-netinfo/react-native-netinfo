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
        std::function<void(winrt::Microsoft::ReactNative::JSValue)> NetworkStatusChanged;

        REACT_METHOD(getCurrentState);
        void getCurrentState(std::string requestedInterface,
            winrt::Microsoft::ReactNative::ReactPromise<winrt::Microsoft::ReactNative::JSValue> const& promise) noexcept {
            promise.Resolve(CreateNetInfoStateObject());
        }

        winrt::Microsoft::ReactNative::JSValue CreateNetInfoStateObject()
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
                detailsWriter.WriteObjectEnd();
            }

            auto writer = winrt::Microsoft::ReactNative::MakeJSValueTreeWriter();
            writer.WriteObjectBegin();
            winrt::Microsoft::ReactNative::WriteProperty(writer, L"type", type);
            winrt::Microsoft::ReactNative::WriteProperty(writer, L"isConnected", isConnected);
            if (isConnected) {
                WriteProperty(writer, L"details", TakeJSValue(detailsWriter));
            }
            writer.WriteObjectEnd();
            return TakeJSValue(writer);
        }
    };
}