
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
const subscription = NetInfo.addEventListener(state => {
  console.log("Connection type", state.type);
  console.log("Is connected?", state.isConnected);
});

// Unsubscribe
subscription();
```

## API
* **Types:**
  * [`NetInfoState`](README.md#netinfostate)
  * [`NetInfoStateType`](README.md#netinfostatetype)
  * [`NetInfoCellularGeneration`](README.md#netinfocellulargeneration)
* **Methods:**
  * [`fetch()`](README.md#fetch)
  * [`addEventListener()`](README.md#addeventlistener)

### Types

#### `NetInfoState`
Describes the current state of the network. It is an object with these properties:

| Property        | Type                                             | Description                                                                                        |
| --------------- | ------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| `type`          | [`NetInfoStateType`](README.md#netinfostatetype) | The type of the current connection.                                                                |
| `isConnected`   | `boolean`                                        | If there is an active network connection. Note that this DOES NOT mean that internet is reachable. |
| `details`       |                                                  | The value depends on the `type` value. See below.                                                  |

The `details` value depends on the `type` value.

##### `type` is `none` or `unknown`

`details` is `null`.

##### `type` is `wifi`, `blueeooth`, `ethernet`, or `wimax`

`details` has these properties:

| Property                | Type      | Description                                                                                           |
| ----------------------- | --------- | ----------------------------------------------------------------------------------------------------- |
| `isConnectionExpensive` | `boolean` | If the network connection is considered "expensive". This could be in either energy or monetry terms. |

##### `type` is `cellular`

`details` has these properties:

| Property                | Type                                                               | Description                                                                                                           |
| ----------------------- | ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| `isConnectionExpensive` | `boolean`                                                          | If the network connection is considered "expensive". This could be in either energy or monetry terms.                 |
| `cellularGeneration`    | [`NetInfoCellularGeneration`](README.md#netinfocellulargeneration) | The generation of the cell network the user is connected to. This can give an indication of speed, but no guarantees. |

#### `NetInfoStateType`
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

#### `NetInfoCellularGeneration`
Describes the current generation of the `cellular` connection. It is an enum with these possible values:

| Value     | Description                                                                                                              |
| --------- | ------------------------------------------------------------------------------------------------------------------------ |
| `unknown` | Either we are not currently connected to a cellular network or type could not be determined                              |
| `2g`      | We are currently connected to a 2G cellular network. Includes CDMA, EDGE, GPRS, and IDEN type connections                |
| `3g`      | We are currently connected to a 3G cellular network. Includes EHRPD, EVDO, HSPA, HSUPA, HSDPA, and UTMS type connections |
| `4g`      | We are currently connected to a 4G cellular network. Includes HSPAP and LTE type connections                             |

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

Subscribe to connection information. The callback is called a paramter of type [`NetInfoState`](README.md#netinfostate) whenever the connection state changes. Your listener will be called with the latest information soon after you subscribe and then with any subsiquent changes afterwards. Due to platform differences, you should not assume that the listener is called in the same way across devices or platforms.

| Parameter   | Type                                                          | Description                                                             |
| ----------- | ------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `listener`  | `(state: `[`NetInfoState`](README.md#netinfostate))` => void` | The listener which will be called whenever the connection state changes |

**Example:**
```javascript
// Subscribe
const subscription = NetInfo.addEventListener(state => {
  console.log("Connection type", state.type);
  console.log("Is connected?", state.isConnected);
});

// Unsubscribe
subscription.remove();
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
