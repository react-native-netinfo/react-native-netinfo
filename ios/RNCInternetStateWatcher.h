//
//  RNCInternetStateWatcher.h
//  RNCNetInfo
//
//  Created by Matt Oakes on 28/05/2019.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "RNCConnectionState.h"

NS_ASSUME_NONNULL_BEGIN

@class RNCInternetStateWatcher;

@protocol RNCInternetStateWatcherDelegate

- (void)internetStateWatcher:(RNCInternetStateWatcher *)internetStateWatcher didUpdateState:(BOOL)reachable;

@end

@interface RNCInternetStateWatcher : NSObject

- (instancetype)initWithDelegate:(id<RNCInternetStateWatcherDelegate>)delegate;
- (void)updateWithConnectionState:(RNCConnectionState *)connectionState;
- (BOOL)currentState;

@end

NS_ASSUME_NONNULL_END
