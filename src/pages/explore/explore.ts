import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SearchResultsPage } from '../search-results/search-results'

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
    filterTypeOne: any;
    filterTypeTwo: any;

    constructor( public navCtrl: NavController, public navParams: NavParams ) {
        this.toggled = false; 

        this.filterTypeOne = ["Newest", "Popular", "Oldest", "Most Viewed"]
        this.filterTypeTwo = ["All", "PVP", "Obstacle Course", "Race", "Hide and Seek", "The Block", "Free Play/Other"]
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

    selectFilter(test1, test2) {
      console.log(test1, test2)
      +
    }

}
