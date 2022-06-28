import * as Types from './types';

const DEFAULT_CONFIGURATION: Types.NetInfoConfiguration = {
  reachabilityUrl: 'https://clients3.google.com/generate_204',
  reachabilityMethod: 'HEAD',
  reachabilityTest: (response: Response): Promise<boolean> =>
    Promise.resolve(response.status === 204),
  reachabilityShortTimeout: 5 * 1000, // 5s
  reachabilityLongTimeout: 60 * 1000, // 60s
  reachabilityRequestTimeout: 15 * 1000, // 15s
  reachabilityShouldRun: (): boolean => true,
  shouldFetchWiFiSSID: false,
  useNativeReachability: true
};

export default DEFAULT_CONFIGURATION;