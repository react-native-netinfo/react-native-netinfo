#!/bin/bash
set -eo pipefail

BUILD_ACTIONS="$@"
INFO_PLIST="node_modules/react-native-test-app/macos/ReactTestApp/Info.plist"

echo "[Xcode e2e] Building macOS project"

# This is currently the only way to add `netinfoexample` scheme to the test app.
# We should probably add support for custom schemes in `react-native-test-app`.
if [[ -z $(grep netinfoexample $INFO_PLIST) ]]; then
  /usr/libexec/PlistBuddy -c 'add :CFBundleURLTypes array' $INFO_PLIST
  /usr/libexec/PlistBuddy -c 'add :CFBundleURLTypes: dict' $INFO_PLIST
  /usr/libexec/PlistBuddy -c 'add :CFBundleURLTypes:0:CFBundleTypeRole string Editor' $INFO_PLIST
  /usr/libexec/PlistBuddy -c 'add :CFBundleURLTypes:0:CFBundleURLName string com.reactnativecommunity.netinfo.example' $INFO_PLIST
  /usr/libexec/PlistBuddy -c 'add :CFBundleURLTypes:0:CFBundleURLSchemes array' $INFO_PLIST
  /usr/libexec/PlistBuddy -c 'add :CFBundleURLTypes:0:CFBundleURLSchemes: string netinfoexample' $INFO_PLIST
fi

if [[ $BUILD_ACTIONS == build* ]]; then
  mkdir -p example/dist

  yarn react-native bundle \
    --entry-file index.tsx \
    --platform macos \
    --dev false \
    --bundle-output example/dist/main.macos.jsbundle \
    --assets-dest example/dist

  pod install --project-directory=example/macos
fi

xcodebuild \
  -workspace example/macos/NetInfoExample.xcworkspace \
  -scheme NetInfoExample \
  -configuration Release \
  -derivedDataPath example/macos/build \
  $BUILD_ACTIONS

exit $?
