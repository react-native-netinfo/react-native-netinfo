/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RNCConnectionStateWatcher.h"
#import <SystemConfiguration/SystemConfiguration.h>

@interface RNCConnectionStateWatcher () <NSURLSessionDataDelegate>

@property (nonnull, strong, nonatomic) NSURL *url;
@property (nonnull, strong, nonatomic) NSURLSession *urlSession;
@property (nonatomic) SCNetworkReachabilityRef reachabilityRef;
@property (nullable, weak, nonatomic) id<RNCConnectionStateWatcherDelegate> delegate;
@property (nonatomic) SCNetworkReachabilityFlags lastFlags;
@property (nonnull, strong, nonatomic) RNCConnectionState *state;
@property (nullable, strong, nonatomic) NSURLSessionDataTask *currentTask;
@property (nullable, strong, nonatomic) NSTimer *connectionTestTimer;
@property (nonatomic) BOOL expectConnection;
@property (nonatomic) BOOL reachable;

@end

@implementation RNCConnectionStateWatcher

#pragma mark - Lifecycle

- (instancetype)initWithDelegate:(id<RNCConnectionStateWatcherDelegate>)delegate
{
    self = [self init];
    if (self) {
        _delegate = delegate;
        
        _url = [[NSURL alloc] initWithString:@"http://clients3.google.com/generate_204"];
        NSURLSessionConfiguration *configuration = [NSURLSessionConfiguration defaultSessionConfiguration];
        configuration.timeoutIntervalForRequest = 10;
        configuration.timeoutIntervalForResource = 10;
        _urlSession = [NSURLSession sessionWithConfiguration:configuration delegate:self delegateQueue:nil];
        
        _state = [[RNCConnectionState alloc] init];
        
        _reachabilityRef = [self createReachabilityRef];
    }
    return self;
}

- (void)dealloc
{
    self.delegate = nil;

    if (self.reachabilityRef != NULL) {
        SCNetworkReachabilityUnscheduleFromRunLoop(self.reachabilityRef, CFRunLoopGetMain(), kCFRunLoopCommonModes);
        CFRelease(self.reachabilityRef);
        self.reachabilityRef = nil;
    }
}

#pragma mark - Public methods

- (RNCConnectionState *)currentState
{
    return self.state;
}

- (BOOL)currentInternetReachable
{
    return self.reachable;
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
    self.state = [[RNCConnectionState alloc] initWithReachabilityFlags:flags];
}

#pragma mark - NSURLSessionDataDelegate

- (void)URLSession:(NSURLSession *)session task:(NSURLSessionTask *)task didCompleteWithError:(NSError *)error
{
    if (error.code != -999) {
        self.reachable = false;
    }
}

- (void)URLSession:(NSURLSession *)session dataTask:(NSURLSessionDataTask *)dataTask didReceiveResponse:(NSURLResponse *)response completionHandler:(void (^)(NSURLSessionResponseDisposition))completionHandler
{
    if ([response isKindOfClass:[NSHTTPURLResponse class]]) {
        self.reachable = ((NSHTTPURLResponse *) response).statusCode == 204;
    }
}

#pragma mark - Setters

- (void)setState:(RNCConnectionState *)state
{
    if (![state isEqualToConnectionState:_state]) {
        _state = state;
        
        self.expectConnection = state.connected;
        
        if (self.expectConnection) {
            [self checkConnection];
        } else {
            // We can not be connected to the internet
            // We set this directly to avoid calling the delegate twice
            _reachable = false;
            // Cancel any pending task, if there is one
            self.currentTask = nil;
        }
        
        [self updateDelegate];
    }
}

- (void)setReachable:(BOOL)reachable
{
    NSLog(@"Internet reachable: %@", @(reachable));
    if (reachable != _reachable) {
        _reachable = reachable;
        [self updateDelegate];
    }
    
    if (!reachable && self.expectConnection) {
        NSLog(@"Retrying after short delay");
        // If we do not have a connection, but we expected to, retry after a short delay
        [self.connectionTestTimer invalidate];
        self.connectionTestTimer = [NSTimer timerWithTimeInterval:5 target:self selector:@selector(checkConnection) userInfo:nil repeats:false];
    } else if (reachable) {
        NSLog(@"Retrying after long delay");
        // If we do have a connection, retry after a longer delay to check that it has not gone down
        [self.connectionTestTimer invalidate];
        self.connectionTestTimer = [NSTimer timerWithTimeInterval:60 target:self selector:@selector(checkConnection) userInfo:nil repeats:false];
    }
}

// Cancels the previous task whenever a new one is set
- (void)setCurrentTask:(NSURLSessionDataTask *)currentTask
{
    // Cancel any previous task
    [_currentTask cancel];
    // Cancel any pending retries
    [self.connectionTestTimer invalidate];
    // Keep a reference to the new current task
    _currentTask = currentTask;
    // Start the new task
    [_currentTask resume];
}

#pragma mark - Utilities

- (void)checkConnection
{
    // Start a new task
    self.currentTask = [self.urlSession dataTaskWithURL:self.url];
}

- (void)updateDelegate
{
    [self.delegate connectionStateWatcher:self didUpdateState:self.state withInternetReachable:self.reachable];
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
