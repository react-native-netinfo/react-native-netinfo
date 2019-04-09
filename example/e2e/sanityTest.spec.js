/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */
/* global device, element, by */

describe('NetInfo', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should load example app with no errors and show all the examples by default', async () => {
    await expect(element(by.id('examplesTitle'))).toExist();
    await expect(element(by.id('example-isConnected'))).toExist();
    await expect(element(by.id('example-currentInfoSingle'))).toExist();
    await expect(element(by.id('example-currentInfoHistory'))).toExist();
    await expect(element(by.id('example-isConnectionExpensive'))).toExist();
  });

  it('should show the test cases when the button is toggled', async () => {
    await element(by.id('modeToggle')).tap();

    await expect(element(by.id('testCasesTitle'))).toExist();
  });

  it('should show the examples again when the button is toggled twice', async () => {
    await element(by.id('modeToggle')).tap();
    await element(by.id('modeToggle')).tap();

    await expect(element(by.id('examplesTitle'))).toExist();
  });
});
