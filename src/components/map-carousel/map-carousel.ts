import { Component, Input } from '@angular/core';
import { GoogleAnalytics } from '@ionic-native/google-analytics/';
import { NavController } from 'ionic-angular';

/**
 * Generated class for the MapCarouselComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'map-carousel',
  templateUrl: 'map-carousel.html'
})
export class MapCarouselComponent {

  @Input('title') title: string;
  @Input('maps') mapList: any;
  @Input('fromCreatorPage') fromCreatorPage: any = false;

  constructor(public navCtrl: NavController, public ga: GoogleAnalytics) {}

  mapClicked(map) {
    this.ga.trackEvent('Engagements', "Related", map.name);

    if(this.navCtrl.parent) {
        this.navCtrl.parent.parent.push('MapDetailsPage', {
            'map_data': map,
            'add_to_views': true,
            'from_creator_page': this.fromCreatorPage
        })
    } else {
        this.navCtrl.push('MapDetailsPage', {
            'map_data': map,
            'add_to_views': true,
            'from_creator_page': this.fromCreatorPage
        })
    }
  }

}
