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
       /**
        * We are migrating from synchronous network information to asynchronous due to underlying WinRT APIs that require some member properties to be acquired asynchronously
        * When handling the network event listener we need to ensure that we are returning a consistent chain of network information so we need to build a chain of asynchronous objects
        * to prevent race conditions that would result in misordered state objects
        * https://kennykerr.ca/2018/03/09/cppwinrt-producing-async-objects/
        */
       IAsyncAction createEmptyAsync() { co_return; };
       IAsyncAction currentAsyncAction{ createEmptyAsync() };
       std::shared_ptr<NetworkInfo> networkInfo = std::make_shared<NetworkInfo>();

        RNCNetInfo() {
            
            networkInfo->StatusChanged([&](const auto& /*sender*/) {
                currentAsyncAction = CreateAndNotifyNetInfoStateObjectAsync();
            });
        }

        REACT_EVENT(NetworkStatusChanged, L"netInfo.networkStatusDidChange");
        std::function<void(JSValue)> NetworkStatusChanged;

        REACT_METHOD(getCurrentState);
        void getCurrentState(std::string requestedInterface,
            ReactPromise<JSValue> const& promise) noexcept {

            CreateNetInfoStateObjectAsync(networkInfo, [promise](std::optional<JSValue> netInfoObject) {
                if (netInfoObject.has_value()) {
                    promise.Resolve(std::move(netInfoObject.value()));
                }
                else {
                    promise.Reject(winrt::Microsoft::ReactNative::ReactError{ "Unable to get network state" });
                }
            }, requestedInterface);
        }

        IAsyncAction CreateAndNotifyNetInfoStateObjectAsync() {
            std::shared_ptr<std::optional<JSValue>> currentNetInfoObject = std::make_shared<std::optional<JSValue>>(std::nullopt);
            co_await CreateNetInfoStateObjectAsync(networkInfo, [currentNetInfoObject](std::optional<JSValue> netInfoObject) {
                currentNetInfoObject->swap(netInfoObject);
            });
            co_await currentAsyncAction;
            if (currentNetInfoObject->has_value()) {
                NetworkStatusChanged(std::move(currentNetInfoObject->value()));
            }
        }

        IAsyncAction static CreateNetInfoStateObjectAsync(std::shared_ptr<NetworkInfo> const& networkInfo, std::function<void(std::optional<JSValue>)> onComplete, std::string requestedInterface = "")
        {
            try {
                auto isConnected = networkInfo->IsConnected();
                auto type = networkInfo->ConnectivityType(requestedInterface);
                auto detailsWriter = MakeJSValueTreeWriter();
                if (isConnected) {
                    detailsWriter.WriteObjectBegin();
                    WriteProperty(detailsWriter, L"isConnectionExpensive", networkInfo->IsConnectionExpensive());
                    if (type == NetworkInfo::CONNECTION_TYPE_CELLULAR)
                    {
                        WriteProperty(detailsWriter, L"cellularGeneration", networkInfo->CellularGeneration());
                    }
                    if (type == NetworkInfo::CONNECTION_TYPE_WIFI)
                    {
                        WriteProperty(detailsWriter, L"frequency", co_await networkInfo->GetFrequency());
                        WriteProperty(detailsWriter, L"ssid", networkInfo->GetSsid());
                        WriteProperty(detailsWriter, L"strength", networkInfo->GetStrength());
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
                onComplete(TakeJSValue(writer));
            }
            catch (...) {
                onComplete(std::nullopt);
            }
        }
    };
}