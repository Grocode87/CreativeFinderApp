import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SearchResultsPage } from '../search-results/search-results'
import { ServerProvider } from '../../providers/server/server'

@Component( {
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    toggled: boolean;
    searchTerm: String = '';
    items: string[];
    featured: any;
    popular: any;

    constructor( public navCtrl: NavController, public navParams: NavParams, public serverProvider: ServerProvider ) {
        this.toggled = false; 
        this.getMaps()
    }
    
    getMaps() {
        this.serverProvider.getHome()
        .then(data => {
          this.featured = data['featured'];
          this.popular = data['popular'];

          console.log(this.featured);
          console.log(this.popular);
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
}