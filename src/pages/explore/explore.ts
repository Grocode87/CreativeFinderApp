import { ViewChild, Component } from '@angular/core';
import { Content, Searchbar, IonicPage, NavController, NavParams } from 'ionic-angular';
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

    maps: any = [];
    showLoading: any = true;

    pop: any;
    type: any;

    pubFilters: any = [];
    typeFilters: any = [];

    @ViewChild('searchbar') searchbar:Searchbar;
    @ViewChild(Content) content: Content;

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

            this.getMaps(this.pop, this.type, null)
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
    refresh(refresher) {
        this.getMaps(this.pop, this.type, refresher)
    }
    getMaps(pubFilter, typeFilter, refresher) {
        
        if(!refresher) {
            this.showLoading = true;

        }
        this.content.scrollTo(0, 5, 0)
      this.serverProvider.getFiltered(pubFilter, typeFilter)
        .then(data => {
            this.maps = data['results']
            this.showLoading = false;

            // Go through the maps and change the only tag to the filter item
            if(typeFilter != "All") {
                this.maps.forEach( (result) => {
                    result['typesToShow'] = [typeFilter]
                });
            } else {
                this.maps.forEach( (result) => {
                    result['typesToShow'] = result['types']
                });
            }
            if(refresher) {
                refresher.complete();
            }
        });
    }

    mapClicked(map, addToViews) {
        this.navCtrl.parent.parent.push(MapDetailsPage, {
            'map_data': map,
            'add_to_views': addToViews
          }) 
    }
}
