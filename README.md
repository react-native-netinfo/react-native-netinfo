
# `@react-native-community/netinfo`

[![CircleCI Status](https://img.shields.io/circleci/project/github/react-native-community/react-native-netinfo/master.svg)](https://circleci.com/gh/react-native-community/workflows/react-native-netinfo/tree/master) ![Supports Android, iOS, and Windows](https://img.shields.io/badge/platforms-android%20|%20ios%20|%20windows-lightgrey.svg) ![MIT License](https://img.shields.io/npm/l/@react-native-community/netinfo.svg) [![Lean Core Extracted](https://img.shields.io/badge/Lean%20Core-Extracted-brightgreen.svg)](https://github.com/facebook/react-native/issues/23313)

React Native Network Info API for Android, iOS & Windows. It allows you to get information on:

* Connection type
* Connection quality

## Getting started
Install the library using either Yarn:

```
yarn add @react-native-community/netinfo
```

or npm:

```
npm install --save @react-native-community/netinfo
```

#### Using React Native >= 0.60
Linking the package manually is not required anymore with [Autolinking](https://github.com/react-native-community/cli/blob/master/docs/autolinking.md).

- **iOS Platform:**

  `$ cd ios && pod install && cd ..` # CocoaPods on iOS needs this extra step

- **Android Platform with Android Support:**

  Using [Jetifier tool](https://github.com/mikehardy/jetifier) for backward-compatibility.

  Modify your **android/build.gradle** configuration:
  ```
  buildscript {
    ext {
      buildToolsVersion = "28.0.3"
      minSdkVersion = 16
      compileSdkVersion = 28
      targetSdkVersion = 28
      # Only using Android Support libraries
      supportLibVersion = "28.0.0"
    }
  ```

- **Android Platform with AndroidX:**

  Modify your **android/build.gradle** configuration:
  ```
  buildscript {
    ext {
      buildToolsVersion = "28.0.3"
      minSdkVersion = 16
      compileSdkVersion = 28
      targetSdkVersion = 28
      # Remove 'supportLibVersion' property and put specific versions for AndroidX libraries
      androidXCore = "1.0.2"
      // Put here other AndroidX dependencies
    }
  ```

#### Using React Native < 0.60

You then need to link the native parts of the library for the platforms you are using. The easiest way to link the library is using the CLI tool by running this command from the root of your project:

```
react-native link @react-native-community/netinfo
```

If you can't or don't want to use the CLI tool, you can also manually link the library using the instructions below (click on the arrow to show them):

<details>
<summary>Manually link the library on iOS</summary>

Either follow the [instructions in the React Native documentation](https://facebook.github.io/react-native/docs/linking-libraries-ios#manual-linking) to manually link the framework or link using [Cocoapods](https://cocoapods.org) by adding this to your `Podfile`:

```ruby
pod 'react-native-netinfo', :path => '../node_modules/@react-native-community/netinfo'
```

</details>

<details>
<summary>Manually link the library on Android</summary>

Make the following changes:

#### `android/settings.gradle`
```groovy
include ':react-native-community-netinfo'
project(':react-native-community-netinfo').projectDir = new File(rootProject.projectDir, '../node_modules/@react-native-community/netinfo/android')
```

#### `android/app/build.gradle`
```groovy
dependencies {
   ...
   implementation project(':react-native-community-netinfo')
}
```

#### `android/app/src/main/.../MainApplication.java`
On top, where imports are:

```java
import com.reactnativecommunity.netinfo.NetInfoPackage;
```

Add the `NetInfoPackage` class to your list of exported packages.

```java
@Override
protected List<ReactPackage> getPackages() {
    return Arrays.asList(
            new MainReactPackage(),
            new NetInfoPackage()
    );
}
```
</details>

<details>
<summary>Manually link the library on Windows</summary>

* Open the solution in Visual Studio for your Windows apps
* Right click in the Explorer and click Add > Existing Project...
* Navigate to `./<app-name>/node_modules/@react-native-community/netinfo/windows/RNCNetInfo/` and add `RNCNetInfo.csproj`
* This time right click on your React Native Windows app under your solutions directory and click Add > Reference...
* Check the `RNCNetInfo` you just added and press ok
* Open up `MainReactNativeHost.cs` for your app and edit the file like so:

```diff
+ using ReactNativeCommunity.NetInfo;
......
        protected override List<IReactPackage> Packages => new List<IReactPackage>
        {
            new MainReactPackage(),
+           new RNCNetInfoPackage(),
        };
```

</details>

## React Native Compatibility
To use this library you need to ensure you are using the correct version of React Native. If you are using a version of React Native that is lower than `0.57` you will need to upgrade that before attempting to use this library.

| `@react-native-community/netinfo` version | Required React Native Version                                                     |
| ----------------------------------------- | --------------------------------------------------------------------------------- |
| `4.x.x`                                   | `>= 0.60` or `>= 0.59` if using [Jetifier](https://github.com/mikehardy/jetifier) |
| `3.x.x`                                   | `>= 0.59`                                                                         |
| `2.x.x`                                   | `>= 0.57`                                                                         |
| `1.x.x`                                   | `>= 0.57`                                                                         |

## Migrating from the core `react-native` module
This module was created when the NetInfo was split out from the core of React Native. To migrate to this module you need to follow the installation instructions above and then change you imports from:

```javascript
import { NetInfo } from "react-native";
```

to:

```javascript
import NetInfo from "@react-native-community/netinfo";
```

Note that the API was updated after it was extracted from NetInfo to support some new features, however, the previous API is still available and works with no updates to your code.

## Usage
Import the library:

```javascript
import NetInfo from "@react-native-community/netinfo";
```

Get the network state once:

```javascript
NetInfo.fetch().then(state => {
  console.log("Connection type", state.type);
  console.log("Is connected?", state.isConnected);
});
```

Subscribe to network state updates:

```javascript
// Subscribe
const unsubscribe = NetInfo.addEventListener(state => {
  console.log("Connection type", state.type);
  console.log("Is connected?", state.isConnected);
});

// Unsubscribe
unsubscribe();
```

## API
* **Types:**
  * [`NetInfoState`](#netinfostate)
  * [`NetInfoStateType`](#netinfostatetype)
  * [`NetInfoCellularGeneration`](#netinfocellulargeneration)
* **Methods:**
  * [`fetch()`](#fetch)
  * [`addEventListener()`](#addeventlistener)
  * [`useNetInfo()`](#usenetinfo)

### Types

#### `NetInfoState`
Describes the current state of the network. It is an object with these properties:

| Property              | Type                                    | Description                                                                                        |
| --------------------- | --------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `type`                | [`NetInfoStateType`](#netinfostatetype) | The type of the current connection.                                                                |
| `isConnected`         | `boolean`                               | If there is an active network connection. Note that this DOES NOT mean that internet is reachable. |
| `isInternetReachable` | `boolean`                               | If the internet is reachable with the currently active network connection.                         |
| `details`             |                                         | The value depends on the `type` value. See below.                                                  |

The `details` value depends on the `type` value.

##### `type` is `none` or `unknown`

`details` is `null`.

##### `type` is `wifi`

`details` has these properties:

| Property                | Platform              | Type      | Description                                                                                                                |
| ----------------------- | --------------------- | --------- | -------------------------------------------------------------------------------------------------------------------------- |
| `isConnectionExpensive` | Android, iOS, Windows | `boolean` | If the network connection is considered "expensive". This could be in either energy or monetary terms.                     |
| `ssid`                  | Android, iOS          | `string`  | The SSID of the network. May not be present, `null`, or an empty string if it cannot be determined. **On iOS, make sure to your app meets at least one of the [following requirements](https://developer.apple.com/documentation/systemconfiguration/1614126-cncopycurrentnetworkinfo?language=objc#discussion)**.             |
| `strength`              | Android               | `number`  | An integer number from `0` to `5` for the signal strength. May not be present if the signal strength cannot be determined. |
| `ipAddress`             | Android, iOS          | `string`  | The external IP address. Can be in IPv4 or IPv6 format. May not be present if it cannot be determined.                     |
| `subnet`                | Android, iOS          | `string`  | The subnet mask in IPv4 format. May not be present if it cannot be determined.                                             |

##### `type` is `cellular`

`details` has these properties:

| Property                | Platform              | Type                                                               | Description                                                                                                           |
| ----------------------- | --------------------- | ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| `isConnectionExpensive` | Android, iOS, Windows | `boolean`                                                          | If the network connection is considered "expensive". This could be in either energy or monetary terms.                |
| `cellularGeneration`    | Android, iOS, Windows | [`NetInfoCellularGeneration`](#netinfocellulargeneration)          | The generation of the cell network the user is connected to. This can give an indication of speed, but no guarantees. |
| `carrier`               | Android, iOS          | `string`                                                           | The network carrier name. May not be present or may be empty if none can be determined.                               |

##### `type` is `bluetooth`, `ethernet`, `wimax`, `vpn`, or `other`

`details` has these properties:

| Property                | Type      | Description                                                                                            |
| ----------------------- | --------- | ------------------------------------------------------------------------------------------------------ |
| `isConnectionExpensive` | `boolean` | If the network connection is considered "expensive". This could be in either energy or monetary terms. |

#### `NetInfoStateType`
Describes the current type of network connection. It is an enum with these possible values:

| Value       | Platform              | Description                                                |
| ----------- | --------------------- | ---------------------------------------------------------- |
| `none`      | Android, iOS, Windows | No network connection is active                            |
| `unknown`   | Android, iOS, Windows | The network state could not or has yet to be be determined |
| `cellular`  | Android, iOS, Windows | Active network over cellular                               |
| `wifi`      | Android, iOS, Windows | Active network over Wifi                                   |
| `bluetooth` | Android               | Active network over Bluetooth                              |
| `ethernet`  | Android, Windows      | Active network over wired ethernet                         |
| `wimax`     | Android               | Active network over WiMax                                  |
| `vpn`       | Android               | Active network over VPN                                    |
| `other`     | Android, iOS, Windows | Active network over another type of network                |

#### `NetInfoCellularGeneration`
Describes the current generation of the `cellular` connection. It is an enum with these possible values:

| Value     | Description                                                                                                       |
| --------- | ----------------------------------------------------------------------------------------------------------------- |
| `null`    | Either we are not currently connected to a cellular network or type could not be determined                       |
| `2g`      | Currently connected to a 2G cellular network. Includes CDMA, EDGE, GPRS, and IDEN type connections                |
| `3g`      | Currently connected to a 3G cellular network. Includes EHRPD, EVDO, HSPA, HSUPA, HSDPA, and UTMS type connections |
| `4g`      | Currently connected to a 4G cellular network. Includes HSPAP and LTE type connections                             |

### Methods

#### `fetch()`

Returns a `Promise` that resolves to a [`NetInfoState`](README.md#netinfostate) object.

**Example:**
```javascript
NetInfo.fetch().then(state => {
  console.log("Connection type", state.type);
  console.log("Is connected?", state.isConnected);
});
```

#### `addEventListener()`

Subscribe to connection information. The callback is called with a parameter of type [`NetInfoState`](README.md#netinfostate) whenever the connection state changes. Your listener will be called with the latest information soon after you subscribe and then with any subsequent changes afterwards. You should not assume that the listener is called in the same way across devices or platforms.

| Parameter   | Type                                                          | Description                                                             |
| ----------- | ------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `listener`  | `(state: `[`NetInfoState`](README.md#netinfostate))` => void` | The listener which will be called whenever the connection state changes |

**Example:**
```javascript
// Subscribe
const unsubscribe = NetInfo.addEventListener(state => {
  console.log("Connection type", state.type);
  console.log("Is connected?", state.isConnected);
});

// Unsubscribe
unsubscribe();
```

#### `useNetInfo()`

A [React Hook](https://reactjs.org/docs/hooks-intro.html) which can be used to get access to the latest state. It returns a hook with the [`NetInfoState`](README.md#netinfostate) type.

**Example:**
```jsx
import {useNetInfo} from "@react-native-community/netinfo";

const YourComponent = () => {
  const netInfo = useNetInfo();

  return (
    <View>
      <Text>Type: {netInfo.type}</Text>
      <Text>Is Connected? {netInfo.isConnected.toString()}</Text>
    </View>
  );
};
```

## Troubleshooting

### Errors when building on Android

This library was migrated from using the support library to AndroidX in version `4.0.0`. All of your depenencies must be using either the support library *or* AndroidX. Using a mixture of the two is not possible.

From React Native 0.60 AndroidX is used by default.

If you need to either convert this library back to the support library (to use an older React Native version) or convert other libraries forward to use AndroidX (if they have not been updated yet), you can use the [Jetifier](https://github.com/mikehardy/jetifier) tool.

### Errors while running Jest tests

If you do not have a Jest Setup file configured, you should add the following to your Jest settings and create the `jest.setup.js` file in project root:

```js
setupFiles: ['<rootDir>/jest.setup.js']
```

You should then add the following to your Jest setup file to mock the NetInfo Native Module:

```js
import { NativeModules } from 'react-native';

NativeModules.RNCNetInfo = {
  getCurrentState: jest.fn(() => Promise.resolve()),
  addListener: jest.fn(),
  removeListeners: jest.fn()
};
```

### Issues with the iOS simulator

There is a [known](http://openradar.appspot.com/14585459) [issue](http://www.openradar.appspot.com/29913522) with the iOS Simulator which causes it to not receive network change notifications correctly when the host machine disconnects and then connects to Wifi. If you are having issues with iOS then please test on an actual device before reporting any bugs.

## Maintainers

* [Matt Oakes](https://github.com/matt-oakes) - [Freelance React Native Developer](http://mattoakes.net)
* [Mike Diarmid](https://github.com/salakar) - [Invertase](https://invertase.io)

## Contributing

Please see the [contributing guide](/CONTRIBUTING.md).

## License

The library is released under the MIT license. For more information see [`LICENSE`](/LICENSE).
