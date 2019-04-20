import { ViewChild, Component } from '@angular/core';
import { IonicPage, VirtualScroll, Content, Searchbar, NavController, NavParams, Events } from 'ionic-angular';
import { ServerProvider } from '../../providers/server/server'
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
@IonicPage()
@Component({
  selector: 'page-explore',
  templateUrl: 'explore.html',
})
export class ExplorePage {

    maps: any = [];
    showLoading: any = true;

    pop: any;
    type: any;

    pubFilters: any = [];
    typeFilters: any = ['1', '2'];

    @ViewChild(Content) content: Content;
    //@ViewChild(VirtualScroll, { read: VirtualScroll }) virtualScroll: VirtualScroll;

    errorLoading = false;

    page = 0
    total_pages = 0

    do_set_maps = true;

    constructor(public storage: Storage, public ga: GoogleAnalytics, public navCtrl: NavController, public navParams: NavParams, public serverProvider: ServerProvider, public events: Events) {
        this.getFilterTypes(null)

        this.events.subscribe('set:filters', (category) => {
            this.do_set_maps = false;
            this.pop = 'Newest'
            this.type = category
            this.getMaps("Newest", category, 0, 0)
        });
        console.log("ready for loaded")
    }
    ngAfterViewInit() {
        this.events.publish('explore:loaded');
        this.content.ionScrollEnd.subscribe((event)=>{
            //this.virtualScroll.scrollUpdate(event)
        });
    }
 
    getFilterTypes(refresher) {
        /** Get the possible selection values from the server and set them */
        this.serverProvider.getFilterTypes()
        .then(data => {
            this.errorLoading = false;
            this.pubFilters = data['publishedFilters'];
            this.typeFilters = data['typeFilters'];

            if(this.do_set_maps) {
                if(!refresher) {
                    this.pop = this.pubFilters[0]
                    this.type = this.typeFilters[0]
                }
                this.getMaps(this.pop, this.type, refresher, 0)
            } else {
                this.do_set_maps = true;
            }

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

    refresh(refresher) {
        this.getMaps(this.pop, this.type, refresher, 0)
    }
    getMaps(pubFilter, typeFilter, refresher, page) {
        console.log('getting maps with data: ' + pubFilter + " - " + typeFilter)
        this.page = page;
        this.content.scrollTo(0, 0, 0)

        setTimeout(() => {
        if(!refresher) {
            this.showLoading = true;
        }

        this.serverProvider.getFiltered(pubFilter, typeFilter, new Date().getTime(), page)
            .then(data => {
                this.maps = data['results']
                this.total_pages = data['total_pages']
                
                setTimeout(() => {
                    this.showLoading = false;
                    this.errorLoading = false;
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
                }, 0);
            
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

    
    tryAgain() {
        this.errorLoading = false;
        this.getFilterTypes(null)
    }
}
