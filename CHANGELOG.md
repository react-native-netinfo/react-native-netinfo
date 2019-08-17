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
