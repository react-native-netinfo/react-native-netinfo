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

describe('NetInfo', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
    await element(by.id('modeToggle')).tap();
    await element(by.id('scrollView')).scrollTo('bottom');
  });

  it('should have the correct elements to perform the test', async () => {
    await expect(element(by.id('multipleIsConnectedResults'))).toExist();
    await expect(element(by.id('multipleIsConnectedTestButton'))).toExist();
  });

  const testAllResultsAre = async value => {
    for (let i = 0; i < TEST_CASE_COUNT; i++) {
      await expect(element(by.id(`multipleIsConnectedResult${i}`))).toHaveLabel(
        value,
      );
    }
  };

  it('should start with all failures', async () => {
    await testAllResultsAre('fail');
  });

  it('should show all success after being tested', async () => {
    await element(by.id('multipleIsConnectedTestButton')).tap();
    await testAllResultsAre('pass');
  });
});
