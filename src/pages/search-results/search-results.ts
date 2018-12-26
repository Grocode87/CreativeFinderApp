import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the SearchResultsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search-results',
  templateUrl: 'search-results.html',
})
export class SearchResultsPage {
  query: any = "Val"
  items: any;
  showResults; any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.query = navParams.get('query')
    this.setItems()
  }

  setItems() {
    this.items = ["Plane", "Chopper", "Wow", "This", "Great"]
  }
}
