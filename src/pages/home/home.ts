import { ViewChild, Component } from '@angular/core';
import { Content, Searchbar, NavController, NavParams } from 'ionic-angular';
import { SearchResultsPage } from '../search-results/search-results';
import { ServerProvider } from '../../providers/server/server';
import { GoogleAnalytics } from '@ionic-native/google-analytics/';

import { MapDetailsPage } from '../map-details/map-details'
import { SettingsPage } from '../settings/settings'

@Component( {
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    toggled: boolean;
    searchTerm: String = '';
    
    featured: any;
    recommended: any;

    errorLoading: any = false;

    isApp: any = true
    autocomplete = ['cizzorz', 'deathrun', 'a search result', 'the search result', 'lol wtf', 'cizzors death run', 'death runs']

    @ViewChild(Content) content: Content;
    @ViewChild('searchbar') searchbar:Searchbar;

    constructor(public ga: GoogleAnalytics, public navCtrl: NavController, public navParams: NavParams, public serverProvider: ServerProvider ) {
        this.toggled = false; 
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

    toggleSearch() {
        this.toggled = this.toggled ? false : true;
        if(this.toggled) {
            setTimeout(() => {
                this.searchbar.setFocus();
                }, 400);
        }
    }

    openSettings() {
        this.navCtrl.push(SettingsPage, {})
    }

    searchBlurred() {
        console.log("Off");
        this.toggled = false;
    }

    searchQuery(searchbar: any) {
      const val = searchbar.target.value;
    
      if (val && val.trim() != '') {
        this.searchTerm = ""
        this.toggled = false
        console.log(val)
        this.navCtrl.parent.parent.push(SearchResultsPage, {
            query: val
          })
      }
    }

    mapClicked(map, addToViews, source) {
        this.ga.trackEvent('Engagements', source, map['name']);

        this.navCtrl.parent.parent.push(MapDetailsPage, {
            'map_data': map,
            'add_to_views': addToViews
          }) 
    }
}