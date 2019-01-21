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
    recommended: any;

    isApp: any = true

    testMapData = [{
      "code": "0963-6285-4276",
      "creator": "aj-slack",
      "desc": "Claim the golden gun at the Festival Falls gardens and sculpture park.",
      "id": 510,
      "img": "https://i.imgur.com/TpdWAs2.png",
      "name": "Festival Falls",
      "types": [
        "The Block"
      ]
    },
    {
      "code": "7274-7356-5702",
      "creator": "tollmolia",
      "desc": "#FortniteBlockParty Lunar new year submission",
      "id": 508,
      "img": "https://i.imgur.com/NCw46Leg.png",
      "name": "BULKY BONSAI",
      "types": [
        "The Block"
      ]
    },
    {
      "code": "1941-9557-2063",
      "creator": "sammyblue",
      "desc": "My Lunar New Year island submission for the #fortniteblockparty",
      "id": 509,
      "img": "http://cgrob10.pythonanywhere.com/static/template-img.jpg",
      "name": "Sammyblue's Parkour Place",
      "types": [
        "The Block"
      ]
    }]

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
            console.log(data)

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

    mapClicked(map, addToViews) {
        this.navCtrl.parent.parent.push(MapDetailsPage, {
            'map_data': map,
            'add_to_views': addToViews
          }) 
    }
}