/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <XCTest/XCTest.h>

@interface NetInfoExample_macOSUITests : XCTestCase

@end

@implementation NetInfoExample_macOSUITests {
  XCUIApplication *_app;
  XCUIElement *_window;
}

- (void)setUp {
  // In UI tests it is usually best to stop immediately when a failure occurs.
  self.continueAfterFailure = NO;

  _app = [[XCUIApplication alloc] init];
  [_app launch];
    
  _window = _app.windows[@"NetInfoExample macOS"];
  XCTAssert(_window.exists);
}

- (void)testEmitOnListen {
  // switch to emitOnListen test
  [self sendTestAppCommand:@"netinfoexample://emitOnListen"];

  // it should have the correct elements to perform the test
  XCUIElement *testButton = _window.buttons[@"testButton"].staticTexts.firstMatch;
  XCTAssert(testButton.exists);
  XCUIElement *result = _window.staticTexts[@"result"];
  XCTAssert(result.exists);

  // it should start with all failures
  XCTAssertEqualObjects(result.label, @"fail");

  // it should show all success after being tested
  [testButton click];
  XCTAssertEqualObjects(result.label, @"pass");
}

- (void)testFetch {
  // switch to fetch test
  [self sendTestAppCommand:@"netinfoexample://fetch"];

  // it should have the correct elements to perform the test
  XCUIElement *testButton = _window.buttons[@"testButton"].staticTexts.firstMatch;
  XCTAssert(testButton.exists);
  XCUIElement *result = _window.staticTexts[@"result"];
  XCTAssert(result.exists);

  // it should start with all failures
  XCTAssertEqualObjects(result.label, @"fail");

  // it should show all success after being tested
  [testButton click];
  XCTAssertEqualObjects(result.label, @"pass");
}

- (void)testHookInitialValue {
  // switch to hookInitialValue test
  [self sendTestAppCommand:@"netinfoexample://hookInitialValue"];

  // it should have the correct elements to perform the test
  XCUIElement *result = _window.staticTexts[@"result"];
  XCTAssert(result.exists);

  // it should should show a pass
  XCTAssertEqualObjects(result.label, @"pass");
}

- (void)sendTestAppCommand:(NSString *)URLString {
  [[NSWorkspace sharedWorkspace] openURL:[NSURL URLWithString:URLString]];
  sleep(1);
}

@end
