/**
 * @format
 */
/* eslint-env jest */

const RNCNetInfoMock = {
  getCurrentState: jest.fn(),
  addListener: jest.fn(),
  removeListeners: jest.fn(),
};

module.exports = RNCNetInfoMock;
