/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */
/* global device, element, by */

describe('Fetch', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
    await device.openURL({url: 'netinfoexample://fetch'});
  });

  it('should have the correct elements to perform the test', async () => {
    await expect(element(by.id('results'))).toExist();
    await expect(element(by.id('testButton'))).toExist();
  });

  it('should start with all failures', async () => {
    await expect(element(by.id('result'))).toHaveLabel('fail');
  });

  it('should show all success after being tested', async () => {
    await element(by.id('testButton')).tap();
    await expect(element(by.id('result'))).toHaveLabel('pass');
  });
});
