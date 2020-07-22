import { Component, Renderer } from '@angular/core';
import { Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { AppState} from "./app.global";
import { Storage } from '@ionic/storage';

import { AdMobFree, AdMobFreeInterstitialConfig } from '@ionic-native/admob-free';

@Component({
  templateUrl: 'app.html'
  
})

export class MyApp {
  rootPage:any = 'TabsPage';
  pagesClicked:any = 0;

  constructor(public storage: Storage, 
              public events: Events, 
              public global: AppState, 
              public ga: GoogleAnalytics, 
              public admob: AdMobFree,
              renderer: Renderer,
              platform: Platform, 
              statusBar: StatusBar, 
              splashScreen: SplashScreen) {
  
    platform.ready().then(() => {
      storage.get('theme').then((val) => {
        if(val) {
          global.set('theme', val)
        } else {
          storage.set('theme', '')
        }
      });
      storage.get('layout').then((val) => {
        if(!val) {
          storage.set('layout', '')
        }
      });

      try {
        //configure interstitial ad and prepare it
        const interstitialConfig: AdMobFreeInterstitialConfig = {
            id: 'ca-app-pub-6794112313190428/2474984639',
            isTesting: false,
            autoShow: false
        }
        this.admob.interstitial.config(interstitialConfig);

        this.admob.interstitial.prepare()
        .then(() => { }).catch(e => console.log(e));

      } catch (e) {
        console.error(e)
      }

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

    // Show interstital ad after every 6 clicks
    // Not using this method because I found a better way
    /**
    events.subscribe('map:clicked', () => {
        this.pagesClicked += 1;
        console.log("Pages Pressed: " + this.pagesClicked)

        if(this.pagesClicked >= 6) {
            this.pagesClicked = 0;
            console.log("showing ad")
            this.showInterstitialAd() 
        }
    });
     */
    

    // Show interstitial ad after 2.5 minutes of the app being open
    // 2.5 minutes in MS = 150000
    setTimeout( () => {
      this.showInterstitialAd()
    }, 150000);

    
    // When the ad is closed, que another ad to open
    this.admob.on('admob.interstitial.events.CLOSE').subscribe(() => {
      this.admob.interstitial.prepare()
        .then(() => {
            setTimeout( () => {
                this.showInterstitialAd()
            }, 150000);
        }).catch(e => console.log(e));
    });

  }


    showInterstitialAd() {
        /** Function to show interstitial ad */
        //Check if Ad is loaded
        this.admob.interstitial.isReady().then(() => {
            //Will show prepared Ad
            this.admob.interstitial.show().then(() => {
            }).catch(e =>console.log(e));
        })
        .catch(e =>console.log(e));
    }
  }

