/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RNCConnectionStateWatcher.h"
#import <Network/Network.h>

@interface RNCConnectionStateWatcher () <NSURLSessionDataDelegate>

@property (nullable, weak, nonatomic) id<RNCConnectionStateWatcherDelegate> delegate;
@property (nonnull, strong, nonatomic, readwrite) RNCConnectionState *state;
@property (nonatomic, copy) nw_path_monitor_t pathMonitor;

@end

@implementation RNCConnectionStateWatcher

#pragma mark - Lifecycle

- (instancetype)initWithDelegate:(id<RNCConnectionStateWatcherDelegate>)delegate
{
    self = [self init];
    if (self) {
        _delegate = delegate;
        _state = [[RNCConnectionState alloc] init];
        _pathMonitor = nw_path_monitor_create();
        nw_path_monitor_set_queue(_pathMonitor, dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_BACKGROUND, 0));
        __weak __typeof__(self) weakSelf = self;
        nw_path_monitor_set_update_handler(_pathMonitor, ^(nw_path_t  _Nonnull path) {
            weakSelf.state = [[RNCConnectionState alloc] initWithPath:path];
        });
        nw_path_monitor_start(_pathMonitor);
    }
    return self;
}

- (void)dealloc
{
    nw_path_monitor_cancel(_pathMonitor);
}

#pragma mark - Setters

- (void)setState:(RNCConnectionState *)state
{
    if (![state isEqualToConnectionState:_state]) {
        _state = state;

        [self updateDelegate];
    }
}

#pragma mark - Utilities

- (void)updateDelegate
{
    [self.delegate connectionStateWatcher:self didUpdateState:self.state];
}

@end
