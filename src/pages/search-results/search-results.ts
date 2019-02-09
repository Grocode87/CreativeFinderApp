import { ViewChild, Component } from '@angular/core';
import { Content, NavController, NavParams } from 'ionic-angular';
import { ServerProvider } from '../../providers/server/server'
import { MapDetailsPage } from '../map-details/map-details'
import { GoogleAnalytics } from '@ionic-native/google-analytics/';
import { Storage } from '@ionic/storage';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/interval';
import 'rxjs/add/observable/merge';
import { Subject } from 'rxjs/Subject';

/**
 * Generated class for the SearchResultsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-search-results',
  templateUrl: 'search-results.html',
})
export class SearchResultsPage {
    query: any = "Val"
    maps: any;
    showResults; any;

    @ViewChild(Content) content: Content;

    contentLoaded: Subject<any> = new Subject();
    loadAndScroll: Observable<any>;

    errorLoading = false;

  constructor(public storage: Storage, public ga: GoogleAnalytics, public navCtrl: NavController, public navParams: NavParams, public serverProvider: ServerProvider) {
    this.query = navParams.get('query')
    this.ga.trackEvent('Search', "Query", this.query);

     storage.get('recent_searches').then((val) => {
            if(val) {
                let searches = JSON.parse(val).searches
                if(searches.indexOf(this.query) > -1) {
                    searches.splice(searches.indexOf(this.query), 1);
                }

                searches.unshift(this.query)
                if(searches.length > 4){
                    searches.length = 4
                }

                this.storage.set('recent_searches', JSON.stringify({"searches":searches}));
            }
        });
  }

   ionViewDidLoad() {
        this.ga.trackView('Search Results');

        this.serverProvider.getSearch(this.query)
        .then(data => {
          this.maps = data['results'];
          console.log("loaded")
          setTimeout(() => {
                    console.log("loaded")
                    this.contentLoaded.next();
                }, 400);
        }).catch(error => { 
            this.errorLoading = true;
        });

        
        this.loadAndScroll = Observable.merge(
            this.content.ionScroll,
            this.contentLoaded
        );
    } 

   mapClicked(map, addToViews) {
        this.ga.trackEvent('Engagements', "Search", map['name']);
        this.navCtrl.push(MapDetailsPage, {
            'map_data': map,
            'add_to_views': addToViews
          }) 
    }
}
