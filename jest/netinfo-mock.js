/**
 * @format
 */
/* eslint-env jest */

const defaultState = {
  type: 'cellular',
  isConnected: true,
  isInternetReachable: true,
  details: {
    isConnectionExpensive: true,
    cellularGeneration: '3g',
  },
};

const NetInfoStateType = {
  unknown: "unknown",
  none: "none",
  cellular: "cellular",
  wifi: "wifi",
  bluetooth: "bluetooth",
  ethernet: "ethernet",
  wimax: "wimax",
  vpn: "vpn",
  other: "other",
};


const RNCNetInfoMock = {
  NetInfoStateType,
  configure: jest.fn(),
  fetch: jest.fn(),
  refresh: jest.fn(),
  addEventListener: jest.fn(),
  useNetInfo: jest.fn(),
};

RNCNetInfoMock.fetch.mockResolvedValue(defaultState);
RNCNetInfoMock.refresh.mockResolvedValue(defaultState);
RNCNetInfoMock.useNetInfo.mockReturnValue(defaultState);
RNCNetInfoMock.addEventListener.mockReturnValue(jest.fn());

module.exports = RNCNetInfoMock;
