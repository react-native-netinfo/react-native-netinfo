export default {
  reachabilityUrl: 'https://clients3.google.com/generate_204',
  reachabilityTest: (response: Response): Promise<boolean> =>
    Promise.resolve(response.status === 204),
  reachabilityShortTimeout: 5 * 1000, // 5s
  reachabilityLongTimeout: 60 * 1000, // 60s
  reachabilityRequestTimeout: 15 * 1000, // 15s
  reachabilityShouldRun: (): boolean => true,
};
