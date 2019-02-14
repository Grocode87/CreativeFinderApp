import { NgModule, ErrorHandler } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'; 
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { MyApp } from './app.component';

import { ExplorePage } from '../pages/explore/explore';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs'

import { SearchResultsPage } from '../pages/search-results/search-results'
import { MapDetailsPage } from '../pages/map-details/map-details'
import { MyListPage } from '../pages/my-list/my-list'
import { SettingsPage } from '../pages/settings/settings'
import { PopoverPage } from '../pages/popover/popover'

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

@NgModule({
  declarations: [
    MyApp,
    ExplorePage,
    HomePage,
    TabsPage,
    SearchResultsPage,
    MapDetailsPage,
    MyListPage,
    SettingsPage,
    PopoverPage
  ],
  imports: [
    BrowserModule,
    LazyLoadImageModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ExplorePage,
    HomePage,
    TabsPage,
    SearchResultsPage,
    MapDetailsPage,
    MyListPage,
    SettingsPage,
    PopoverPage
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
