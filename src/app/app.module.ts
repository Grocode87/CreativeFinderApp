import { NgModule, ErrorHandler } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'; 
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { MyApp } from './app.component';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ServerProvider } from '../providers/server/server';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { GoogleAnalytics } from '@ionic-native/google-analytics';

import { AppState } from './app.global';

import { IonicStorageModule } from '@ionic/storage';
import { LazyLoadImageModule } from 'ng-lazyload-image';

import { AdMobFree } from '@ionic-native/admob-free';
import { SocialSharing } from '@ionic-native/social-sharing';
import { BannerProvider } from '../providers/banner/banner';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    LazyLoadImageModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpClientModule,
    VirtualScrollerModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    GoogleAnalytics,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ServerProvider,
    InAppBrowser,
    AppState,
    AdMobFree,
    SocialSharing,
    BannerProvider
  ],
  exports: [
  ]
})
export class AppModule {}
