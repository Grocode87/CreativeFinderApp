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

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ServerProvider } from '../providers/server/server';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { IonicStorageModule } from '@ionic/storage';

@NgModule({
  declarations: [
    MyApp,
    ExplorePage,
    HomePage,
    TabsPage,
    SearchResultsPage,
    MapDetailsPage,
    MyListPage
  ],
  imports: [
    BrowserModule,
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
    MyListPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ServerProvider,
    InAppBrowser
  ]
})
export class AppModule {}
