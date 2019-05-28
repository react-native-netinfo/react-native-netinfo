/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RNCConnectionStateWatcher.h"
#import <SystemConfiguration/SystemConfiguration.h>

@interface RNCConnectionStateWatcher ()

@property (nonatomic) SCNetworkReachabilityRef reachabilityRef;
@property (weak, nonatomic) id<RNCConnectionStateWatcherDelegate> delegate;
@property (nonatomic) SCNetworkReachabilityFlags lastFlags;
@property (nonnull, strong, nonatomic) RNCConnectionState *state;

@end

@implementation RNCConnectionStateWatcher

#pragma mark - Lifecycle

- (instancetype)initWithDelegate:(id<RNCConnectionStateWatcherDelegate>)delegate
{
    self = [self init];
    if (self) {
        _reachabilityRef = [self createReachabilityRef];
        _delegate = delegate;
        _state = [[RNCConnectionState alloc] init];
    }
    return self;
}

- (void)dealloc
{
    if (self.reachabilityRef != NULL) {
        SCNetworkReachabilityUnscheduleFromRunLoop(self.reachabilityRef, CFRunLoopGetMain(), kCFRunLoopCommonModes);
        CFRelease(self.reachabilityRef);
    }
}

#pragma mark - Public methods

- (RNCConnectionState *)currentState
{
    return self.state;
}

#pragma mark - Callback

static void RNCReachabilityCallback(__unused SCNetworkReachabilityRef target, SCNetworkReachabilityFlags flags, void *info)
{
    RNCConnectionStateWatcher *self = (__bridge id)info;
    [self update:flags];
    
}

- (void)update:(SCNetworkReachabilityFlags)flags
{
    self.lastFlags = flags;

    RNCConnectionState *newState = [[RNCConnectionState alloc] initWithReachabilityFlags:flags];
    if (![newState isEqualToConnectionState:self.state]) {
        self.state = newState;
        [self.delegate connectionStateWatcher:self didUpdateState:self.state];
    }
}

- (SCNetworkReachabilityRef)createReachabilityRef
{
    SCNetworkReachabilityRef reachability = SCNetworkReachabilityCreateWithName(kCFAllocatorDefault, "apple.com");
    // Set the callback, setting our "self" as the info so we can get a reference in the callback
    SCNetworkReachabilityContext context = { 0, ( __bridge void *)self, NULL, NULL, NULL };
    SCNetworkReachabilitySetCallback(reachability, RNCReachabilityCallback, &context);
    SCNetworkReachabilityScheduleWithRunLoop(reachability, CFRunLoopGetMain(), kCFRunLoopCommonModes);
    return reachability;
}

@end
