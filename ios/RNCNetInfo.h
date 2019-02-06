#import <SystemConfiguration/SystemConfiguration.h>
#import <React/RCTEventEmitter.h>

@interface RNCNetInfo : RCTEventEmitter

- (instancetype)initWithHost:(NSString *)host;

@end
