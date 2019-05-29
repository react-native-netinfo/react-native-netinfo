//
//  RNCInternetStateWatcher.m
//  RNCNetInfo
//
//  Created by Matt Oakes on 28/05/2019.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "RNCInternetStateWatcher.h"

@interface RNCInternetStateWatcher () <NSURLSessionDataDelegate>

@property (nonnull, strong, nonatomic) NSURL *url;
@property (nonnull, strong, nonatomic) NSURLSession *urlSession;
@property (nullable, weak, nonatomic) id<RNCInternetStateWatcherDelegate> delegate;
@property (nullable, strong, nonatomic) NSURLSessionDataTask *currentTask;
@property (nonatomic) BOOL expectConnection;
@property (nonatomic) BOOL reachable;

@end

@implementation RNCInternetStateWatcher

- (instancetype)initWithDelegate:(id<RNCInternetStateWatcherDelegate>)delegate
{
    self = [self init];
    if (self) {
        _url = [[NSURL alloc] initWithString:@"http://clients3.google.com/generate_204"];
        NSURLSessionConfiguration *configuration = [NSURLSessionConfiguration defaultSessionConfiguration];
        configuration.timeoutIntervalForRequest = 10;
        configuration.timeoutIntervalForResource = 10;
        _urlSession = [NSURLSession sessionWithConfiguration:configuration delegate:self delegateQueue:nil];
        _delegate = delegate;
    }
    return self;
}

- (void)dealloc
{
    self.delegate = nil;
}

#pragma mark - Public Methods

- (BOOL)currentState
{
    return self.reachable;
}

// TODO: This doesn't seem to be called for every connection state change
- (void)updateWithConnectionState:(RNCConnectionState *)connectionState
{
    self.expectConnection = connectionState.connected;

    if (self.expectConnection) {
        // Start a new task to check if we can get to the internet
        self.currentTask = [self.urlSession dataTaskWithURL:self.url];
    } else {
        // We can not be connected to the internet
        self.reachable = false;
        // Cancel any pending task, if there is one
        self.currentTask = nil;
    }
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

#pragma mark - Retry logic

// TODO: Retrying does not work
- (void)retry
{
    // Start a new task
    self.currentTask = [self.urlSession dataTaskWithURL:self.url];
}

#pragma mark - Setters

// Updates the delegate whenever the reachable value changes
- (void)setReachable:(BOOL)reachable
{
    if (reachable != _reachable) {
        _reachable = reachable;
        [self.delegate internetStateWatcher:self didUpdateState:_reachable];
    }
    
    // If we do not have a connection, but we expected to, retry after a delay
    if (!_reachable && self.expectConnection) {
        [self performSelector:@selector(retry) withObject:nil afterDelay:5];
    }
}

// Cancels the previous task whenever a new one is set
- (void)setCurrentTask:(NSURLSessionDataTask *)currentTask
{
    // Cancel any previous task
    [_currentTask cancel];
    // Cancel any pending retries
    [NSObject cancelPreviousPerformRequestsWithTarget:self selector:@selector(retry) object:nil];
    // Keep a reference to the new current task
    _currentTask = currentTask;
    // Start the new task
    [_currentTask resume];
}

@end
