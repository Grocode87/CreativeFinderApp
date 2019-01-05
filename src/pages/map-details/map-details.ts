import { Component, NgZone, ChangeDetectorRef } from '@angular/core';
import { ToastController, IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { ServerProvider } from '../../providers/server/server'
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Storage } from '@ionic/storage';


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
    saved: any = false

  constructor(public ref: ChangeDetectorRef, public navCtrl: NavController, public events: Events, public iab: InAppBrowser, public navParams: NavParams, public serverProvider: ServerProvider, public storage: Storage, private toastCtrl: ToastController) {
        
        
        this.map = navParams.get('map_data')
        let addToViews = navParams.get('add_to_views')
        console.log(addToViews)
        
        storage.get('saved_maps').then((val) => {
            console.log(val)
            if(val) {
                let maps_obj = JSON.parse(val).maps

                for(let i = 0; i < maps_obj.length; i++) {
 
                    if(maps_obj[i]['name'] == this.map.name){
                        this.saved = true
                    }
                }
            } else {
               this.storage.set('saved_maps', JSON.stringify({"maps":[this.map]}));
            }
        });
      console.log(this.map)

      // Get additional maps made by creator
      this.serverProvider.getMapsFromCreator(this.map.id, this.map.creator, addToViews)
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

  mapClicked(map, addToViews) {
      console.log(map)
        this.navCtrl.push(MapDetailsPage, {
            'map_data': map,
            'add_to_views': addToViews
          }).then(() => {
              let index = this.navCtrl.getActive().index;
              this.navCtrl.remove(index - 1)
          });
    }

    visitMapLink() {
        this.iab.create('https://epicgames.com/fn/' + this.map.code);
    }

    save() {
        this.storage.get('saved_maps').then((val) => {
            if(val) {
                let new_obj = JSON.parse(val)
                new_obj.maps.push(this.map)

                this.storage.set('saved_maps', JSON.stringify(new_obj));
                this.ref.detectChanges();
                this.events.publish('maps:changed');
            } else {
            }
        });
        this.saved = true;
        this.events.publish('maps:changed');
        this.presentToast("Bookmarked map")
    }

    unsave() {
        this.storage.get('saved_maps').then((val) => {
            if(val) {
                let maps_obj = JSON.parse(val)

                for(let i = 0; i < maps_obj.maps.length; i++) {
                    if(maps_obj.maps[i]['name'] == this.map.name){
                        maps_obj.maps.splice(i, 1);
                        this.storage.set('saved_maps', JSON.stringify(maps_obj));
                        this.saved = false;
                        this.ref.detectChanges();
                        this.events.publish('maps:changed');
                    }
                }
            }
        });
        this.presentToast("Bookmark deleted")
    }

    presentToast(msg) {
        let toast = this.toastCtrl.create({
            message: msg,
            duration: 1500,
            position: 'bottom'
        });

        toast.onDidDismiss(() => {
            console.log('Dismissed toast');
        });

        toast.present();
}
}
