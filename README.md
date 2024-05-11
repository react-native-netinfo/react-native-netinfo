
# `@react-native-community/netinfo`

[![Actions](https://github.com/react-native-netinfo/react-native-netinfo/actions/workflows/ci.yml/badge.svg)](https://github.com/react-native-netinfo/react-native-netinfo/actions/workflows/ci.yml) ![Supports Android, iOS, macOS, Windows and Web](https://img.shields.io/badge/platforms-android%20|%20ios%20|%20macos%20|%20windows%20|%20web-lightgrey.svg) ![MIT License](https://img.shields.io/npm/l/@react-native-community/netinfo.svg) [![Lean Core Extracted](https://img.shields.io/badge/Lean%20Core-Extracted-brightgreen.svg)](https://github.com/facebook/react-native/issues/23313)

React Native Network Info API for Android, iOS, macOS, Windows & Web. It allows you to get information on:

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

  `$ npx pod-install` # CocoaPods on iOS needs this extra step

- **Android Platform with AndroidX:**

  Modify your **android/build.gradle** configuration:
  ```
  buildscript {
    ext {
      buildToolsVersion = "xx.yy.zz"
      minSdkVersion = xyz
      compileSdkVersion = xyz
      targetSdkVersion = xyz
    }
  ```

- **macOS Platform:**

  Autolinking is not yet available on macOS.  See the [Manual linking steps for macOS](#manual-linking-macos) below.

<details id='manual-linking-macos'>
<summary>Manually link the library on macOS</summary>

1. Open your project `.xcodeproj` on xcode.

2. Right click on the Libraries folder and select `Add files to "yourProjectName"`.

3. Add `RNCNetInfo.xcodeproj` (located at `node_modules/@react-native-community/react-native-netinfo/macos`) to your project Libraries.

4. Go to `Build Phases -> Link Binary with Libraries` and add: `libRNCNetInfo-macOS.a`.

</details>

- **Windows Platform:**

  Autolinking automatically works on RNW >= 0.63.

## Minimum supported versions for windows

- react-native-windows 0.63 or newer
- MSVC build tools v142 (included in Visual Studio 2019) or newer
- x86, x64, or arm64 are supported, arm (32-bit) is not supported


## React Native Compatibility
To use this library you need to ensure you are using the correct version of React Native.
We support react-native 0.60+ with auto-linking.
  
If you are using a version of React Native that is lower than 0.60 check older versions of this README for details,
but no support will be provided.

## Browser Compatilibity
The web implementation heavily depends on the [Network Information API](https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API) which is still an is an experimental technology and thus it's not supported in every browser.
If this API is not available the library will safely fallback to the old [onLine](https://developer.mozilla.org/en-US/docs/Web/API/NavigatorOnLine/onLine) property and return basic connection information.

AbortController is used to cancel network requests, and may not be available on Internet Explorer, though it is available on Edge https://caniuse.com/abortcontroller

## Node Compatibility

Node v16 is the minimum required node version - `AbortController` is only present in stable versions of node from v16 on 

## Migrating from the core `react-native` module
This module was created when the NetInfo was split out from the core of React Native. To migrate to this module you need to follow the installation instructions above and then change your imports from:

```javascript
import { NetInfo } from "react-native";
```

to:

```javascript
import NetInfo from "@react-native-community/netinfo";
```

Note that the API was updated after it was extracted from NetInfo to support some new features, however, the previous API is still available and works with no updates to your code.

## Usage

### Global vs isolated instance
Internally this library has a network state manager class to handle all the functionality and state. This library provides two options for instantiating the class:
1. you can use global library functions which taps into a global singleton instance of the class
2. or you can create isolated instances of the class to tap into, each being separately configured

### Global instance functions:
Subscribe to network state updates:

```javascript
import { addEventListener } from "@react-native-community/netinfo";

// Subscribe
const unsubscribe = addEventListener(state => {
  console.log("Connection type", state.type);
  console.log("Is connected?", state.isConnected);
});

// Unsubscribe
unsubscribe();
```

Get the network state once:

```javascript
import { fetch } from "@react-native-community/netinfo";

fetch().then(state => {
  console.log("Connection type", state.type);
  console.log("Is connected?", state.isConnected);
});
```

Get network state updates from the global instance via a react hook:

```javascript
import { useNetInfo } from "@react-native-community/netinfo";

const { type, isConnected } = useNetInfo();
```

### Isolated instance:
Use an isolated instance of the network manager:

```javascript
import { useNetInfoInstance } from "@react-native-community/netinfo";

const { netInfo: { type, isConnected }, refresh } = useNetInfoInstance();
```

## API
* **Types:**
  * [`NetInfoState`](#netinfostate)
  * [`NetInfoStateType`](#netinfostatetype)
  * [`NetInfoCellularGeneration`](#netinfocellulargeneration)
* **Global instance methods:**
  * [`fetch()`](#fetch)
  * [`refresh()`](#refresh)
  * [`addEventListener()`](#addeventlistener)
  * [`useNetInfo()`](#usenetinfo)
* **Isolated instance:**
  * [`useNetInfoInstance()`](#usenetinfoinstance)

### Types

#### `NetInfoState`
Describes the current state of the network. It is an object with these properties:

| Property              | Type                                    | Description                                                                                        |
| --------------------- | --------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `type`                | [`NetInfoStateType`](#netinfostatetype) | The type of the current connection.                                                                |
| `isConnected`         | `boolean`, `null`                               | If there is an active network connection. Defaults to `null` on most platforms for `unknown` networks. Note: Web browsers report network type `unknown` for many otherwise valid networks (https://caniuse.com/netinfo), so `isConnected` may be `true` or `false` and represent a real connection status even for unknown network types in certain cases.|
| `isInternetReachable` | `boolean`, `null`                             | If the internet is reachable with the currently active network connection. If unknown defaults to `null`                         |
| `isWifiEnabled`       | `boolean`                               | *(Android only)* Whether the device's WiFi is ON or OFF.                                           |
| `details`             |                                         | The value depends on the `type` value. See below.                                                  |

The `details` value depends on the `type` value.

##### `type` is `none` or `unknown`

`details` is `null`.

##### `type` is `wifi`

`details` has these properties:

| Property                | Platform                          | Type      | Description                                                                                                                |
| ----------------------- | --------------------------------- | --------- | -------------------------------------------------------------------------------------------------------------------------- |
| `isConnectionExpensive` | Android, iOS, macOS, Windows, Web | `boolean` | If the network connection is considered "expensive". This could be in either energy or monetary terms.                     |
| `ssid`                  | Android, iOS (not tvOS), Windows | `string`  | The SSID of the network. May not be present, `null`, or an empty string if it cannot be determined. **On iOS, your app must meet at least one of the [following requirements](https://developer.apple.com/documentation/systemconfiguration/1614126-cncopycurrentnetworkinfo?language=objc#discussion) and you must set the `shouldFetchWiFiSSID` configuration option or no attempt will be made to fetch the SSID. On Android, you need to have the `ACCESS_FINE_LOCATION` permission in your `AndroidManifest.xml` and accepted by the user**. |
| `bssid`                 | Android, iOS (not tvOS), Windows* | `string`  | The BSSID of the network. May not be present, `null`, or an empty string if it cannot be determined. **On iOS, make sure your app meets at least one of the [following requirements](https://developer.apple.com/documentation/systemconfiguration/1614126-cncopycurrentnetworkinfo?language=objc#discussion). On Android, you need to have the `ACCESS_FINE_LOCATION` permission in your `AndroidManifest.xml` and accepted by the user**. |
| `strength`              | Android, Windows                 | `number`  | An integer number from `0` to `100` for the signal strength. May not be present if the signal strength cannot be determined. |
| `ipAddress`             | Android, iOS, macOS, Windows      | `string`  | The external IP address. Can be in IPv4 or IPv6 format. May not be present if it cannot be determined.                     |
| `subnet`                | Android, iOS, macOS               | `string`  | The subnet mask in IPv4 format. May not be present if it cannot be determined.                                             |
| `frequency`             | Android, Windows*               | `number`  | Network frequency. Example: For 2.4 GHz networks, the method will return 2457. May not be present if it cannot be determined.                                             |
| `linkSpeed`             | Android                         | `number`  | The link speed in Mbps.                                             |
| `rxLinkSpeed`           | Android                         | `number`  | The current receive link speed in Mbps. (Android Q / API level 29 and above)                                             |
| `txLinkSpeed`           | Android                         | `number`  | The current transmit link speed in Mbps. (Android Q / API level 29 and above)                                             |


`*` Requires `wiFiControl` capability in appxmanifest. Without it, these values will be null.

##### `type` is `cellular`

`details` has these properties:

| Property                | Platform                          | Type                                                               | Description                                                                                                           |
| ----------------------- | --------------------------------- | ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| `isConnectionExpensive` | Android, iOS, macOS, Windows, Web | `boolean`                                                          | If the network connection is considered "expensive". This could be in either energy or monetary terms.                |
| `cellularGeneration`    | Android, iOS, Windows             | [`NetInfoCellularGeneration`](#netinfocellulargeneration)          | The generation of the cell network the user is connected to. This can give an indication of speed, but no guarantees. |
| `carrier`               | Android, iOS                      | `string`                                                           | The network carrier name. May not be present or may be empty if none can be determined.                               |

##### `type` is `bluetooth`, `ethernet`, `wimax`, `vpn`, or `other`

`details` has these properties:

| Property                | Type      | Description                                                                                            |
| ----------------------- | --------- | ------------------------------------------------------------------------------------------------------ |
| `isConnectionExpensive` | `boolean` | If the network connection is considered "expensive". This could be in either energy or monetary terms. |

#### `NetInfoStateType`
Describes the current type of network connection. It is an enum with these possible values:

| Value       | Platform                          | Description                                                |
| ----------- | --------------------------------- | ---------------------------------------------------------- |
| `none`      | Android, iOS, macOS, Windows, Web | No network connection is active                            |
| `unknown`   | Android, iOS, macOS, Windows, Web | The network state could not or has yet to be be determined |
| `cellular`  | Android, iOS, Windows, Web        | Active network over cellular                               |
| `wifi`      | Android, iOS, macOS, Windows, Web | Active network over Wifi                                   |
| `bluetooth` | Android, Web                      | Active network over Bluetooth                              |
| `ethernet`  | Android, macOS, Windows, Web      | Active network over wired ethernet                         |
| `wimax`     | Android, Web                      | Active network over WiMax                                  |
| `vpn`       | Android                           | Active network over VPN                                    |
| `other`     | Android, iOS, macOS, Windows, Web | Active network over another type of network                |

#### `NetInfoCellularGeneration`
Describes the current generation of the `cellular` connection. It is an enum with these possible values:

| Value     | Description                                                                                                       |
| --------- | ----------------------------------------------------------------------------------------------------------------- |
| `null`    | Either we are not currently connected to a cellular network or type could not be determined                       |
| `2g`      | Currently connected to a 2G cellular network. Includes CDMA, EDGE, GPRS, and IDEN type connections                |
| `3g`      | Currently connected to a 3G cellular network. Includes EHRPD, EVDO, HSPA, HSUPA, HSDPA, and UTMS type connections |
| `4g`      | Currently connected to a 4G cellular network. Includes HSPAP and LTE type connections                             |
| `5g`      | Currently connected to a 5G cellular network. Includes NRNSA (iOS only) and NR type connections                   |
  
#### `NetInfoConfiguration`
The configuration options for the library.

| Property | Type | Default | Description
| ---------------------------- | --------------------------------- | ----------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | 
| `reachabilityUrl`            | `string`                          | `https://clients3.google.com/generate_204` | The URL to call to test if the internet is reachable. Only used on platforms which do not supply internet reachability natively or if `useNativeReachability` is `false`.           
| `reachabilityHeaders`            | `object`                          | `{}` | A HTTP headers object, an object literal, or an array of two-item arrays to set request's headers, to use during the reachabilityUrl URL call to test if the internet is reachable. Defaults to `{}`.                                                                                               |
| `reachabilityMethod`            | `NetInfoMethodType`                          | `HEAD` | The HTTP request method to use to call reachabilityUrl URL to call to test if the internet is reachable. Defaults to `HEAD`. `GET` is also available                                                                                               |
| `reachabilityTest`           | `(response: Response) => boolean` | `Promise.resolve(response.status === 204)` | A function which is passed the `Response` from calling the reachability URL. It should return `true` if the response indicates that the internet is reachable. Only used on platforms which do not supply internet reachability natively or if `useNativeReachability` is `false`. |
| `reachabilityShortTimeout`   | `number`                          | 5 seconds | The number of milliseconds between internet reachability checks when the internet was not previously detected. Only used on platforms which do not supply internet reachability natively or if `useNativeReachability` is `false`.                                                 |
| `reachabilityLongTimeout`    | `number`                          | 60 seconds | The number of milliseconds between internet reachability checks when the internet was previously detected. Only used on platforms which do not supply internet reachability natively or if `useNativeReachability` is `false`.                                                     |
| `reachabilityRequestTimeout` | `number`                          | 15 seconds | The number of milliseconds that a reachability check is allowed to take before failing. Only used on platforms which do not supply internet reachability natively or if `useNativeReachability` is `false`.                                                   |                    
| `reachabilityShouldRun` | `() => boolean`                          | `() => true` | A function which returns a boolean to determine if checkInternetReachability should be run.                                                   |                    
| `shouldFetchWiFiSSID` | `boolean`                          | `false` | A flag indicating one of the requirements on iOS has been met to retrieve the network (B)SSID, and the native SSID retrieval APIs should be called.  This has no effect on Android.
| `useNativeReachability` | `boolean`                          | `true` | A flag indicating whether or not Netinfo should use native reachability checks, if available. 


### Global instance methods

Please note the difference between global and isolated usage described [here](#global-vs-isolated-instance)

#### `configure()`

Configures the library with the given configuration. You only need to supply the properties which you want to change from the default values.

Note that calling this will stop all previously added listeners from being called again. It is best to call this right when your application is started to avoid issues.

**Example:**
```javascript
NetInfo.configure({
  reachabilityUrl: 'https://clients3.google.com/generate_204',
  reachabilityTest: async (response) => response.status === 204,
  reachabilityLongTimeout: 60 * 1000, // 60s
  reachabilityShortTimeout: 5 * 1000, // 5s
  reachabilityRequestTimeout: 15 * 1000, // 15s
  reachabilityShouldRun: () => true,
  shouldFetchWiFiSSID: true, // met iOS requirements to get SSID. Will leak memory if set to true without meeting requirements.
  useNativeReachability: false
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

A [React Hook](https://reactjs.org/docs/hooks-intro.html) which can be used to get access to the latest state from the global instance. It returns a hook with the [`NetInfoState`](README.md#netinfostate) type.

**Example:**
```jsx
import {useNetInfo} from "@react-native-community/netinfo";

const YourComponent = () => {
  const netInfo = useNetInfo();

  return (
    <View>
      <Text>Type: {netInfo.type}</Text>
      <Text>Is Connected? {netInfo.isConnected?.toString()}</Text>
    </View>
  );
};
```

You can optionally send configuration when setting up the hook. Note that configuration is global for the library, so you shouldn't send different configuration for different hooks. It is instead recommended that you called `NetInfo.configure()` once when your project starts. The hook option is only provided as a convinience.

```jsx
const YourComponent = () => {
  const netInfo = useNetInfo({
    reachabilityUrl: 'https://clients3.google.com/generate_204',
    reachabilityTest: async (response) => response.status === 204,
    reachabilityLongTimeout: 60 * 1000, // 60s
    reachabilityShortTimeout: 5 * 1000, // 5s
    reachabilityRequestTimeout: 15 * 1000, // 15s
    reachabilityShouldRun: () => true,
    shouldFetchWiFiSSID: true, // met iOS requirements to get SSID
    useNativeReachability: false
  });

  // ...
};
```

#### `fetch()`

Returns a `Promise` that resolves to a [`NetInfoState`](README.md#netinfostate) object.

**Example:**
```javascript
NetInfo.fetch().then(state => {
  console.log("Connection type", state.type);
  console.log("Is connected?", state.isConnected);
});
```

You can optionally send an `interface` string so the `Promise` resolves to a [`NetInfoState`](README.md#netinfostate) from the [`NetInfoStateType`](#netinfostatetype) indicated in `interface` argument.

```javascript
NetInfo.fetch("wifi").then(state => {
  console.log("SSID", state.details.ssid);
  console.log("BSSID", state.details.bssid);
  console.log("Is connected?", state.isConnected);
});
```

#### `refresh()`

Updates NetInfo's internal state, then returns a `Promise` that resolves to a [`NetInfoState`](#netinfostate) object. This is similar to `fetch()`, but really only useful on platforms that do not supply internet reachability natively. For example, you can use it to immediately re-run an internet reachability test if a network request fails unexpectedly.

**Example:**
```javascript
NetInfo.refresh().then(state => {
    console.log("Connection type", state.type);
    console.log("Is connected?", state.isConnected);
});
```

This will also update subscribers using `addEventListener` and/or `useNetInfo`.

### Isolated instance

Please note the difference between global and isolated usage described [here](#global-vs-isolated-instance)

#### `useNetInfoInstance()` 

A [React Hook](https://reactjs.org/docs/hooks-intro.html) which can be used to create and manage an isolated instance of a network manager class. It returns a `refresh` function and the current [`NetInfoState`](README.md#netinfostate).

**Example:**
```jsx
import { useNetInfoInstance } from "@react-native-community/netinfo";

const YourComponent = () => {
  const {netInfo, refresh} = useNetInfoInstance();

  return (
    <View>
      <Text>Type: {netInfo.type}</Text>
      <Text>Is Connected? {netInfo.isConnected?.toString()}</Text>
    </View>
  );
};
```

**isPaused**: You can also pause the hooks internal network checks by passing a boolean value `true` as the first argument.

**configuration**: You can optionally send configuration as the second argument when setting up the hook. Note that configuration is local to the instance managed by this hook and has no relation to the configuration passed to other functions `configure()` or `useNetInfo()`;

```jsx
import { useNetInfoInstance } from "@react-native-community/netinfo";

const YourComponent = () => {
  const isPaused = false;
  const config = {
    reachabilityUrl: 'https://clients3.google.com/generate_204',
    reachabilityTest: async (response) => response.status === 204,
    reachabilityLongTimeout: 60 * 1000, // 60s
    reachabilityShortTimeout: 5 * 1000, // 5s
    reachabilityRequestTimeout: 15 * 1000, // 15s
    reachabilityShouldRun: () => true,
    shouldFetchWiFiSSID: true, // met iOS requirements to get SSID
    useNativeReachability: false
  }
  
  const { netInfo } = useNetInfoInstance(isPaused, config);
  //...
```

## Troubleshooting

### Errors when building on Android

### Errors while running Jest tests

If you do not have a Jest Setup file configured, you should add the following to your Jest settings and create the `jest.setup.js` file in project root:

```js
setupFiles: ['<rootDir>/jest.setup.js']
```

You should then add the following to your Jest setup file to mock the NetInfo Native Module:

```js
import mockRNCNetInfo from '@react-native-community/netinfo/jest/netinfo-mock.js';

jest.mock('@react-native-community/netinfo', () => mockRNCNetInfo);
```

### Issues with the iOS simulator

There is a [known](http://openradar.appspot.com/14585459) [issue](http://www.openradar.appspot.com/29913522) with the iOS Simulator which causes it to not receive network change notifications correctly when the host machine disconnects and then connects to Wifi. If you are having issues with iOS then please test on an actual device before reporting any bugs.

### Switching between different Wi-Fi does not send events in iOS

The SCNetworkReachability API used in iOS does not send events to the app in the background, so switching from one Wi-Fi network to another when your App was in background will not send an event and your network state will be out of sync with device state. To be sure you have up to date status when your app is in foreground again, you should re-fetch state each time when App comes to foreground, something like this:

```js
  useEffect(() => {
    const subAppState = AppState.addEventListener("change", async (nextAppState) => {
      if (IS_IOS_DEVICE && nextAppState=='active') {
        let newNetInfo = await NativeModules.RNCNetInfo.getCurrentState('wifi');
        //your code here 
      }
    });
    const unsubNetState = NetInfo.addEventListener(state => {
        //your code here
    });
    return () => {
        if (subAppState) {
            subAppState.remove();
        }
        unsubNetState();
    };
  },[]);
```

## Maintainers

* [Mike Hardy](https://github.com/mikehardy)

### Maintainers Emeritus
  
* [Matt Oakes](https://github.com/matt-oakes) - [Freelance React Native Developer](http://mattoakes.net)
* [Mike Diarmid](https://github.com/salakar) - [Invertase](https://invertase.io)

## Contributing

Please see the [contributing guide](/CONTRIBUTING.md).

## License

The library is released under the MIT license. For more information see [`LICENSE`](/LICENSE).
