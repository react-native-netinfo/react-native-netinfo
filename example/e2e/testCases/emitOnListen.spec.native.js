/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */
/* eslint-env jest */

const {device, expect, element, by} = require('detox');

describe('EmitOnListen', () => {
  beforeEach(async () => {
    const url = 'netinfoexample://emitOnListen';
    await device.launchApp({url: url, newInstance: true});
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
