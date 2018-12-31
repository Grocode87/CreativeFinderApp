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
    otherMaps: any;
    relatedMaps: any;


  constructor(public navCtrl: NavController, public iab: InAppBrowser, public navParams: NavParams, public serverProvider: ServerProvider) {
      this.map = navParams.get('map_data')

      console.log(this.map)

      // Get additional maps made by creator
      this.serverProvider.getMapsFromCreator(this.map.id, this.map.creator, true)
        .then(data => {
            
            console.log(data)
            let results = data['creator_maps']
            let tempMaps = []
            results.forEach( (result) => {
                if(result.name != this.map.name) {
                    tempMaps.push(result)
                }
            });

            if(tempMaps.length > 0) {
                this.otherMaps = tempMaps;
            } else {
                this.otherMaps = []
            }
            this.relatedMaps = data['related_maps']
        });

  }

  mapClicked(map) {
      console.log(map)
        this.navCtrl.push(MapDetailsPage, {
            'map_data': map
          }).then(() => {
              let index = this.navCtrl.getActive().index;
              this.navCtrl.remove(index - 1)
          });
    }

    visitMapLink() {
        this.iab.create('https://epicgames.com/fn/' + this.map.code);
    }
}
