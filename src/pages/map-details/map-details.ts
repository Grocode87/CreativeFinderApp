import { ViewChild, Component, ChangeDetectorRef } from '@angular/core';
import { Content, AlertController, ActionSheetController, ToastController, NavController, NavParams, Events } from 'ionic-angular';
import { ServerProvider } from '../../providers/server/server'
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Storage } from '@ionic/storage';
import { GoogleAnalytics } from '@ionic-native/google-analytics/';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/interval';
import 'rxjs/add/observable/merge';
import { Subject } from 'rxjs/Subject';

import { AdMobFree, AdMobFreeBannerConfig } from '@ionic-native/admob-free';
import { ThrowStmt } from '@angular/compiler';


/**
 * Generated class for the MapDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 

@Component({
  selector: 'page-map-details',
  templateUrl: 'map-details.html',
})
export class MapDetailsPage {

    map: any;
    otherMaps: any;
    relatedMaps: any;
    saved: any = false

    imgs: any = ["http://cgrob10.pythonanywhere.com/static/4030-8390-4429-1.png","http://cgrob10.pythonanywhere.com/static/4030-8390-4429-2.png"]

    @ViewChild(Content) content: Content;

    contentLoaded: Subject<any> = new Subject();
    loadAndScroll: Observable<any>;

    errorLoading = false;

  constructor(private admobFree : AdMobFree, 
              public ga: GoogleAnalytics, 
              public alertCtrl: AlertController, 
              public actionSheetCtrl: ActionSheetController, 
              public ref: ChangeDetectorRef, 
              public navCtrl: NavController, 
              public events: Events, 
              public iab: InAppBrowser, 
              public navParams: NavParams, 
              public serverProvider: ServerProvider, 
              public storage: Storage, 
              private toastCtrl: ToastController) {
                  
        this.map = navParams.get('map_data')
        let addToViews = navParams.get('add_to_views')
        
        this.showAds()
        
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
            this.ref.detectChanges();
        }).catch(error => {
            this.relatedMaps = []
            this.otherMaps = []
            this.errorLoading = true;
        });
      };

    ionViewDidLoad() {
        this.loadAndScroll = Observable.merge(
            this.content.ionScroll,
            this.contentLoaded
        );
    }
    
    ionViewDidEnter() {
        // Track page - Google Analytics
        console.log("Tracking Map Details")
        this.ga.trackView('Map Details');
    }

    ionViewWillLeave() {
        this.admobFree.banner.remove();
    }

   presentActionSheet() {
    const actionSheet = this.actionSheetCtrl.create({
      cssClass: 'action-sheet-alert',
      title: '',
      buttons: [
        {
          text: 'Report',
          role: 'report',
          icon: 'flag',
          handler: () => {
            console.log('Report clicked');
            this.reportAlert()
          }
        }
      ]
    });
    actionSheet.present();
  }

  reportAlert() {
    let alert = this.alertCtrl.create({cssClass: 'report-alert'});
    alert.setTitle('Report Map');

    alert.addInput({
      type: 'radio',
      label: 'Spam or excess advertising',
      value: 'Spam or excess advertising',
      checked: false
    });
    alert.addInput({
      type: 'radio',
      label: 'Pornography or explicit material',
      value: 'Pornography or explicit material',
      checked: false
    });
    alert.addInput({
      type: 'radio',
      label: 'Hate speech or graphic violence',
      value: 'Hate speech or graphic violence',
      checked: false
    });
    alert.addInput({
      type: 'radio',
      label: 'Harassment or bullying',
      value: 'Harrassment or bullying',
      checked: false
    });
    alert.addInput({
      type: 'radio',
      label: 'Other',
      value: 'other',
      checked: false
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'Report',
      handler: data => {
            this.serverProvider.reportMap(this.map.id, data)
            this.presentToast("Reported map, thanks for your feedback.")
      }
    });
    alert.present();
  }

  mapClicked(map, addToViews) {
        this.ga.trackEvent('Engagements', "Related", map['name']);

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
        this.ga.trackEvent('Bookmarks', "Added", this.map['name']);
        this.events.publish('maps:changed');
        this.presentToast("Bookmark added")
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
        this.ga.trackEvent('Bookmarks', "Deleted", this.map['name']);
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
    
    showAds(){
        const bannerConfig: AdMobFreeBannerConfig = {
            isTesting: true,
            autoShow: true
        };
        this.admobFree.banner.config(bannerConfig);

        this.admobFree.banner.prepare()
        .then(() => {
            // banner Ad is ready
            // if we set autoShow to false, then we will need to call the show method here
        })
        .catch(e => console.log(e));    
    }
}
