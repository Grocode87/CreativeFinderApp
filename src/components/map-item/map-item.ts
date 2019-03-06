import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import { GoogleAnalytics } from '@ionic-native/google-analytics/';

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

  constructor(public navCtrl: NavController, public ga: GoogleAnalytics) {}
  ngAfterViewInit() {
      console.log(this.map)
  }

  mapClicked() {
    this.ga.trackEvent('Engagements', this.source, this.map.name);

    //if("maps")dw
    this.navCtrl.push('MapDetailsPage', {
        'map_data': this.map,
        'add_to_views': true
    })
  }
}