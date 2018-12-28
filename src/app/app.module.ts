import { NgModule, ErrorHandler } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'; 
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { MyApp } from './app.component';

import { ExplorePage } from '../pages/explore/explore';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs'

import { SearchResultsPage } from '../pages/search-results/search-results'

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ServerProvider } from '../providers/server/server';

@NgModule({
  declarations: [
    MyApp,
    ExplorePage,
    HomePage,
    TabsPage,
    SearchResultsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ExplorePage,
    HomePage,
    TabsPage,
    SearchResultsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ServerProvider
  ]
})
export class AppModule {}
