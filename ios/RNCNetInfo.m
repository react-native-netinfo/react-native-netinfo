/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RNCNetInfo.h"
#import "RNCConnectionStateWatcher.h"

#import <React/RCTAssert.h>
#import <React/RCTBridge.h>
#import <React/RCTEventDispatcher.h>

@interface RNCNetInfo () <RNCConnectionStateWatcherDelegate>

@property (nonatomic, strong) RNCConnectionStateWatcher *connectionStateWatcher;
@property (nonatomic) BOOL isObserving;

@end

@implementation RNCNetInfo

#pragma mark - Module setup

RCT_EXPORT_MODULE()

// We need RNCReachabilityCallback's and module methods to be called on the same thread so that we can have
// guarantees about when we mess with the reachability callbacks.
- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

+ (BOOL)requiresMainQueueSetup
{
  return YES;
}

#pragma mark - Lifecycle

- (NSArray *)supportedEvents
{
  return @[@"netInfo.networkStatusDidChange"];
}

- (void)startObserving
{
  self.isObserving = YES;
}

- (void)stopObserving
{
  self.isObserving = NO;
}

- (instancetype)init
{
  self = [super init];
  if (self) {
    _connectionStateWatcher = [[RNCConnectionStateWatcher alloc] initWithDelegate:self];
  }
  return self;
}

- (void)dealloc
{
  self.connectionStateWatcher = nil;
}

#pragma mark - RNCConnectionStateWatcherDelegate

- (void)connectionStateWatcher:(RNCConnectionStateWatcher *)connectionStateWatcher didUpdateState:(RNCConnectionState *)state
{
  if (self.isObserving) {
    NSDictionary *dictionary = [self currentDictionaryFromUpdateState:state];
    [self sendEventWithName:@"netInfo.networkStatusDidChange" body:dictionary];
  }
}

#pragma mark - Public API

RCT_EXPORT_METHOD(getCurrentState:(RCTPromiseResolveBlock)resolve
                  reject:(__unused RCTPromiseRejectBlock)reject)
{
  RNCConnectionState *state = [self.connectionStateWatcher currentState];
  resolve([self currentDictionaryFromUpdateState:state]);
}

#pragma mark - Utilities

// Converts the state into a dictionary to send over the bridge
- (NSDictionary *)currentDictionaryFromUpdateState:(RNCConnectionState *)state
{
  NSMutableDictionary *details = nil;
  if (state.connected) {
    details = [NSMutableDictionary new];
    details[@"isConnectionExpensive"] = @(state.expensive);
    
    if ([state.type isEqualToString:RNCConnectionTypeCellular]) {
      details[@"cellularGeneration"] = state.cellularGeneration ?: NSNull.null;
    }
  }
  
  return @{
           @"type": state.type,
           @"isConnected": @(state.connected),
           @"details": details ?: NSNull.null
           };
}

@end
