/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RNCNetInfo.h"
#import "RNCConnectionStateWatcher.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import "RNCNetInfoSpec.h"
#endif

#include <ifaddrs.h>
#include <arpa/inet.h>

#if !TARGET_OS_TV && !TARGET_OS_MACCATALYST && !TARGET_OS_VISION
#import <CoreTelephony/CTCarrier.h>
#import <CoreTelephony/CTTelephonyNetworkInfo.h>
#import <NetworkExtension/NetworkExtension.h>
#endif
#import <SystemConfiguration/CaptiveNetwork.h>


#import <React/RCTAssert.h>
#import <React/RCTBridge.h>
#import <React/RCTEventDispatcher.h>

#ifdef RCT_NEW_ARCH_ENABLED
@interface RNCNetInfo () <RNCConnectionStateWatcherDelegate, NativeRNCNetInfoSpec>
#else
@interface RNCNetInfo () <RNCConnectionStateWatcherDelegate>
#endif

@property (nonatomic, strong) RNCConnectionStateWatcher *connectionStateWatcher;
@property (nonatomic) BOOL isObserving;
@property (nonatomic) NSDictionary *config;

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
    [self currentDictionaryFromUpdateState:state
                                   withInterface:NULL
                                      completion:^(NSDictionary *dictionary) {
            [self sendEventWithName:@"netInfo.networkStatusDidChange" body:dictionary];
          }];
  }
}

#pragma mark - Public API

RCT_EXPORT_METHOD(getCurrentState:(NSString *)requestedInterface resolve:(RCTPromiseResolveBlock)resolve
                  reject:(__unused RCTPromiseRejectBlock)reject)
{
  RNCConnectionState *state = [self.connectionStateWatcher currentState];
  [self currentDictionaryFromUpdateState:state
                                 withInterface:requestedInterface
                                    completion:^(NSDictionary *dictionary) {
      resolve(dictionary);
    }];
}


RCT_EXPORT_METHOD(configure:(NSDictionary *)config)
{
    self.config = config;
}

#pragma mark - Utilities

// Converts the state into a dictionary to send over the bridge
- (void)currentDictionaryFromUpdateState:(RNCConnectionState *)state
                           withInterface:(nullable NSString *)requestedInterface
                              completion:(void (^)(NSDictionary *dictionary))completion
{
  NSString *selectedInterface = requestedInterface ?: state.type;
  bool connected = [state.type isEqualToString:selectedInterface] && state.connected;
  [self detailsFromInterface:selectedInterface withState:state completion:^(NSMutableDictionary *details) {
        if (connected) {
          details[@"isConnectionExpensive"] = @(state.expensive);
        }
        
        NSDictionary *result = @{
          @"type": selectedInterface,
          @"isConnected": @(connected),
          @"details": details ?: NSNull.null
        };
        
        completion(result);
      }];
}

- (void)detailsFromInterface:(nonnull NSString *)requestedInterface
                                    withState:(RNCConnectionState *)state
                                   completion:(void (^)(NSMutableDictionary *details))completion
{
  NSMutableDictionary *details = [NSMutableDictionary new];
  if ([requestedInterface isEqualToString: RNCConnectionTypeCellular]) {
    details[@"cellularGeneration"] = state.cellularGeneration ?: NSNull.null;
    details[@"carrier"] = [self carrier] ?: NSNull.null;
  } else if ([requestedInterface isEqualToString: RNCConnectionTypeWifi] || [requestedInterface isEqualToString: RNCConnectionTypeEthernet]) {
    details[@"ipAddress"] = [self ipAddress] ?: NSNull.null;
    details[@"subnet"] = [self subnet] ?: NSNull.null;
    #if !TARGET_OS_TV && !TARGET_OS_OSX && !TARGET_OS_MACCATALYST && !TARGET_OS_VISION
      /*
        Without one of the conditions needed to use CNCopyCurrentNetworkInfo, it will leak memory.
        Clients should only set the shouldFetchWiFiSSID to true after ensuring requirements are met to get (B)SSID.
      */
      if (self.config && self.config[@"shouldFetchWiFiSSID"]) {
        __weak __typeof(self) weakSelf = self;
               
               [self ssid:^(NSString * _Nullable ssid) {
                   __strong __typeof(weakSelf) strongSelf = weakSelf;
                   if (strongSelf == nil) {
                     completion(details);
                     return;
                   }
                   
                   details[@"ssid"] = ssid ?: NSNull.null;
                   
                   [self bssid:^(NSString * _Nullable bssid) {
                     details[@"bssid"] = bssid ?: NSNull.null;
                     completion(details);
                   }];
                 }];
               return;
      }
    #endif
  }
  completion(details);
}

- (NSString *)carrier
{
#if (TARGET_OS_TV || TARGET_OS_OSX || TARGET_OS_MACCATALYST || TARGET_OS_VISION)
  return nil;
#else
  CTTelephonyNetworkInfo *netinfo = [[CTTelephonyNetworkInfo alloc] init];
  CTCarrier *carrier = [netinfo subscriberCellularProvider];
  return carrier.carrierName;
#endif
}

- (NSString *)ipAddress
{
  NSString *address = @"0.0.0.0";
  struct ifaddrs *interfaces = NULL;
  struct ifaddrs *temp_addr = NULL;
  int success = 0;
  // retrieve the current interfaces - returns 0 on success
  success = getifaddrs(&interfaces);
  if (success == 0) {
    // Loop through linked list of interfaces
    temp_addr = interfaces;
    while (temp_addr != NULL) {
      if (temp_addr->ifa_addr->sa_family == AF_INET) {
        NSString* ifname = [NSString stringWithUTF8String:temp_addr->ifa_name];
        if (
          // Check if interface is en0 which is the wifi connection on the iPhone
          // and the ethernet connection on the Apple TV
          [ifname isEqualToString:@"en0"] ||
          // Check if interface is en1 which is the wifi connection on the Apple TV
          [ifname isEqualToString:@"en1"]
        ) {
          // Get NSString from C String
          char str[INET_ADDRSTRLEN];
          inet_ntop(AF_INET, &((struct sockaddr_in *)temp_addr->ifa_addr)->sin_addr, str, INET_ADDRSTRLEN);
          address = [NSString stringWithUTF8String:str];
        }
      }

      temp_addr = temp_addr->ifa_next;
    }
  }
  // Free memory
  freeifaddrs(interfaces);
  return address;
}

- (NSString *)subnet
{
  NSString *subnet = @"0.0.0.0";
  struct ifaddrs *interfaces = NULL;
  struct ifaddrs *temp_addr = NULL;
  int success = 0;
  // retrieve the current interfaces - returns 0 on success
  success = getifaddrs(&interfaces);
  if (success == 0) {
    // Loop through linked list of interfaces
    temp_addr = interfaces;
    while (temp_addr != NULL) {
      if (temp_addr->ifa_addr->sa_family == AF_INET) {
        NSString* ifname = [NSString stringWithUTF8String:temp_addr->ifa_name];
        if (
          // Check if interface is en0 which is the wifi connection on the iPhone
          // and the ethernet connection on the Apple TV
          [ifname isEqualToString:@"en0"] ||
          // Check if interface is en1 which is the wifi connection on the Apple TV
          [ifname isEqualToString:@"en1"]
        ) {
          // Get NSString from C String
          char str[INET_ADDRSTRLEN];
          inet_ntop(AF_INET, &((struct sockaddr_in *)temp_addr->ifa_netmask)->sin_addr, str, INET_ADDRSTRLEN);
          subnet = [NSString stringWithUTF8String:str];
        }
      }

      temp_addr = temp_addr->ifa_next;
    }
  }
  // Free memory
  freeifaddrs(interfaces);
  return subnet;
}

#if !TARGET_OS_TV && !TARGET_OS_OSX && !TARGET_OS_MACCATALYST
- (void)ssid:(void (^)(NSString * _Nullable))completion
{
  __weak __typeof(self) weakSelf = self;
      
      [NEHotspotNetwork fetchCurrentWithCompletionHandler:^(NEHotspotNetwork * _Nullable currentNetwork) {
        __strong __typeof(weakSelf) strongSelf = weakSelf;
        if(strongSelf == nil){
            completion(nil);
            return;
        }
        
        NSString *SSID = nil;
        if (currentNetwork != nil) {
          NSString *networkSSID = currentNetwork.SSID;
          if (networkSSID != nil &&
              ![networkSSID isEqualToString:@"Wi-Fi"] &&
              ![networkSSID isEqualToString:@"WLAN"]) {
            SSID = networkSSID;
        }
        }
              completion(SSID);
            }];
}

- (void)bssid:(void (^)(NSString * _Nullable))completion
{
  __weak __typeof(self) weakSelf = self;
      
      [NEHotspotNetwork fetchCurrentWithCompletionHandler:^(NEHotspotNetwork * _Nullable currentNetwork) {
          __strong __typeof(weakSelf) strongSelf = weakSelf;
          if(strongSelf == nil){
              completion(nil);
              return;
          }
          
          NSString *BSSID = nil;
          if (currentNetwork != nil) {
            BSSID = currentNetwork.BSSID;
          }
          completion(BSSID);
        }];
}
#endif

#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeRNCNetInfoSpecJSI>(params);
}
#endif

@end
