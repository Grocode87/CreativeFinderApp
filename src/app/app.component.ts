import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { AppState} from "./app.global";
import { Storage } from '@ionic/storage';

@Component({
  templateUrl: 'app.html'
  
})

export class MyApp {
  rootPage:any = 'TabsPage';

  constructor(public storage: Storage, public global: AppState, public ga: GoogleAnalytics, platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
  
    platform.ready().then(() => {
      storage.get('theme').then((val) => {
        if(val) {
          global.set('theme', val)
        } else {
          storage.set('theme', '')
        }
      });

      this.ga.startTrackerWithId('UA-132784338-1')
        .then(() => {console.log('Google analytics started');})
        .catch(e => console.log('Error starting GoogleAnalytics', e));
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleLightContent();
      splashScreen.hide();
    });

    // Create storage obj for recent searches
    storage.get('recent_searches').then((val) => {
        if(!val) {    
            this.storage.set('recent_searches', JSON.stringify({"searches":[]}));
        }
    });
  }
}
