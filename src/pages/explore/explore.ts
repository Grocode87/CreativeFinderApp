import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SearchResultsPage } from '../search-results/search-results'
import { ServerProvider } from '../../providers/server/server'

/**
 * Generated class for the ExplorePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-explore',
  templateUrl: 'explore.html',
})
export class ExplorePage {
    
    toggled: boolean;

    maps: any;

    pop: any;
    type: any;

    pubFilters: any = [];
    typeFilters: any = [];

    constructor( public navCtrl: NavController, public navParams: NavParams, public serverProvider: ServerProvider ) {
        this.toggled = false; 

        this.getFilterTypes()

    }

    getFilterTypes() {
        /** Get the possible selection values from the server and set them */
        this.serverProvider.getFilterTypes()
        .then(data => {
            console.log(data)
            this.pubFilters = data['publishedFilters'];
            this.typeFilters = data['typeFilters'];

            this.pop = this.pubFilters[0]
            this.type = this.typeFilters[0]

            this.getMaps(this.pop, this.type)
        });
    }

    ionViewDidLoad() {
        console.log( 'ionViewDidLoad HomePage' );
    } 

    toggleSearch() {
        this.toggled = this.toggled ? false : true;
    }

    searchQuery(searchbar: any) {
      const val = searchbar.target.value;

    
      if (val && val.trim() != '') {
        console.log(val)
        this.navCtrl.parent.parent.push(SearchResultsPage, {
            query: val
          })
      }
    }

    getMaps(pubFilter, typeFilter) {
      this.serverProvider.getFiltered(pubFilter, typeFilter)
        .then(data => {
            this.maps = data['results']

            console.log(this.maps)
        });
    }
}
