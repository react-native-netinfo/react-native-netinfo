#include "pch.h"
#include "ReactPackageProvider.h"
#include "ReactPackageProvider.g.cpp"
#include "RNCNetInfo.h"

using namespace winrt::Microsoft::ReactNative;

namespace winrt::ReactNativeNetInfo::implementation {

    void ReactPackageProvider::CreatePackage(IReactPackageBuilder const& packageBuilder) noexcept {
        AddAttributedModules(packageBuilder);
    }

} // namespace winrt::ReactNativeNetInfo::implementation
