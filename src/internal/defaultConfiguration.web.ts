export default {
  reachabilityUrl: '/',
  reachabilityTest: (response: Response): Promise<boolean> =>
    Promise.resolve(response.status === 200),
  reachabilityShortTimeout: 5 * 1000, // 5s
  reachabilityLongTimeout: 60 * 1000, // 60s
  reachabilityRequestTimeout: 15 * 1000, // 15s
};
