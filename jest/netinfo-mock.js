/**
 * @format
 */
/* eslint-env jest */

const RNCNetInfoMock = {
  getCurrentState: jest.fn(),
  addListener: jest.fn(),
  removeListeners: jest.fn(),
};

RNCNetInfoMock.getCurrentState.mockResolvedValue({
  type: 'cellular',
  isConnected: true,
  isInternetReachable: true,
  details: {
    isConnectionExpensive: true,
    cellularGeneration: '3g',
  },
});

module.exports = RNCNetInfoMock;
