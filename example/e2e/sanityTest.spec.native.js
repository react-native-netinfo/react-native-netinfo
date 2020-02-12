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

describe('NetInfo', () => {
  beforeEach(async () => {
    await device.launchApp({newInstance: true});
  });

  it('should load example app with no errors and show all the examples by default', async () => {
    await expect(element(by.id('examplesTitle'))).toExist();
  });
});
