import { ViewChild, Component } from '@angular/core';
import { IonicPage, Content, Searchbar, NavController, NavParams, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { GoogleAnalytics } from '@ionic-native/google-analytics/';

import { ServerProvider } from '../../providers/server/server'

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/interval';
import 'rxjs/add/observable/merge';
import { Subject } from 'rxjs/Subject';


/**
 * Generated class for the MyListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-my-list',
  templateUrl: 'my-list.html',
})


export class MyListPage {

    maps: any;

    @ViewChild(Content) content: Content;

    contentLoaded: Subject<any> = new Subject();
    loadAndScroll: Observable<any>;

    constructor(public ga: GoogleAnalytics, public navCtrl: NavController, public events: Events, public navParams: NavParams, public storage: Storage, public serverProvider: ServerProvider) {
        
        events.subscribe('maps:changed', () => {
            this.updateMaps()
        });
        
        this.updateMaps()
    }
    
    ionViewDidLoad() {
        this.loadAndScroll = Observable.merge(
            this.content.ionScroll,
            this.contentLoaded
        );
        
    } 

    ionViewDidEnter() {
        // Track page - Google Analytics
        this.ga.trackView('Bookmarks');
        
        this.updateMaps()
    }

  updateMaps() {
      this.storage.get('saved_maps').then((val) => {
            if(val) {
                this.maps = JSON.parse(val).maps
            } else {
                this.maps = []
            }
        });
  }

   mapClicked(map, addToViews) {
        this.ga.trackEvent('Engagements', "Bookmarks", map['name']);
        console.log(addToViews)
        this.navCtrl.parent.parent.push('MapDetailsPage', {
            'map_data': map,
            'add_to_views': addToViews
          }) 
    }

  delete(map) {
        this.storage.get('saved_maps').then((val) => {
            if(val) {
                this.ga.trackEvent('Bookmarks', "Deleted", map['name']);
                let maps_obj = JSON.parse(val)

                for(let i = 0; i < maps_obj.maps.length; i++) {
                    if(maps_obj.maps[i]['name'] == map['name']) {
                        maps_obj.maps.splice(i, 1);
                        this.storage.set('saved_maps', JSON.stringify(maps_obj)).then((val) => {
                            this.events.publish('maps:changed');
                        });
                    }
                }
            }
        });
    }
}
