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
