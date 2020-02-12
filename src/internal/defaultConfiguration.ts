export default {
  reachabilityUrl: 'https://clients3.google.com/generate_204',
  reachabilityTest: (response: Response): Promise<boolean> =>
    Promise.resolve(response.status === 204),
  reachabilityShortTimeout: 60 * 1000, // 60s
  reachabilityLongTimeout: 5 * 1000, // 5s
  reachabilityRequestTimeout: 15 * 1000, // 15s
};
