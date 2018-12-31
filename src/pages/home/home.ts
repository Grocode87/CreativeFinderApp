import { ViewChild, Component } from '@angular/core';
import { Searchbar, NavController, NavParams, Platform } from 'ionic-angular';
import { SearchResultsPage } from '../search-results/search-results'
import { ServerProvider } from '../../providers/server/server'

import { MapDetailsPage } from '../map-details/map-details'

@Component( {
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {


    toggled: boolean;
    searchTerm: String = '';
    
    featured: any;
    popular: any;

    isApp: any = true

    @ViewChild('searchbar') searchbar:Searchbar;

    constructor( public navCtrl: NavController, public navParams: NavParams, public serverProvider: ServerProvider, private platform: Platform ) {
        if (this.platform.is('cordova')) {
            //this.isApp = true;
        } 
        
        this.toggled = false; 
        this.getMaps(null)
    }
    refresh(refresher) {
        this.getMaps(refresher)
    }
    
    getMaps(refresher) {
        this.serverProvider.getHome()
        .then(data => {

            if(refresher) {
                setTimeout(() => {
                    this.featured = data['featured'];
                    this.popular = data['popular'];
                    refresher.complete();
                }, 1000);
            } else {
                this.featured = data['featured'];
                this.popular = data['popular'];
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

    mapClicked(map) {
        this.navCtrl.parent.parent.push(MapDetailsPage, {
            'map_data': map
          }) 
    }
}