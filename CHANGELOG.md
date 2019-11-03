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
