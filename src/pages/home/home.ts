import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SearchResultsPage } from '../search-results/search-results'

@Component( {
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    toggled: boolean;
    searchTerm: String = '';
    items: string[];

    constructor( public navCtrl: NavController, public navParams: NavParams ) {
        this.toggled = false; 
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