/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */
/* global device, element, by */

const TEST_CASE_COUNT = 5;

describe('DeprecatedMultipleIsConnectedFetch', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
    await device.openURL({
      url: 'netinfoexample://deprecatedMultipleIsConnectedFetch',
    });
  });

  it('should have the correct elements to perform the test', async () => {
    await expect(element(by.id('results'))).toExist();
    await expect(element(by.id('testButton'))).toExist();
  });

  const testAllResultsAre = async value => {
    for (let i = 0; i < TEST_CASE_COUNT; i++) {
      await expect(element(by.id(`result${i}`))).toHaveLabel(value);
    }
  };

  it('should start with all failures', async () => {
    await testAllResultsAre('fail');
  });

  it('should show all success after being tested', async () => {
    await element(by.id('testButton')).tap();
    await testAllResultsAre('pass');
  });
});
