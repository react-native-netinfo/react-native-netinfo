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

#if TARGET_OS_TV || TARGET_OS_OSX
#include <ifaddrs.h>
#endif

@interface RNCConnectionState ()

@property (nonatomic, readwrite) BOOL connected;
@property (nonatomic, readwrite) BOOL expensive;
    
@end

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

- (instancetype)initWithPath:(nw_path_t)path {
    self = [self init];
    if (self) {
        _connected = (nw_path_get_status(path) == nw_path_status_satisfied);
        _expensive = nw_path_is_expensive(path);
        
        if (nw_path_uses_interface_type(path, nw_interface_type_wifi)) {
            _type = RNCConnectionTypeWifi;
        } else if (nw_path_uses_interface_type(path, nw_interface_type_cellular)) {
            _type = RNCConnectionTypeCellular;
        } else if (nw_path_uses_interface_type(path, nw_interface_type_wired)) {
            _type = RNCConnectionTypeEthernet;
        } else {
            _type = RNCConnectionTypeUnknown;
        }
        [self buildCellularGenerationType];
    }
    return self;
}

// Checks if two states are equal
- (BOOL)isEqualToConnectionState:(RNCConnectionState *)otherState
{
    return (self.connected == otherState.connected &&
            [self.type isEqualToString:otherState.type] &&
            [self.cellularGeneration isEqualToString:otherState.cellularGeneration] &&
            self.expensive == otherState.expensive);
}

- (void)buildCellularGenerationType {
#if !TARGET_OS_TV && !TARGET_OS_OSX
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
#endif
}

@end
