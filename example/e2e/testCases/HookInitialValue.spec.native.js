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

describe('HookInitialValue', () => {
  beforeEach(async () => {
    const url = 'netinfoexample://hookInitialValue';
    await device.launchApp({url: url, newInstance: true});
  });

  it('should have the correct elements to perform the test', async () => {
    await expect(element(by.id('result'))).toExist();
  });

  it('should show a pass', async () => {
    await expect(element(by.id('result'))).toHaveLabel('pass');
  });
});
