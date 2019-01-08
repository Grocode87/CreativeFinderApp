import { ViewChild, Component } from '@angular/core';
import { Searchbar, NavController, NavParams, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { MapDetailsPage } from '../map-details/map-details'
import { SearchResultsPage } from '../search-results/search-results'

/**
 * Generated class for the MyListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-my-list',
  templateUrl: 'my-list.html',
})


export class MyListPage {

    maps: any;
    toggled: boolean;
    searchTerm: String = '';

    @ViewChild('searchbar') searchbar:Searchbar;

    constructor(public navCtrl: NavController, public events: Events, public navParams: NavParams, public storage: Storage) {
        
        events.subscribe('maps:changed', () => {
            this.updateMaps()
        });
        
        this.toggled = false; 
        this.updateMaps()
        
  }
  updateMaps() {
      this.storage.get('saved_maps').then((val) => {
            if(val) {
                this.maps = JSON.parse(val).maps
            } else {
                this.maps = []
            }
        });
  }

   mapClicked(map, addToViews) {
       console.log(addToViews)
        this.navCtrl.parent.parent.push(MapDetailsPage, {
            'map_data': map,
            'add_to_views': addToViews
          }) 
    }

  delete(map) {
        this.storage.get('saved_maps').then((val) => {
            if(val) {
                let maps_obj = JSON.parse(val)

                for(let i = 0; i < maps_obj.maps.length; i++) {
                    if(maps_obj.maps[i]['name'] == map['name']) {
                        maps_obj.maps.splice(i, 1);
                        this.storage.set('saved_maps', JSON.stringify(maps_obj));
                        this.events.publish('maps:changed');
                    }
                }
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

}
