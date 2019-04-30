
# `@react-native-community/netinfo`

[![CircleCI Status](https://img.shields.io/circleci/project/github/react-native-community/react-native-netinfo/master.svg)](https://circleci.com/gh/react-native-community/workflows/react-native-netinfo/tree/master) ![Supports Android and iOS](https://img.shields.io/badge/platforms-android%20|%20ios-lightgrey.svg) ![MIT License](https://img.shields.io/npm/l/@react-native-community/netinfo.svg)

React Native Network Info API for Android & iOS. It allows you to get information on:

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
Import the library:

```javascript
import NetInfo from "@react-native-community/netinfo";
```

Get the network state once:

```javascript
NetInfo.getConnectionInfo().then(data => {
  console.log("Connection type", data.type);
  console.log("Connection effective type", data.effectiveType);
});
```

Subscribe to network updates:

```javascript
const listener = data => {
  console.log("Connection type", data.type);
  console.log("Connection effective type", data.effectiveType);
};

// Subscribe
const subscription = NetInfo.addEventListener('connectionChange', listener);

// Unsubscribe through remove
subscription.remove();
// Or, unsubscribe through event name
NetInfo.removeEventListener('connectionChange', listener);
```

## API
* **Types:**
  * [`NetInfoData`](README.md#netinfodata)
  * [`NetInfoType`](README.md#netinfotype)
  * [`NetInfoEffectiveType`](README.md#netinfoeffectivetype)
* **Methods:**
  * [`getConnectionInfo()`](README.md#getconnectioninfo)
  * [`addEventListener()`](README.md#addeventlistener)
  * [`isConnected.fetch()`](README.md#isconnectedfetch)
  * [`isConnected.addEventListener()`](README.md#isconnectedaddeventlistener)
  * [`isConnectionExpensive()`](README.md#isconnectionexpensive)

### Types
#### `NetInfoData`
Describes the current state of the network. It is an object with these properties:

| Property        | Platform     | Type                                                     | Description                                                                                        |
| --------------- | ------------ | -------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `type`          | Android, iOS | [`NetInfoType`](README.md#netinfotype)                   | The type of the current connection.                                                                |
| `effectiveType` | Android, iOS | [`NetInfoEffectiveType`](README.md#netinfoeffectivetype) | The type of cellular connection (eg. 3g, 4g, etc.). Will be `unknown` unless `type` is `cellular`. |

#### `NetInfoType`
Describes the current type of network connection. It is an enum with these possible values:

| Value       | Platform     | Description                                         |
| ----------- | ------------ | --------------------------------------------------- |
| `none`      | Android, iOS | No network connection is active                     |
| `unknown`   | Android, iOS | The network state could not be determined           |
| `cellular`  | Android, iOS | The active network is a cellular connection         |
| `wifi`      | Android, iOS | The active network is a Wifi connection             |
| `bluetooth` | Android      | The active network over Bluetooth                   |
| `ethernet`  | Android      | The active network over a wired ethernet connection |
| `wimax`     | Android      | The active network over a WiMax connection          |

#### `NetInfoEffectiveType`
Describes the current type of the `cellular` connection. It is an enum with these possible values:

| Value     | Platform     | Description                                                                                                              |
| --------- | ------------ | ------------------------------------------------------------------------------------------------------------------------ |
| `unknown` | Android, iOS | Either we are not currently connected to a cellular network or type could not be determined                              |
| `2g`      | Android, iOS | We are currently connected to a 2G cellular network. Includes CDMA, EDGE, GPRS, and IDEN type connections                |
| `3g`      | Android, iOS | We are currently connected to a 3G cellular network. Includes EHRPD, EVDO, HSPA, HSUPA, HSDPA, and UTMS type connections |
| `4g`      | Android, iOS | We are currently connected to a 4G cellular network. Includes HSPAP and LTE type connections                             |

### Methods

#### `getConnectionInfo()`
**Platforms:** Android, iOS

Returns a `Promise` that resolves to a [`NetInfoData`](README.md#netinfodata) object.

**Example:**
```javascript
NetInfo.getConnectionInfo().then(data => {
  console.log("Connection type", data.type);
  console.log("Connection effective type", data.effectiveType);
});
```

#### `addEventListener()`
**Platforms:** Android, iOS

Subscribe to connection information. The callback is called a paramter of type [`NetInfoData`](README.md#netinfodata) whenever the connection state changes. Your listener will be called with the latest information soon after you subscribe and then with any subsiquent changes afterwards. Due to platform differences, you should not assume that the listener is called in the same way across devices or platforms.

| Parameter   | Type                                                        | Description                                                             |
| ----------- | ----------------------------------------------------------- | ----------------------------------------------------------------------- |
| `eventName` | `connectionChange`                                          | The event name is always `connectionChange`                             |
| `listener`  | `(data: `[`NetInfoData`](README.md#netinfodata))` => void` | The listener which will be called whenever the connection state changes |

**Example:**
```javascript
const listener = data => {
  console.log("Connection type", data.type);
  console.log("Connection effective type", data.effectiveType);
};

// Subscribe
const subscription = NetInfo.addEventListener('connectionChange', listener);

// Unsubscribe through remove
subscription.remove();
// Or, unsubscribe through event name
NetInfo.removeEventListener('connectionChange', listener);
```

#### `isConnected.fetch()`
**Platforms:** Android, iOS

Returns a `Promise` that resolves to a `boolean` which says if there is an active connection.

*Note: This only says if a device has an active connection, not that it is able to reach the internet.*

Getting the connection status once:

**Example:**
```javascript
NetInfo.isConnected.fetch().then(isConnected => {
  console.log("Is connected", isConnected);
});
```

#### `isConnected.addEventListener()`
**Platforms:** Android, iOS

Calls the listener with a `boolean` parameter whenever the connection state change which says if there is an active connection. Your listener will be called with the latest information soon after you subscribe and then with any subsiquent changes afterwards. Due to platform differences, you should not assume that the listener is called in the same way across devices or platforms.

*Note: This only says if a device has an active connection, not that it is able to reach the internet.*

| Parameter   | Type                              | Description                                                             |
| ----------- | --------------------------------- | ----------------------------------------------------------------------- |
| `eventName` | `connectionChange`                | The event name is always `connectionChange`                             |
| `listener`  | `(isConnection: boolean) => void` | The listener which will be called whenever the connection state changes |

**Example:**
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

#### `isConnectionExpensive()`
**Platforms:** Android

Returns a `Promise` which resolves to a `boolean` which says if the current active connection is metered or not. A network is classified as metered when the user is sensitive to heavy data usage on that connection due to monetary costs, data limitations, or battery/performance issues.

**Example:**
```javascript
NetInfo.isConnectionExpensive().then(isConnectionExpensive => {
  console.log("Is connection expensive", isConnectionExpensive);
});
```

## Known issues with the iOS simulator

There is a [known](http://openradar.appspot.com/14585459) [issue](http://www.openradar.appspot.com/29913522) with the iOS Simulator which causes it to not receive network change notifications correctly when the host machine disconnects and then connects to Wifi. If you are having issues with iOS then please test on an actual device before reporting any bugs.

## Maintainers

* [Matt Oakes](https://github.com/matt-oakes) - [Freelance React Native Developer](http://mattoakes.net)
* [Mike Diarmid](https://github.com/salakar) - [Invertase](https://invertase.io)

## Contributing

Please see the [contributing guide](/CONTRIBUTING.md).

## License

The library is released under the MIT license. For more information see [`LICENSE`](/LICENSE).
