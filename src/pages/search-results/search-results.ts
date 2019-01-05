import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ServerProvider } from '../../providers/server/server'
import { MapDetailsPage } from '../map-details/map-details'

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
  maps: any;
  showResults; any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public serverProvider: ServerProvider) {
    this.query = navParams.get('query')
  }

   ionViewDidLoad() {
        this.serverProvider.getSearch(this.query)
        .then(data => {
          this.maps = data['results'];
          console.log("maps " +this.maps); 
        });
    } 

   mapClicked(map, addToViews) {
        this.navCtrl.parent.parent.push(MapDetailsPage, {
            'map_data': map,
            'add_to_views': addToViews
          }) 
    }
}
