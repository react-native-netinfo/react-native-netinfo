/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

const {device, expect, element, by} = require('detox');

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

  it('should show the test case when opening a URL', async () => {
    await device.openURL({url: 'netinfoexample://emitOnListen'});

    await expect(element(by.id('testCasesTitle'))).toExist();
  });

  it('should clear the test case when asked to', async () => {
    await device.openURL({url: 'netinfoexample://emitOnListen'});
    await device.openURL({url: 'netinfoexample://clear'});

    await expect(element(by.id('examplesTitle'))).toExist();
  });
});
