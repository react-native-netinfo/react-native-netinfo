/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RNCConnectionState.h"
#if !TARGET_OS_TV
#import <CoreTelephony/CTTelephonyNetworkInfo.h>
#endif

@implementation RNCConnectionState

// Creates a new "blank" state
- (instancetype)init
{
    self = [super init];
    if (self) {
        _type = RNCConnectionTypeUnknown;
        _cellularGeneration = nil;
        _expensive = false;
    }
    return self;
}

// Creates the state from the given reachability references
- (instancetype)initWithReachabilityFlags:(SCNetworkReachabilityFlags)flags
{
    self = [self init];
    if (self) {
        _type = RNCConnectionTypeUnknown;
        _cellularGeneration = nil;
        _expensive = false;
        
        if ((flags & kSCNetworkReachabilityFlagsReachable) == 0 ||
            (flags & kSCNetworkReachabilityFlagsConnectionRequired) != 0) {
            _type = RNCConnectionTypeNone;
        }
#if !TARGET_OS_TV
        else if ((flags & kSCNetworkReachabilityFlagsIsWWAN) != 0) {
            _type = RNCConnectionTypeCellular;
            _expensive = true;
            
            CTTelephonyNetworkInfo *netinfo = [[CTTelephonyNetworkInfo alloc] init];
            if (netinfo) {
                if ([netinfo.currentRadioAccessTechnology isEqualToString:CTRadioAccessTechnologyGPRS] ||
                    [netinfo.currentRadioAccessTechnology isEqualToString:CTRadioAccessTechnologyEdge] ||
                    [netinfo.currentRadioAccessTechnology isEqualToString:CTRadioAccessTechnologyCDMA1x]) {
                    _cellularGeneration = RNCCellularGeneration2g;
                } else if ([netinfo.currentRadioAccessTechnology isEqualToString:CTRadioAccessTechnologyWCDMA] ||
                           [netinfo.currentRadioAccessTechnology isEqualToString:CTRadioAccessTechnologyHSDPA] ||
                           [netinfo.currentRadioAccessTechnology isEqualToString:CTRadioAccessTechnologyHSUPA] ||
                           [netinfo.currentRadioAccessTechnology isEqualToString:CTRadioAccessTechnologyCDMAEVDORev0] ||
                           [netinfo.currentRadioAccessTechnology isEqualToString:CTRadioAccessTechnologyCDMAEVDORevA] ||
                           [netinfo.currentRadioAccessTechnology isEqualToString:CTRadioAccessTechnologyCDMAEVDORevB] ||
                           [netinfo.currentRadioAccessTechnology isEqualToString:CTRadioAccessTechnologyeHRPD]) {
                    _cellularGeneration = RNCCellularGeneration3g;
                } else if ([netinfo.currentRadioAccessTechnology isEqualToString:CTRadioAccessTechnologyLTE]) {
                    _cellularGeneration = RNCCellularGeneration4g;
                }
            }
        }
#endif
        else {
            _type = RNCConnectionTypeWifi;
        }
    }
    return self;
}

// Checks if two states are equal
- (BOOL)isEqualToConnectionState:(RNCConnectionState *)otherState
{
    return [self.type isEqualToString:otherState.type]
            && [self.cellularGeneration isEqualToString:otherState.cellularGeneration]
            && self.expensive == otherState.expensive;
}

- (BOOL)connected
{
    return ![self.type isEqualToString:RNCConnectionTypeNone] && ![self.type isEqualToString:RNCConnectionTypeUnknown];
}

@end
