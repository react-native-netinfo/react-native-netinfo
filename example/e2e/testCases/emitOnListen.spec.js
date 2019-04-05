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
    await element(by.id('modeToggle')).tap();
  });

  it('should have the correct elements to perform the test', async () => {
    await expect(element(by.id('emitOnListenResults'))).toExist();
    await expect(element(by.id('emitOnListenTestButton'))).toExist();
  });

  it('should start with all failures', async () => {
    await expect(element(by.id('emitOnListenResult'))).toHaveLabel('fail');
  });

  it('should show all success after being tested', async () => {
    await element(by.id('emitOnListenTestButton')).tap();
    await expect(element(by.id('emitOnListenResult'))).toHaveLabel('pass');
  });
});
