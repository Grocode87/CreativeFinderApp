import { ViewChild, Component } from '@angular/core';
import { VirtualScroll, Content, Searchbar, NavController, NavParams } from 'ionic-angular';
import { SearchResultsPage } from '../search-results/search-results'
import { SettingsPage } from '../settings/settings'
import { ServerProvider } from '../../providers/server/server'
import { MapDetailsPage } from '../map-details/map-details'
import { GoogleAnalytics } from '@ionic-native/google-analytics/';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/interval';
import 'rxjs/add/observable/merge';
import { Subject } from 'rxjs/Subject';

import { Storage } from '@ionic/storage';

/**
 * Generated class for the ExplorePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

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
    typeFilters: any = ['1', '2'];

    @ViewChild('searchbar') searchbar:Searchbar;
    @ViewChild(Content) content: Content;
    @ViewChild(VirtualScroll) virtualScroll: VirtualScroll

    contentLoaded: Subject<any> = new Subject();
    loadAndScroll: Observable<any>;
    sub: any;

    errorLoading = false;
    
    suggestions = []
    history = []

    page = 0
    total_pages = 0

    constructor(public storage: Storage, public ga: GoogleAnalytics, public navCtrl: NavController, public navParams: NavParams, public serverProvider: ServerProvider ) {
        this.toggled = false; 

        this.getFilterTypes(null)
    }

    getFilterTypes(refresher) {
        /** Get the possible selection values from the server and set them */
        this.serverProvider.getFilterTypes()
        .then(data => {
            console.log(data)
            this.errorLoading = false;
            this.pubFilters = data['publishedFilters'];
            this.typeFilters = data['typeFilters'];

            if(!refresher) {
                this.pop = this.pubFilters[0]
                this.type = this.typeFilters[0]
            }

            this.getMaps(this.pop, this.type, refresher, 0)

        }).catch(error => {
            console.log("Unable to load content")
            this.errorLoading = true;
            this.maps = []
            
            if(refresher) {
                refresher.complete();
            }
        });
      };

    ionViewDidEnter() {
        // Track page - Google Analytics
        this.ga.trackView('Explore');
        console.log("Tracking Explore")
    }

    ionViewDidLoad() {
        this.loadAndScroll = Observable.merge(
            this.content.ionScroll,
            this.contentLoaded
        );
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
        }, 150);
    }

    searchQuery() {
      const val = this.searchTerm;
    
      if (val && val.trim() != '') {
        this.navCtrl.parent.parent.push(SearchResultsPage, {
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
            this.history = JSON.parse(val).searches
            console.log(this.history)
        });
    }
    getSuggestions(query) {
        this.serverProvider.getAutocomplete(query).then(data => {
             this.suggestions = data['results']
             this.history = []
        }).catch(error => { return []});
    }
    suggestionClicked(suggestion) {
        this.searchTerm = suggestion

        this.searchQuery()
    }
    
    openSettings() {
        this.navCtrl.push(SettingsPage, {})
    }

    refresh(refresher) {
        this.getMaps(this.pop, this.type, refresher, 0)
    }

    getMaps(pubFilter, typeFilter, refresher, page) {
        this.page = page;
        if(!refresher) {
            this.showLoading = true;
        }

        this.content.scrollTo(0, 5, 0)
        this.serverProvider.getFiltered(pubFilter, typeFilter, new Date().getTime(), page)
            .then(data => {
                this.maps = data['results']
                this.total_pages = data['total_pages']
                console.log(this.total_pages)
                this.showLoading = false;
                this.errorLoading = false;
                
                setTimeout(() => {
                    console.log("loaded")
                    //this.contentLoaded.next();
                }, 500);

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
                
            }).catch(error => {
                console.log("Unable to load content")
                this.errorLoading = true;
                this.maps = []

                if(refresher) {
                    refresher.complete();
                }
            });
            
    }
    getMoreMaps(infiniteScroll) {
        this.page = this.page += 1

         this.serverProvider.getFiltered(this.pop, this.type, new Date().getTime(), this.page)
            .then(data => {
                for(let map of data['results']) {
                    if(this.type != "All") {
                        map['typesToShow'] = [this.type]
                    } else {
                        map['typesToShow'] = map['types']
                    }
                    this.maps.push(map);
                    console.log(map)
                }
                infiniteScroll.complete();
            });

    }

    mapClicked(map, addToViews) {
        this.ga.trackEvent('Engagements', "Explore", map['name']);
        this.navCtrl.parent.parent.push(MapDetailsPage, {
            'map_data': map,
            'add_to_views': addToViews
          }) 
    }
}
