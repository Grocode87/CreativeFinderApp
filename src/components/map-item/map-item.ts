import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import { GoogleAnalytics } from '@ionic-native/google-analytics/';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';

/**
 * Generated class for the MapItemComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'map-item',
  templateUrl: 'map-item.html'
})
export class MapItemComponent {

  @Input('map') map:any;
  @Input('doShowDesc') includeDesc: any = false;
  @Input('content') content: any;
  @Input('aSource') source: any = "Other";
  
  allowLargeItems: any = true;

  constructor(public navCtrl: NavController, public ga: GoogleAnalytics, public storage: Storage, public events: Events) {
    storage.get('layout').then((val) => {
      if(val && val=='compact') {
        if(val == 'compact') {
          this.allowLargeItems = false;
        }
      }
    });

    events.subscribe('layoutUpdated', (val) => {
        if(val=='compact') {
            this.allowLargeItems = false;
            console.log("not allowing large items")
        } else if(val=='') {
            this.allowLargeItems = true;
            console.log("allowing large items")
        }
    });
  }

  mapClicked() {
    this.ga.trackEvent('Engagements', this.source, this.map.name);

    if(this.navCtrl.parent) {
        this.navCtrl.parent.parent.push('MapDetailsPage', {
            'map_data': this.map,
            'add_to_views': true
        })
    } else {
        this.navCtrl.push('MapDetailsPage', {
            'map_data':  this.map,
            'add_to_views': true
        })
    }
  }
  mapClickedCollection(map) {
    this.ga.trackEvent('Engagements', "Collection", map.name);

    if(this.navCtrl.parent) {
        this.navCtrl.parent.parent.push('MapDetailsPage', {
            'map_data': map,
            'add_to_views': true
        })
    } else {
        this.navCtrl.push('MapDetailsPage', {
            'map_data':  map,
            'add_to_views': true
        })
    }
  }
}