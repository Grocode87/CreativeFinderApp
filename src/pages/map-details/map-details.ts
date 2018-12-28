import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ServerProvider } from '../../providers/server/server'
import { InAppBrowser } from '@ionic-native/in-app-browser';

/**
 * Generated class for the MapDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-map-details',
  templateUrl: 'map-details.html',
})
export class MapDetailsPage {

    map: any;
    otherMaps: any = [];
    showOthers: any;

  constructor(public navCtrl: NavController, public iab: InAppBrowser, public navParams: NavParams, public serverProvider: ServerProvider) {
      this.map = navParams.get('map_data')
      this.showOthers = navParams.get('show_others')

      console.log(this.map)

      // Get additional maps made by creator
      this.serverProvider.getMapsFromCreator(this.map.creator)
        .then(data => {
            let results = data['results']
            let tempMaps = []
            results.forEach( (result) => {
                if(result.name != this.map.name) {
                    tempMaps.push(result)
                }
            });

            if(tempMaps.length > 0) {
                this.otherMaps = tempMaps;
            }
        });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapDetailsPage');
  }

  mapClicked(map) {
      console.log(map)
        this.navCtrl.push(MapDetailsPage, {
            'map_data': map,
            'show_others': false
          })
    }

    visitMapLink() {
        let browser = this.iab.create('https://epicgames.com/fn/' + this.map.code);
    }
}
