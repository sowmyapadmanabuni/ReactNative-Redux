/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <Firebase.h>
#import "AppDelegate.h"
#import <React/RCTBridge.h>
#import <Fabric/Fabric.h>
#import <Crashlytics/Crashlytics.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import "RNFirebaseNotifications.h"
#import "RNFirebaseMessaging.h"
#import <GoogleMaps/GoogleMaps.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [FIRApp configure];
  [RNFirebaseNotifications configure];
  NSURL *jsCodeLocation;
  
  [GMSServices provideAPIKey:@"AIzaSyCJc5HvTftpIWK1VRupATlDPgYVYqVn2Dc"];

  
  //Uncomment code below to check Postscript name of the fonts   --Sarthak Mishra(Synclovis Systems Pvt. Ltd.)
  /*for (NSString *fontFamilyName in [UIFont familyNames]) {
    for (NSString *fontName in [UIFont fontNamesForFamilyName:fontFamilyName]) {
      NSLog(@"Family: %@ Font: %@", fontFamilyName, fontName);
    }
  }*/
  //debug
  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
  //Release
//  jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
  
  
  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"OyeSpace"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];
  
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  [Fabric with:@[[Crashlytics class]]];
  return YES;
}

- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification {
  [[RNFirebaseNotifications instance] didReceiveLocalNotification:notification];
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(nonnull NSDictionary *)userInfo
fetchCompletionHandler:(nonnull void (^)(UIBackgroundFetchResult))completionHandler{
  [[RNFirebaseNotifications instance] didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
}

- (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings {
  [[RNFirebaseMessaging instance] didRegisterUserNotificationSettings:notificationSettings];
}

@end
