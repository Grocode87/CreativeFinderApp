import { ViewChild, Component } from '@angular/core';
import { IonicPage, Content, Searchbar, NavController, NavParams } from 'ionic-angular';
import { ServerProvider } from '../../providers/server/server';
import { GoogleAnalytics } from '@ionic-native/google-analytics/';

import { Storage } from '@ionic/storage';

@IonicPage()
@Component( {
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    featured: any;
    recommended: any;

    errorLoading: any = false;

    isApp: any = true

    @ViewChild(Content) content: Content;

    constructor(public storage: Storage, public ga: GoogleAnalytics, public navCtrl: NavController, public navParams: NavParams, public serverProvider: ServerProvider ) {
        this.getMaps(null)
    }
    
    ionViewDidEnter() {
        // Track page - Google Analytics
        this.ga.trackView('Home');
        console.log("Tracking Home")
    }

    refresh(refresher) {
        this.getMaps(refresher)
    }
    
    getMaps(refresher) {
        this.serverProvider.getHome()
        .then(data => {
            console.log("loaded succesfully")
            this.errorLoading = false;
            if(refresher) {
                setTimeout(() => {
                    this.featured = data['featured'];
                    this.recommended = data['recommended'];
                    refresher.complete();
                }, 1000);
            } else {
                this.featured = data['featured'];
                this.recommended = data['recommended'];
            }
        }).catch(error => {
            console.log("Unable to load content")
            this.errorLoading = true;

            this.featured = null;
            this.recommended = null;
            
            if(refresher) {
                setTimeout(() => {
                    refresher.complete();
                }, 500);
            }
        });
      }

    mapClicked(map) {
        this.ga.trackEvent('Engagements', 'Trending', map['name']);

        this.navCtrl.parent.parent.push('MapDetailsPage', {
            'map_data': map,
            'add_to_views': false
          }) 
    }

    tryAgain() {
        this.errorLoading = false;
        this.getMaps(null)
    }

}