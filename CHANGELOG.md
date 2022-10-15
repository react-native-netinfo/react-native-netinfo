## [9.3.5](https://github.com/react-native-netinfo/react-native-netinfo/compare/v9.3.4...v9.3.5) (2022-10-15)


### Bug Fixes

* **windows:** fix crash in getIpAddressSync ([#631](https://github.com/react-native-netinfo/react-native-netinfo/issues/631)) ([cc3ed0f](https://github.com/react-native-netinfo/react-native-netinfo/commit/cc3ed0f))

## [9.3.4](https://github.com/react-native-netinfo/react-native-netinfo/compare/v9.3.3...v9.3.4) (2022-10-05)


### Bug Fixes

* notify subscriptions after state changes ([#630](https://github.com/react-native-netinfo/react-native-netinfo/issues/630)) ([67c88be](https://github.com/react-native-netinfo/react-native-netinfo/commit/67c88be))

## [9.3.3](https://github.com/react-native-netinfo/react-native-netinfo/compare/v9.3.2...v9.3.3) (2022-10-02)


### Bug Fixes

* **macCatalyst:** add compilation conditionals for macCatalyst ([#629](https://github.com/react-native-netinfo/react-native-netinfo/issues/629)) ([8e4cace](https://github.com/react-native-netinfo/react-native-netinfo/commit/8e4cace))

## [9.3.2](https://github.com/react-native-netinfo/react-native-netinfo/compare/v9.3.1...v9.3.2) (2022-09-25)


### Bug Fixes

* **android, vpn:** ensure downlink >= 0 for internetReachable to be true on vpn ([#624](https://github.com/react-native-netinfo/react-native-netinfo/issues/624)) ([20c2cd2](https://github.com/react-native-netinfo/react-native-netinfo/commit/20c2cd2))

## [9.3.1](https://github.com/react-native-netinfo/react-native-netinfo/compare/v9.3.0...v9.3.1) (2022-09-18)


### Bug Fixes

* **tests, mock:** allow mocking netinfostate type for testing ([#619](https://github.com/react-native-netinfo/react-native-netinfo/issues/619)) ([956bceb](https://github.com/react-native-netinfo/react-native-netinfo/commit/956bceb))

# [9.3.0](https://github.com/react-native-netinfo/react-native-netinfo/compare/v9.2.0...v9.3.0) (2022-06-28)


### Features

* add linkSpeed, rxLinkSpeed, txLinkSpeed info to wifi on android ([#605](https://github.com/react-native-netinfo/react-native-netinfo/issues/605)) ([8cad8b7](https://github.com/react-native-netinfo/react-native-netinfo/commit/8cad8b7)), closes [#604](https://github.com/react-native-netinfo/react-native-netinfo/issues/604)

# [9.2.0](https://github.com/react-native-netinfo/react-native-netinfo/compare/v9.1.0...v9.2.0) (2022-06-28)


### Features

* add support for reachabilityMethod to specify GET or HEAD ([#610](https://github.com/react-native-netinfo/react-native-netinfo/issues/610)) ([3f5badd](https://github.com/react-native-netinfo/react-native-netinfo/commit/3f5badd))

# [9.1.0](https://github.com/react-native-netinfo/react-native-netinfo/compare/v9.0.0...v9.1.0) (2022-06-24)


### Features

* add parameter useNativeReachability to optionally choose non-native reachability test ([#609](https://github.com/react-native-netinfo/react-native-netinfo/issues/609)) ([9b02cac](https://github.com/react-native-netinfo/react-native-netinfo/commit/9b02cac))

# [9.0.0](https://github.com/react-native-netinfo/react-native-netinfo/compare/v8.3.1...v9.0.0) (2022-06-03)


* fix(windows)!: change WindowsTargetPlatformVersion to 10.0 / drop arm32 / drop rnw < 0.63 (#603) ([16d6568](https://github.com/react-native-netinfo/react-native-netinfo/commit/16d6568)), closes [#603](https://github.com/react-native-netinfo/react-native-netinfo/issues/603)


### BREAKING CHANGES

* needs react-native-windows 0.63+ and MSVC build tools v142+ (Visual Studio 2019+), drop arm32

## [8.3.1](https://github.com/react-native-netinfo/react-native-netinfo/compare/v8.3.0...v8.3.1) (2022-05-30)


### Bug Fixes

* **web:** removeListeners should actually remove listeners ([#600](https://github.com/react-native-netinfo/react-native-netinfo/issues/600)) ([60e9e38](https://github.com/react-native-netinfo/react-native-netinfo/commit/60e9e38))

# [8.3.0](https://github.com/react-native-netinfo/react-native-netinfo/compare/v8.2.0...v8.3.0) (2022-04-22)


### Features

* add imperative api to refresh state ([#594](https://github.com/react-native-netinfo/react-native-netinfo/issues/594)) ([1d7b751](https://github.com/react-native-netinfo/react-native-netinfo/commit/1d7b751))

# [8.2.0](https://github.com/react-native-netinfo/react-native-netinfo/compare/v8.1.0...v8.2.0) (2022-03-18)


### Features

* **android:** add ethernet information ([#584](https://github.com/react-native-netinfo/react-native-netinfo/issues/584)) ([2b3a8e2](https://github.com/react-native-netinfo/react-native-netinfo/commit/2b3a8e2))

# [8.1.0](https://github.com/react-native-netinfo/react-native-netinfo/compare/v8.0.0...v8.1.0) (2022-03-02)


### Features

* **windows, ip-address:** add ipAddress info to windows details ([#581](https://github.com/react-native-netinfo/react-native-netinfo/issues/581)) ([11f3e3b](https://github.com/react-native-netinfo/react-native-netinfo/commit/11f3e3b))

# [8.0.0](https://github.com/react-native-netinfo/react-native-netinfo/compare/v7.1.12...v8.0.0) (2022-02-10)


* fix(CHANGELOG)!: note that v7.1.12 is breaking if you have wifi SSID permission (#574) ([99072e0](https://github.com/react-native-netinfo/react-native-netinfo/commit/99072e0)), closes [#574](https://github.com/react-native-netinfo/react-native-netinfo/issues/574)


### BREAKING CHANGES

* it's possible this is a breaking change, depending on your app use case. If you relied on iOS SSID information and met [Apple's strict criteria for accessing SSID](https://developer.apple.com/documentation/systemconfiguration/1614126-cncopycurrentnetworkinfo?language=objc#discussion), you need to set the new config value `shouldFetchWiFiSSID` to true. If you set it to true and do not meet the criteria your app may crash due to a memory leak. All versions prior to 7.1.12 would attempt to fetch the information regardless of permission, leak memory, and possibly crash. This change avoids that crash.

## [7.1.12](https://github.com/react-native-netinfo/react-native-netinfo/compare/v7.1.11...v7.1.12) (2022-02-09)

**BREAKING CHANGE NOTICE** - it's possible this is a breaking change, depending on your app use case. If you relied on iOS SSID information and met [Apple's strict criteria for accessing SSID](https://developer.apple.com/documentation/systemconfiguration/1614126-cncopycurrentnetworkinfo?language=objc#discussion), you need to set the new config value `shouldFetchWiFiSSID` to true. If you set it to true and do not meet the criteria your app may crash due to a memory leak. All versions prior to 7.1.12 would attempt to fetch the information regardless of permission, leak memory, and possible crash. This change avoids that crash.

### Bug Fixes

* **ios:** avoid memory leak from ssid APIs by adding explicit config ([#560](https://github.com/react-native-netinfo/react-native-netinfo/issues/560)) ([fbf7c15](https://github.com/react-native-netinfo/react-native-netinfo/commit/fbf7c15)), closes [#420](https://github.com/react-native-netinfo/react-native-netinfo/issues/420)

## [7.1.11](https://github.com/react-native-netinfo/react-native-netinfo/compare/v7.1.10...v7.1.11) (2022-02-08)


### Bug Fixes

* **windows:** fix race condition in WiFi connection details feature ([#568](https://github.com/react-native-netinfo/react-native-netinfo/issues/568)) ([0cd8132](https://github.com/react-native-netinfo/react-native-netinfo/commit/0cd8132))

## [7.1.10](https://github.com/react-native-netinfo/react-native-netinfo/compare/v7.1.9...v7.1.10) (2022-02-07)


### Bug Fixes

* **android:** use registerDefaultNetworkCallback so toggling airplane mode works ([#571](https://github.com/react-native-netinfo/react-native-netinfo/issues/571)) ([e8af2de](https://github.com/react-native-netinfo/react-native-netinfo/commit/e8af2de))

## [7.1.9](https://github.com/react-native-netinfo/react-native-netinfo/compare/v7.1.8...v7.1.9) (2022-01-26)


### Bug Fixes

* **android:** count native listeners / correctly disable listener if count == 0 ([#569](https://github.com/react-native-netinfo/react-native-netinfo/issues/569)) ([5ae16f6](https://github.com/react-native-netinfo/react-native-netinfo/commit/5ae16f6))

## [7.1.8](https://github.com/react-native-netinfo/react-native-netinfo/compare/v7.1.7...v7.1.8) (2022-01-25)


### Bug Fixes

* **windows:** refactor implementation to avoid crashes ([#564](https://github.com/react-native-netinfo/react-native-netinfo/issues/564)) ([cc4bfa3](https://github.com/react-native-netinfo/react-native-netinfo/commit/cc4bfa3))

## [7.1.7](https://github.com/react-native-netinfo/react-native-netinfo/compare/v7.1.6...v7.1.7) (2021-12-20)


### Bug Fixes

* **android:** populate network value during initial module startup  ([#553](https://github.com/react-native-netinfo/react-native-netinfo/issues/553)) ([c05080f](https://github.com/react-native-netinfo/react-native-netinfo/commit/c05080f))

## [7.1.6](https://github.com/react-native-netinfo/react-native-netinfo/compare/v7.1.5...v7.1.6) (2021-12-13)


### Bug Fixes

* **android:** avoid send event when has no listener ([#548](https://github.com/react-native-netinfo/react-native-netinfo/issues/548)) ([cad47d8](https://github.com/react-native-netinfo/react-native-netinfo/commit/cad47d8))

## [7.1.5](https://github.com/react-native-netinfo/react-native-netinfo/compare/v7.1.4...v7.1.5) (2021-12-09)


### Bug Fixes

* **android:** use method-local ref to instance var for multi-thread safety [#549](https://github.com/react-native-netinfo/react-native-netinfo/issues/549) ([#550](https://github.com/react-native-netinfo/react-native-netinfo/issues/550)) ([81bbc87](https://github.com/react-native-netinfo/react-native-netinfo/commit/81bbc87))

## [7.1.4](https://github.com/react-native-netinfo/react-native-netinfo/compare/v7.1.3...v7.1.4) (2021-12-07)


### Bug Fixes

* **android:** try async state fetch as stale state workaround ([#547](https://github.com/react-native-netinfo/react-native-netinfo/issues/547)) ([937cf48](https://github.com/react-native-netinfo/react-native-netinfo/commit/937cf48)), closes [#542](https://github.com/react-native-netinfo/react-native-netinfo/issues/542)

## [7.1.3](https://github.com/react-native-netinfo/react-native-netinfo/compare/v7.1.2...v7.1.3) (2021-11-29)


### Bug Fixes

* **web, isConnected:** Return actual connection state even if network type is 'unknown' ([#544](https://github.com/react-native-netinfo/react-native-netinfo/issues/544)) ([36d6dc9](https://github.com/react-native-netinfo/react-native-netinfo/commit/36d6dc9))

## [7.1.2](https://github.com/react-native-netinfo/react-native-netinfo/compare/v7.1.1...v7.1.2) (2021-11-17)


### Bug Fixes

* **jest, mock:** addEventListener returns a function to match API ([#529](https://github.com/react-native-netinfo/react-native-netinfo/issues/529)) ([82ca2ad](https://github.com/react-native-netinfo/react-native-netinfo/commit/82ca2ad))

## [7.1.1](https://github.com/react-native-netinfo/react-native-netinfo/compare/v7.1.0...v7.1.1) (2021-11-17)


### Bug Fixes

* **ios, 5g:** do not use 5g symbols until iOS14.1 ([#525](https://github.com/react-native-netinfo/react-native-netinfo/issues/525)) ([932cd83](https://github.com/react-native-netinfo/react-native-netinfo/commit/932cd83))

# [7.1.0](https://github.com/react-native-netinfo/react-native-netinfo/compare/v7.0.0...v7.1.0) (2021-11-17)


### Features

* **android, native:** make native API public for mixed-native use ([#524](https://github.com/react-native-netinfo/react-native-netinfo/issues/524)) ([96b8d2f](https://github.com/react-native-netinfo/react-native-netinfo/commit/96b8d2f))

# [7.0.0](https://github.com/react-native-netinfo/react-native-netinfo/compare/v6.2.1...v7.0.0) (2021-11-16)


* fix(windows)!: Fix autolinking and remove legacy projects (#521) ([45628d8](https://github.com/react-native-netinfo/react-native-netinfo/commit/45628d8)), closes [#521](https://github.com/react-native-netinfo/react-native-netinfo/issues/521)


### BREAKING CHANGES

* Drop support for react-native-windows 0.61 and lower. Update to RNW 0.62 or higher

## [6.2.1](https://github.com/react-native-netinfo/react-native-netinfo/compare/v6.2.0...v6.2.1) (2021-11-15)


### Bug Fixes

* **android:** fix for outdated network states ([#510](https://github.com/react-native-netinfo/react-native-netinfo/issues/510)) ([d5f06ba](https://github.com/react-native-netinfo/react-native-netinfo/commit/d5f06ba))

# [6.2.0](https://github.com/react-native-netinfo/react-native-netinfo/compare/v6.1.1...v6.2.0) (2021-11-13)


### Features

* Add 5g cellular type ([#436](https://github.com/react-native-netinfo/react-native-netinfo/issues/436)) ([6ba68e9](https://github.com/react-native-netinfo/react-native-netinfo/commit/6ba68e9))

## [6.1.1](https://github.com/react-native-netinfo/react-native-netinfo/compare/v6.1.0...v6.1.1) (2021-11-13)


### Bug Fixes

* **android:** declare java 1.8 feature usage so assembleInstrumentedTest builds work ([#466](https://github.com/react-native-netinfo/react-native-netinfo/issues/466)) ([48d4364](https://github.com/react-native-netinfo/react-native-netinfo/commit/48d4364))

# [6.1.0](https://github.com/react-native-netinfo/react-native-netinfo/compare/v6.0.6...v6.1.0) (2021-11-07)


### Features

* reachability test may be enabled/disabled via user-supplied function ([#513](https://github.com/react-native-netinfo/react-native-netinfo/issues/513)) ([83c1e0d](https://github.com/react-native-netinfo/react-native-netinfo/commit/83c1e0d))

## [6.0.6](https://github.com/react-native-netinfo/react-native-netinfo/compare/v6.0.5...v6.0.6) (2021-11-04)


### Bug Fixes

* **windows, crash:** try/catch fetching network profile, new windows example app ([#511](https://github.com/react-native-netinfo/react-native-netinfo/issues/511)) ([ef3ac76](https://github.com/react-native-netinfo/react-native-netinfo/commit/ef3ac76)), closes [#454](https://github.com/react-native-netinfo/react-native-netinfo/issues/454)

## [6.0.5](https://github.com/react-native-netinfo/react-native-netinfo/compare/v6.0.4...v6.0.5) (2021-11-03)


### Bug Fixes

* **jest:** mock return value not resolve value for useNetInfo mock ([#515](https://github.com/react-native-netinfo/react-native-netinfo/issues/515)) ([cfde0aa](https://github.com/react-native-netinfo/react-native-netinfo/commit/cfde0aa))

## [6.0.4](https://github.com/react-native-netinfo/react-native-netinfo/compare/v6.0.3...v6.0.4) (2021-10-22)


### Bug Fixes

* **android:** use ConnectivityManager directly, drop androidx dependency ([#509](https://github.com/react-native-netinfo/react-native-netinfo/issues/509)) ([2569f56](https://github.com/react-native-netinfo/react-native-netinfo/commit/2569f56))

## [6.0.3](https://github.com/react-native-netinfo/react-native-netinfo/compare/v6.0.2...v6.0.3) (2021-10-22)


### Bug Fixes

* **android, jcenter:** remove jcenter dependency / update example ([#500](https://github.com/react-native-netinfo/react-native-netinfo/issues/500)) ([94c5398](https://github.com/react-native-netinfo/react-native-netinfo/commit/94c5398))

## [6.0.2](https://github.com/react-native-netinfo/react-native-netinfo/compare/v6.0.1...v6.0.2) (2021-09-03)


### Bug Fixes

* **ios:** remove iOS listener stubs added for RN0.65 compat, they caused a regression ([#493](https://github.com/react-native-netinfo/react-native-netinfo/issues/493)) ([a52b0a5](https://github.com/react-native-netinfo/react-native-netinfo/commit/a52b0a5))

## [6.0.1](https://github.com/react-native-netinfo/react-native-netinfo/compare/v6.0.0...v6.0.1) (2021-08-24)


### Bug Fixes

* Ensure warnings are not shown on React Native 0.65 ([#487](https://github.com/react-native-netinfo/react-native-netinfo/issues/487) by [@lubomyr](https://github.com/lubomyr)) ([ac0ed65](https://github.com/react-native-netinfo/react-native-netinfo/commit/ac0ed65))
* **android:** isConnected is incorrect for wifi networks only the app has access to ([#443](https://github.com/react-native-netinfo/react-native-netinfo/issues/443) by [@eliaslecomte](https://github.com/eliaslecomte)) ([7084771](https://github.com/react-native-netinfo/react-native-netinfo/commit/7084771))

# [6.0.0](https://github.com/react-native-netinfo/react-native-netinfo/compare/v5.9.10...v6.0.0) (2021-02-19)


### feature

* **useNetinfo:** return null for initial unknown connection state ([#444](https://github.com/react-native-netinfo/react-native-netinfo/issues/444) by [@lisabaut](https://github.com/lisabaut)) ([4d84f14](https://github.com/react-native-netinfo/react-native-netinfo/commit/4d84f14)), closes [#295](https://github.com/react-native-netinfo/react-native-netinfo/issues/295)


### BREAKING CHANGES

* **useNetinfo:** When the connection state is unknown, the `isConnected` and `isInternetReachable` properties are now set to `null` rather than `false`. This allow you to easily detect the initial "unknown" state before the state is detected and set to a `boolean`.

## [5.9.10](https://github.com/react-native-community/react-native-netinfo/compare/v5.9.9...v5.9.10) (2021-01-06)


### Bug Fixes

* **ios,tvos:** Remove IPv4-only paths to prevent App Store warnings ([#431](https://github.com/react-native-community/react-native-netinfo/issues/431) by @ greenantdotcom ) ([1db98cb](https://github.com/react-native-community/react-native-netinfo/commit/1db98cb))

## [5.9.9](https://github.com/react-native-community/react-native-netinfo/compare/v5.9.8...v5.9.9) (2020-11-23)


### Bug Fixes

* **ios:** Support Mac Catalyst ([#415](https://github.com/react-native-community/react-native-netinfo/issues/415) by [@kyle-ssg](https://github.com/kyle-ssg)) ([5771efb](https://github.com/react-native-community/react-native-netinfo/commit/5771efb))

## [5.9.8](https://github.com/react-native-community/react-native-netinfo/compare/v5.9.7...v5.9.8) (2020-11-23)


### Bug Fixes

* **windows:** Resolve Missing Deploy Target ([#426](https://github.com/react-native-community/react-native-netinfo/issues/426) by [@chiaramooney](https://github.com/chiaramooney)) ([b43a3e4](https://github.com/react-native-community/react-native-netinfo/commit/b43a3e4))

## [5.9.7](https://github.com/react-native-community/react-native-netinfo/compare/v5.9.6...v5.9.7) (2020-09-18)


### Bug Fixes

* **ios:** depend directly on React-Core in podspec for Xcode 12 compatibility ([#409](https://github.com/react-native-community/react-native-netinfo/issues/409)) ([bcf8bf9](https://github.com/react-native-community/react-native-netinfo/commit/bcf8bf9))

## [5.9.6](https://github.com/react-native-community/react-native-netinfo/compare/v5.9.5...v5.9.6) (2020-08-10)


### Bug Fixes

* **android:** Add missing isWifiEnabled type definition ([#396](https://github.com/react-native-community/react-native-netinfo/issues/396) by @TimRobinson1) ([76d8db5](https://github.com/react-native-community/react-native-netinfo/commit/76d8db5))

## [5.9.5](https://github.com/react-native-community/react-native-netinfo/compare/v5.9.4...v5.9.5) (2020-07-16)


### Bug Fixes

* Added missing bssid type definition to Typescript ([#370](https://github.com/react-native-community/react-native-netinfo/issues/370) by [@organom](https://github.com/organom)) ([72ef6cd](https://github.com/react-native-community/react-native-netinfo/commit/72ef6cd))

## [5.9.4](https://github.com/react-native-community/react-native-netinfo/compare/v5.9.3...v5.9.4) (2020-06-25)


### Bug Fixes

* **android:** Add another check in ConnectivityReciever to make sure we have ACCESS_WIFI_STATE permission ([#379](https://github.com/react-native-community/react-native-netinfo/issues/379) by [@sweggersen](https://github.com/sweggersen)) ([b0ff1ff](https://github.com/react-native-community/react-native-netinfo/commit/b0ff1ff))

## [5.9.3](https://github.com/react-native-community/react-native-netinfo/compare/v5.9.2...v5.9.3) (2020-06-19)


### Bug Fixes

* added strength wifi property to typescript ([#377](https://github.com/react-native-community/react-native-netinfo/issues/377)) ([e8cb4d3](https://github.com/react-native-community/react-native-netinfo/commit/e8cb4d3))

## [5.9.2](https://github.com/react-native-community/react-native-netinfo/compare/v5.9.1...v5.9.2) (2020-05-26)


### Bug Fixes

* **Android:** Do not use getFrequency method for Android lower than LOLLIPOP ([#367](https://github.com/react-native-community/react-native-netinfo/issues/367) by @ObidosDev) ([4957aaa](https://github.com/react-native-community/react-native-netinfo/commit/4957aaa))

## [5.9.1](https://github.com/react-native-community/react-native-netinfo/compare/v5.9.0...v5.9.1) (2020-05-24)


### Bug Fixes

* **macOS:** Ensure Cocoapods installation works on macOS ([#366](https://github.com/react-native-community/react-native-netinfo/issues/366) by @Simek) ([c8b280c](https://github.com/react-native-community/react-native-netinfo/commit/c8b280c))

# [5.9.0](https://github.com/react-native-community/react-native-netinfo/compare/v5.8.1...v5.9.0) (2020-05-18)


### Features

* **android:** Add BSSID WIFI type ([#361](https://github.com/react-native-community/react-native-netinfo/issues/361) by  [@organom](https://github.com/organom)) ([b99e1d6](https://github.com/react-native-community/react-native-netinfo/commit/b99e1d6))
* **android:** Add WiFi frequency value ([#362](https://github.com/react-native-community/react-native-netinfo/issues/362) by [@kulyk](https://github.com/kulyk)) ([6d95244](https://github.com/react-native-community/react-native-netinfo/commit/6d95244))

## [5.8.1](https://github.com/react-native-community/react-native-netinfo/compare/v5.8.0...v5.8.1) (2020-05-11)


### Bug Fixes

* **android:** Avoid unneccesary downoads of Gradle plugins ([#358](https://github.com/react-native-community/react-native-netinfo/issues/358) by @SaeedZhiany) ([8479319](https://github.com/react-native-community/react-native-netinfo/commit/8479319))

# [5.8.0](https://github.com/react-native-community/react-native-netinfo/compare/v5.7.1...v5.8.0) (2020-04-22)


### Features

* **windows:** Add C++/WinRT Implementation to support the latest react-native-windows ([#349](https://github.com/react-native-community/react-native-netinfo/issues/349) by [@kaiguo](https://github.com/kaiguo)) ([18e2f20](https://github.com/react-native-community/react-native-netinfo/commit/18e2f20))

## [5.7.1](https://github.com/react-native-community/react-native-netinfo/compare/v5.7.0...v5.7.1) (2020-04-14)


### Bug Fixes

* Fix the provided Jest mock so it works with the instructions in the README ([a24ebb1](https://github.com/react-native-community/react-native-netinfo/commit/a24ebb1)), closes [#345](https://github.com/react-native-community/react-native-netinfo/issues/345) [#327](https://github.com/react-native-community/react-native-netinfo/issues/327)

# [5.7.0](https://github.com/react-native-community/react-native-netinfo/compare/v5.6.2...v5.7.0) (2020-03-30)


### Bug Fixes

* **macos:** Ensure macOS files are included in the NPM package ([#335](https://github.com/react-native-community/react-native-netinfo/issues/335) by [@matt-oakes](https://github.com/matt-oakes)) ([742c79a](https://github.com/react-native-community/react-native-netinfo/commit/742c79a))


### Features

* **android:** Make the ACCESS_WIFI_STATE permission optional ([#328](https://github.com/react-native-community/react-native-netinfo/issues/328) by [@sweggersen](https://github.com/sweggersen)) ([ba16e0a](https://github.com/react-native-community/react-native-netinfo/commit/ba16e0a))

## [5.6.2](https://github.com/react-native-community/react-native-netinfo/compare/v5.6.1...v5.6.2) (2020-03-11)


### Bug Fixes

* **web:** Ensure the default timeouts are correct ([#322](https://github.com/react-native-community/react-native-netinfo/issues/322) by [@ifsnow](https://github.com/ifsnow)) ([20f0ecd](https://github.com/react-native-community/react-native-netinfo/commit/20f0ecd))

## [5.6.1](https://github.com/react-native-community/react-native-netinfo/compare/v5.6.0...v5.6.1) (2020-03-10)


### Bug Fixes

* Ensure the default timeouts are the correct way around ([4e3e981](https://github.com/react-native-community/react-native-netinfo/commit/4e3e981))

# [5.6.0](https://github.com/react-native-community/react-native-netinfo/compare/v5.5.1...v5.6.0) (2020-03-10)


### Features

* **macos:** Add in a macOS implementation of NetInfo ([#312](https://github.com/react-native-community/react-native-netinfo/issues/312) by [@tom-un](https://github.com/tom-un)) ([b0ad866](https://github.com/react-native-community/react-native-netinfo/commit/b0ad866))

## [5.5.1](https://github.com/react-native-community/react-native-netinfo/compare/v5.5.0...v5.5.1) (2020-02-23)


### Bug Fixes

* Remove use of `Promise.prototype.finally` to prevent possible compatibility issues ([#311](https://github.com/react-native-community/react-native-netinfo/issues/311) by [@davidstritzl](https://github.com/davidstritzl)) ([c0e6f62](https://github.com/react-native-community/react-native-netinfo/commit/c0e6f62))

# [5.5.0](https://github.com/react-native-community/react-native-netinfo/compare/v5.4.0...v5.5.0) (2020-02-12)


### Features

* Add React Native Web support ([#292](https://github.com/react-native-community/react-native-netinfo/issues/292) by [@jaulz](https://github.com/jaulz)) ([5ce329b](https://github.com/react-native-community/react-native-netinfo/commit/5ce329b))

# [5.4.0](https://github.com/react-native-community/react-native-netinfo/compare/v5.3.4...v5.4.0) (2020-02-12)


### Features

* Add reachability request timeout to improve handling of bad network connections ([#302](https://github.com/react-native-community/react-native-netinfo/issues/302) by [@davidstritzl](https://github.com/davidstritzl)) ([9eb1531](https://github.com/react-native-community/react-native-netinfo/commit/9eb1531))

## [5.3.4](https://github.com/react-native-community/react-native-netinfo/compare/v5.3.3...v5.3.4) (2020-02-12)


### Bug Fixes

* Correct reachability timeouts in default configuration ([#301](https://github.com/react-native-community/react-native-netinfo/issues/301) by [@davidstritzl](https://github.com/davidstritzl)) ([f74b8cc](https://github.com/react-native-community/react-native-netinfo/commit/f74b8cc))

## [5.3.3](https://github.com/react-native-community/react-native-netinfo/compare/v5.3.2...v5.3.3) (2020-01-15)


### Bug Fixes

* **android:** Handle invalid networks in network listener ([#286](https://github.com/react-native-community/react-native-netinfo/issues/286)) ([a153240](https://github.com/react-native-community/react-native-netinfo/commit/a153240))

## [5.3.2](https://github.com/react-native-community/react-native-netinfo/compare/v5.3.1...v5.3.2) (2020-01-06)


### Bug Fixes

* **tvOS:** Fixed a crash with tvOS builds caused by trying to use the ssid method ([#283](https://github.com/react-native-community/react-native-netinfo/issues/283) by [@vdmtrv](https://github.com/vdmtrv)) ([a0191e0](https://github.com/react-native-community/react-native-netinfo/commit/a0191e0))

## [5.3.1](https://github.com/react-native-community/react-native-netinfo/compare/v5.3.0...v5.3.1) (2020-01-04)


### Bug Fixes

* **android:** Remove the Android native tests to avoid issues ([d9fdf85](https://github.com/react-native-community/react-native-netinfo/commit/d9fdf85)), closes [#276](https://github.com/react-native-community/react-native-netinfo/issues/276)

# [5.3.0](https://github.com/react-native-community/react-native-netinfo/compare/v5.2.0...v5.3.0) (2020-01-04)


### Features

* Export a mock to make Jest testing easier ([#275](https://github.com/react-native-community/react-native-netinfo/issues/275) by @Naturalclar) ([68bba0a](https://github.com/react-native-community/react-native-netinfo/commit/68bba0a))

# [5.2.0](https://github.com/react-native-community/react-native-netinfo/compare/v5.1.0...v5.2.0) (2019-12-29)


### Features

* Allow fetching details for a specific network interface ([#256](https://github.com/react-native-community/react-native-netinfo/issues/256) by @Rapsssito) ([05e5fb7](https://github.com/react-native-community/react-native-netinfo/commit/05e5fb7))

# [5.1.0](https://github.com/react-native-community/react-native-netinfo/compare/v5.0.2...v5.1.0) (2019-12-29)


### Features

* **Android:** Add information about whether Wifi is enabled ([#255](https://github.com/react-native-community/react-native-netinfo/issues/255) by [@gabrielrra](https://github.com/gabrielrra)) ([1006966](https://github.com/react-native-community/react-native-netinfo/commit/1006966))

## [5.0.2](https://github.com/react-native-community/react-native-netinfo/compare/v5.0.1...v5.0.2) (2019-12-29)


### Bug Fixes

* **android:** Fixed connection change bug on Android ([#265](https://github.com/react-native-community/react-native-netinfo/issues/265) by @QuickBase) ([8748242](https://github.com/react-native-community/react-native-netinfo/commit/8748242))

## [5.0.1](https://github.com/react-native-community/react-native-netinfo/compare/v5.0.0...v5.0.1) (2019-12-20)


### Bug Fixes

* Ensure passing no configuration to the hook works correctly ([#264](https://github.com/react-native-community/react-native-netinfo/issues/264) by [@lonnylot](https://github.com/lonnylot)) ([e3fc1b4](https://github.com/react-native-community/react-native-netinfo/commit/e3fc1b4)), closes [#262](https://github.com/react-native-community/react-native-netinfo/issues/262)

# [5.0.0](https://github.com/react-native-community/react-native-netinfo/compare/v4.7.0...v5.0.0) (2019-12-08)


### Features

* Configuration & removal of deprecated methods ([#230](https://github.com/react-native-community/react-native-netinfo/issues/230)) ([fab577d](https://github.com/react-native-community/react-native-netinfo/commit/fab577d))


### BREAKING CHANGES

* Previously deprecated methods have been removed. These methods have been deprecated since this library was extracted from the core of React Native. Most users will not have any issues with migrating if they were not ignoring the previous warnings.

Added a new way to configure the reachability URL that the library uses on iOS to check for an internet connection. The default is still to use the Google Chrome URL, however, you can now customise this URL, test function, and the timeouts that are used.

# [4.7.0](https://github.com/react-native-community/react-native-netinfo/compare/v4.6.2...v4.7.0) (2019-12-08)


### Bug Fixes

* **Android:** Allow using androidXCore together with supportLibVersion ([#247](https://github.com/react-native-community/react-native-netinfo/issues/247) by [@euharrison](https://github.com/euharrison)) ([37366ee](https://github.com/react-native-community/react-native-netinfo/commit/37366ee))


### Features

* **fireOS:** Add ability to detect network reachability on FireOS devices ([#250](https://github.com/react-native-community/react-native-netinfo/issues/250) by [@fxdemolisher](https://github.com/fxdemolisher)) ([5ae653f](https://github.com/react-native-community/react-native-netinfo/commit/5ae653f))

## [4.6.2](https://github.com/react-native-community/react-native-netinfo/compare/v4.6.1...v4.6.2) (2019-12-08)


### Bug Fixes

* **tvOS:** Ensure the libraries compiles for tvOS ([#259](https://github.com/react-native-community/react-native-netinfo/issues/259) by [@bcontrol](https://github.com/bcontrol)) ([aa0aff8](https://github.com/react-native-community/react-native-netinfo/commit/aa0aff8))

## [4.6.1](https://github.com/react-native-community/react-native-netinfo/compare/v4.6.0...v4.6.1) (2019-11-17)


### Bug Fixes

* Remove Android Spotless formatter to avoid issues with resolving plugins ([1c2de77](https://github.com/react-native-community/react-native-netinfo/commit/1c2de77)), closes [#243](https://github.com/react-native-community/react-native-netinfo/issues/243) [#213](https://github.com/react-native-community/react-native-netinfo/issues/213)

# [4.6.0](https://github.com/react-native-community/react-native-netinfo/compare/v4.5.0...v4.6.0) (2019-11-03)


### Features

* iOS SSID to WiFi details ([#210](https://github.com/react-native-community/react-native-netinfo/issues/210)) ([119b372](https://github.com/react-native-community/react-native-netinfo/commit/119b372))

# [4.5.0](https://github.com/react-native-community/react-native-netinfo/compare/v4.4.0...v4.5.0) (2019-11-03)


### Features

* **ios:** Report IP address and subnet for ethernet ([#233](https://github.com/react-native-community/react-native-netinfo/issues/233) by [@gcesarmza](https://github.com/gcesarmza)) ([507b731](https://github.com/react-native-community/react-native-netinfo/commit/507b731))

# [4.4.0](https://github.com/react-native-community/react-native-netinfo/compare/v4.3.3...v4.4.0) (2019-10-06)


### Features

* **iOS:** Detect Apple TV wired connection and retrieve the Wifi IP address & subnet ([#229](https://github.com/react-native-community/react-native-netinfo/issues/229) by [@gcesarmza](https://github.com/gcesarmza)) ([2d2d167](https://github.com/react-native-community/react-native-netinfo/commit/2d2d167))

## [4.3.3](https://github.com/react-native-community/react-native-netinfo/compare/v4.3.2...v4.3.3) (2019-10-04)


### Bug Fixes

* **Android:** Fix build.gradle react-native dependency version ([#218](https://github.com/react-native-community/react-native-netinfo/issues/218) by [@friederbluemle](https://github.com/friederbluemle)) ([1bfb425](https://github.com/react-native-community/react-native-netinfo/commit/1bfb425))

## [4.3.2](https://github.com/react-native-community/react-native-netinfo/compare/v4.3.1...v4.3.2) (2019-10-04)


### Bug Fixes

* **iOS:** Method definition for 'dictionaryValue' not found ([#224](https://github.com/react-native-community/react-native-netinfo/issues/224)) ([a5f227c](https://github.com/react-native-community/react-native-netinfo/commit/a5f227c))

## [4.3.1](https://github.com/react-native-community/react-native-netinfo/compare/v4.3.0...v4.3.1) (2019-10-03)


### Bug Fixes

* **iOS:** Crash caused by trace condition when releasing resources ([#209](https://github.com/react-native-community/react-native-netinfo/issues/209) by [@tido64](https://github.com/tido64)) ([b43838f](https://github.com/react-native-community/react-native-netinfo/commit/b43838f))

# [4.3.0](https://github.com/react-native-community/react-native-netinfo/compare/v4.2.2...v4.3.0) (2019-09-30)


### Features

* Added 'subnet' to wifi details ([#205](https://github.com/react-native-community/react-native-netinfo/issues/205) by @Rapsssito) ([2912a76](https://github.com/react-native-community/react-native-netinfo/commit/2912a76))

## [4.2.2](https://github.com/react-native-community/react-native-netinfo/compare/v4.2.1...v4.2.2) (2019-09-19)


### Bug Fixes

* **Android:** Add gradle backward-compatibility with AndroidX ([#192](https://github.com/react-native-community/react-native-netinfo/issues/192)) ([6514f0b](https://github.com/react-native-community/react-native-netinfo/commit/6514f0b))

## [4.2.1](https://github.com/react-native-community/react-native-netinfo/compare/v4.2.0...v4.2.1) (2019-09-07)


### Bug Fixes

* **tvOS:** Do not import CoreTelephony on tvOS ([#195](https://github.com/react-native-community/react-native-netinfo/issues/195)) ([3fe3c6f](https://github.com/react-native-community/react-native-netinfo/commit/3fe3c6f))

# [4.2.0](https://github.com/react-native-community/react-native-netinfo/compare/v4.1.5...v4.2.0) (2019-09-03)


### Features

* Add additional details for cellular and wifi connections ([#122](https://github.com/react-native-community/react-native-netinfo/issues/122) by [@gretzky](https://github.com/gretzky)) ([0aa2486](https://github.com/react-native-community/react-native-netinfo/commit/0aa2486))

## [4.1.5](https://github.com/react-native-community/react-native-netinfo/compare/v4.1.4...v4.1.5) (2019-08-17)


### Bug Fixes

* Do not include examples in the NPM package ([#179](https://github.com/react-native-community/react-native-netinfo/issues/179)) ([c8c26cc](https://github.com/react-native-community/react-native-netinfo/commit/c8c26cc))

## [4.1.4](https://github.com/react-native-community/react-native-netinfo/compare/v4.1.3...v4.1.4) (2019-08-06)


### Bug Fixes

* **iOS:** correct tag so CocoaPods can clone the repo ([#167](https://github.com/react-native-community/react-native-netinfo/issues/167) by [@tido64](https://github.com/tido64)) ([e55aa57](https://github.com/react-native-community/react-native-netinfo/commit/e55aa57))

## [4.1.3](https://github.com/react-native-community/react-native-netinfo/compare/v4.1.2...v4.1.3) (2019-07-21)


### Bug Fixes

* **tvOS:** Add tvOS to podspec supported platforms ([#148](https://github.com/react-native-community/react-native-netinfo/issues/148) by [@adamkoch](https://github.com/adamkoch)) ([b33ecb6](https://github.com/react-native-community/react-native-netinfo/commit/b33ecb6))

## [4.1.2](https://github.com/react-native-community/react-native-netinfo/compare/v4.1.1...v4.1.2) (2019-07-19)


### Bug Fixes

* **iOS:** Ensure IPv6 networks work correctly ([#146](https://github.com/react-native-community/react-native-netinfo/issues/146) by [@enahum](https://github.com/enahum)) ([f4e3378](https://github.com/react-native-community/react-native-netinfo/commit/f4e3378))

## [4.1.1](https://github.com/react-native-community/react-native-netinfo/compare/v4.1.0...v4.1.1) (2019-07-15)


### Bug Fixes

* **Android:** Add a null check for mCellularGeneration to avoid a crash ([#143](https://github.com/react-native-community/react-native-netinfo/issues/143) by [@matt-oakes](https://github.com/matt-oakes)) ([097244e](https://github.com/react-native-community/react-native-netinfo/commit/097244e))

# [4.1.0](https://github.com/react-native-community/react-native-netinfo/compare/v4.0.0...v4.1.0) (2019-07-13)


### Features

* Add support for internet reachability detection ([#116](https://github.com/react-native-community/react-native-netinfo/issues/116) by [@matt-oakes](https://github.com/matt-oakes)) ([6c03502](https://github.com/react-native-community/react-native-netinfo/commit/6c03502))

# [4.0.0](https://github.com/react-native-community/react-native-netinfo/compare/v3.2.1...v4.0.0) (2019-07-06)


### Features

* **android:** Migrate to Android X ([#131](https://github.com/react-native-community/react-native-netinfo/issues/131) by [@thedeepanshujain](https://github.com/thedeepanshujain)) ([7994bc7](https://github.com/react-native-community/react-native-netinfo/commit/7994bc7))


### BREAKING CHANGES

* **android:** You are required to only use either the Support Library or AndroidX for your dependencies. If you need to migrate this library back to the support library, or another library forward to AndroidX, then take a look at the [Jetifier tool](https://github.com/mikehardy/jetifier).

## [3.2.1](https://github.com/react-native-community/react-native-netinfo/compare/v3.2.0...v3.2.1) (2019-06-01)


### Bug Fixes

* Update iOS deployment target min to avoid a warning ([#112](https://github.com/react-native-community/react-native-netinfo/issues/112) by [@mikehardy](https://github.com/mikehardy)) ([c05df9b](https://github.com/react-native-community/react-native-netinfo/commit/c05df9b))

# [3.2.0](https://github.com/react-native-community/react-native-netinfo/compare/v3.1.3...v3.2.0) (2019-05-26)


### Features

* Add Windows support ([#103](https://github.com/react-native-community/react-native-netinfo/issues/103) by [@sbeca](https://github.com/sbeca)) ([cf0fb8f](https://github.com/react-native-community/react-native-netinfo/commit/cf0fb8f))

## [3.1.3](https://github.com/react-native-community/react-native-netinfo/compare/v3.1.2...v3.1.3) (2019-05-24)


### Bug Fixes

* **types:** generates index.d.ts instead of using index.ts directly so skipLibs works correctly ([#105](https://github.com/react-native-community/react-native-netinfo/issues/105)) ([d733b5b](https://github.com/react-native-community/react-native-netinfo/commit/d733b5b))

## [3.1.2](https://github.com/react-native-community/react-native-netinfo/compare/v3.1.1...v3.1.2) (2019-05-24)


### Bug Fixes

* Do not require es6 or downlevel-iterators TS flag ([#104](https://github.com/react-native-community/react-native-netinfo/issues/104)) ([f91cdd3](https://github.com/react-native-community/react-native-netinfo/commit/f91cdd3))

## [3.1.1](https://github.com/react-native-community/react-native-netinfo/compare/v3.1.0...v3.1.1) (2019-05-24)


### Bug Fixes

* Add instructions for integrating with Jest unit tests ([#94](https://github.com/react-native-community/react-native-netinfo/issues/94)) ([3bfdd45](https://github.com/react-native-community/react-native-netinfo/commit/3bfdd45))

# [3.1.0](https://github.com/react-native-community/react-native-netinfo/compare/v3.0.2...v3.1.0) (2019-05-18)


### Features

* **Android:** Detect and report VPN connections correctly on Android ([#95](https://github.com/react-native-community/react-native-netinfo/issues/95)) ([1f9e5c1](https://github.com/react-native-community/react-native-netinfo/commit/1f9e5c1))

## [3.0.2](https://github.com/react-native-community/react-native-netinfo/compare/v3.0.1...v3.0.2) (2019-05-18)


### Bug Fixes

* **android:** Send a "none" status if the device has no active network on launch ([#96](https://github.com/react-native-community/react-native-netinfo/issues/96)) ([c62cd8b](https://github.com/react-native-community/react-native-netinfo/commit/c62cd8b))

## [3.0.1](https://github.com/react-native-community/react-native-netinfo/compare/v3.0.0...v3.0.1) (2019-05-17)


### Bug Fixes

* Fix an issue in the Android de-duplication code ([de12dd5](https://github.com/react-native-community/react-native-netinfo/commit/de12dd5))

# [3.0.0](https://github.com/react-native-community/react-native-netinfo/compare/v2.1.0...v3.0.0) (2019-05-17)


### Features

* New API with full backward compatibility ([#84](https://github.com/react-native-community/react-native-netinfo/issues/84)) ([1dc6000](https://github.com/react-native-community/react-native-netinfo/commit/1dc6000))


### BREAKING CHANGES

* See the README for full details.
