import { Component, ViewChild } from '@angular/core';
import { Searchbar, NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { ServerProvider } from '../../providers/server/server';
import { GoogleAnalytics } from '@ionic-native/google-analytics/';

/**
 * Generated class for the MyHeaderComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'my-header',
  templateUrl: 'my-header.html'
})
export class MyHeaderComponent {

  toggled: boolean;

  searchTerm: String = '';

  suggestions = []
  history = []
  mapSuggestions = []
  
  @ViewChild('searchbar') searchbar:Searchbar;

  constructor(public navCtrl: NavController, public storage: Storage, public serverProvider: ServerProvider, public ga: GoogleAnalytics) {
      this.toggled = false; 
  }
  openSettings() {
        this.navCtrl.push('SettingsPage', {})
    }

  toggleSearch() {
        this.toggled = this.toggled ? false : true;
        if(this.toggled) {
            this.searchUpdated(null)
            setTimeout(() => {
                this.searchbar.setFocus();
                }, 400);
        }
    }

    searchBlurred() {
        setTimeout(() => {
            this.toggled = false;
            
            this.searchTerm = ""
            this.suggestions = []
            this.mapSuggestions = []
        }, 150);
    }

    searchQuery() {
      const val = this.searchTerm;
    
      if (val && val.trim() != '') {
        this.navCtrl.parent.parent.push('SearchResultsPage', {
            query: val
          }).then(() =>{
        this.searchTerm = ""
        this.toggled = false
        console.log(val)

          })
      }
    }

    searchUpdated(ev: any) {
        if(!ev) {
            this.getHistory()
        } else {
            let val = ev.target.value;

            if (!val || val.trim() == '') {
                this.getHistory()
            } else {
                this.getSuggestions(val)
            }
        }
    }

    getHistory() {
        this.storage.get('recent_searches').then((val) => {
            this.suggestions = []
            this.mapSuggestions = []
            this.history = JSON.parse(val).searches
            console.log(this.history)
        });
    }
    getSuggestions(query) {
        this.serverProvider.getAutocomplete(query).then(data => {
             this.suggestions = data['results']
             this.mapSuggestions = data['maps']
             this.history = []
        }).catch(error => { return []});
    }
    suggestionClicked(suggestion) {
        this.searchTerm = suggestion

        this.searchQuery()
    }
    mapClicked(map) {
        this.ga.trackEvent('Engagements', "Autocomplete", map.name);

         this.navCtrl.push('MapDetailsPage', {
            'map_data':  map,
            'add_to_views': true
        })
    }

}
