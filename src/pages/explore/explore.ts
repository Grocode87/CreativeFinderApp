import { ViewChild, Component } from '@angular/core';
import { Searchbar, IonicPage, NavController, NavParams } from 'ionic-angular';
import { SearchResultsPage } from '../search-results/search-results'
import { ServerProvider } from '../../providers/server/server'
import { MapDetailsPage } from '../map-details/map-details'

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
    searchTerm: String = '';

    maps: any;

    pop: any;
    type: any;

    pubFilters: any = [];
    typeFilters: any = [];

    @ViewChild('searchbar') searchbar:Searchbar;

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

    getMaps(pubFilter, typeFilter) {
      this.serverProvider.getFiltered(pubFilter, typeFilter)
        .then(data => {
            this.maps = data['results']

            console.log(this.maps)
        });
    }

    mapClicked(map) {
        this.navCtrl.parent.parent.push(MapDetailsPage, {
            'map_data': map,
            'show_others': true
          }) 
    }
}
