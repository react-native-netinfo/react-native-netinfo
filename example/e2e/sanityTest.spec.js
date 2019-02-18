/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */
/* eslint-env jest */
/* global device, element, by */

describe('NetInfo', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should load example app with no errors and show all the examples', async () => {
    await expect(element(by.id('examples'))).toExist();
    await expect(element(by.id('example-isConnected'))).toExist();
    await expect(element(by.id('example-currentInfoSingle'))).toExist();
    await expect(element(by.id('example-currentInfoHistory'))).toExist();
    await expect(element(by.id('example-isConnectionExpensive'))).toExist();
  });
});
