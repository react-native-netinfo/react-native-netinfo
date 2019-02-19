
# `@react-native-community/netinfo`

[![CircleCI Status](https://img.shields.io/circleci/project/github/react-native-community/react-native-netinfo/master.svg)](https://circleci.com/gh/react-native-community/workflows/react-native-netinfo/tree/master) ![Supports Android and iOS](https://img.shields.io/badge/platforms-android%20|%20ios-lightgrey.svg) ![MIT License](https://img.shields.io/npm/l/@react-native-community/netinfo.svg)

React Native Network Info API for Android & iOS. It allows you to get information on:

* Online/offline status
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

You then need to link the native parts of the library for the platforms you are using. The easiest way to link the library is using the CLI tool by running this command from the root of your project:

```
react-native link @react-native-community/netinfo
```

If you can't or don't want to use the CLI tool, you can also manually link the library using the instructions below (click on the arrow to show them):

<details>
<summary>Manually link the library on iOS</summary>

Either follow the [instructions in the React Native documentation](https://facebook.github.io/react-native/docs/linking-libraries-ios#manual-linking) to manually link the framework or link using [Cocoapods](https://cocoapods.org) by adding this to your `Podfile`:

```ruby
pod 'react-native-netinfo', path: '../node_modules/react-native-netinfo'
```

</details>

<details>
<summary>Manually link the library on Android</summary>

Make the following changes:

#### `android/settings.gradle`
```groovy
include ':@react-native-community/netinfo'
project(':@react-native-community/netinfo').projectDir = new File(rootProject.projectDir, '../node_modules/@react-native-community/netinfo/android')
```

#### `android/app/build.gradle`
```groovy
dependencies {
   ...
   implementation project(':@react-native-community/netinfo')
}
```

#### `android/app/src/main/.../MainApplication.java`
On top, where imports are:

```java
import com.reactnativecommunity.netinfo.NetInfoPackage;
```

Add the `RNLocationPackage` class to your list of exported packages.

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

## Migrating from the core `react-native` module
This module was created when the NetInfo was split out from the core of React Native. To migrate to this module you need to follow the installation instructions above and then change you imports from:

```javascript
import { NetInfo } from "react-native";
```

to:

```javascript
import NetInfo from "@react-native-community/netinfo";
```

## Usage
Start by importing the library:

```javascript
import NetInfo from "@react-native-community/netinfo";
```

### Get connection info
Returns a promise that resolves to an object with `type` and `effectiveType` keys whose values are a `ConnectionType` and an `EffectiveConnectionType`), respectively.

```javascript
NetInfo.getConnectionInfo().then(connectionInfo => {
  console.log("Connection type", connectionInfo.type);
  console.log("Connection effective type", connectionInfo.effectiveType);
});
```

#### `ConnectionType`
Cross platform values:

* `none` - Device is offline
* `wifi` - Device is online and connected via wifi, or is the iOS simulator
* `cellular` - Device is connected via Edge, 3G, WiMax, or LTE
* `unknown` - Error case and the network status is unknown

Android-only values:

* `bluetooth` - Device is connected via Bluetooth
* `ethernet` - Device is connected via Ethernet
* `wimax` - Device is connected via WiMAX

#### `EffectiveConnectionType`
Cross platform values:

* `2g`
* `3g`
* `4g`
* `unknown`

### Subscribe to connection info
Subscribe to connection information. The callback is called whenever the connection status changes. The returned object shape is the same as `getConnectionInfo` above.

```javascript
const listener = connectionInfo => {
  console.log("Connection type", connectionInfo.type);
  console.log("Connection effective type", connectionInfo.effectiveType);
};

// Subscribe
const subscription = NetInfo.addEventListener('connectionChange', listener);

// Unsubscribe through remove
subscription.remove();

// Unsubscribe through event name
NetInfo.removeEventListener('connectionChange', listener);
```

### Is connected
Returns a promise that resolves to a boolean which says if there is an active connection.

*Note: This only says if a device has an active connection, not that it is able to reach the internet.*

Getting the connection status once:

```javascript
NetInfo.isConnected.fetch().then(isConnected => {
  console.log("Is connected", isConnected);
});
```

Or subscribing to changes:

```javascript
const listener = isConnected => {
  console.log("Is connected", isConnected);
};

// Subscribe
const subscription = NetInfo.isConnected.addEventListener('connectionChange', listener);

// Unsubscribe through remove
subscription.remove();

// Unsubscribe through event name
NetInfo.isConnected.removeEventListener('connectionChange', listener);
```

### Is connection expensive (Android only)
Detect if the current active connection is metered or not. A network is classified as metered when the user is sensitive to heavy data usage on that connection due to monetary costs, data limitations or battery/performance issues.

```javascript
NetInfo.isConnectionExpensive().then(isConnectionExpensive => {
  console.log("Is connection expensive", isConnectionExpensive);
});
```

## Maintainers

* [Matt Oakes](https://github.com/matt-oakes) - [Freelance React Native Developer](http://mattoakes.net)
* [Mike Diarmid](https://github.com/salakar) - [Invertase](https://invertase.io)

## License
The library is released under the MIT licence. For more information see `LICENSE`.
