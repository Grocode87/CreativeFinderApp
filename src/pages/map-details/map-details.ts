import { ViewChild, Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, Platform, PopoverController, Content, AlertController, ActionSheetController, ToastController, NavController, NavParams, Events } from 'ionic-angular';
import { ServerProvider } from '../../providers/server/server'
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Storage } from '@ionic/storage';
import { GoogleAnalytics } from '@ionic-native/google-analytics/';
import { AdMobFree, AdMobFreeBannerConfig } from '@ionic-native/admob-free';
import { SocialSharing } from '@ionic-native/social-sharing';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/interval';
import 'rxjs/add/observable/merge';
import { Subject } from 'rxjs/Subject';
import { DomSanitizer } from '@angular/platform-browser';


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

    imgs: any = ["http://cgrob10.pythonanywhere.com/static/4030-8390-4429-1.png","http://cgrob10.pythonanywhere.com/static/4030-8390-4429-2.png"]

    @ViewChild(Content) content: Content;

    contentLoaded: Subject<any> = new Subject();
    loadAndScroll: Observable<any>;

    errorLoading = false;
    popover: any;

    showingAlert = false;

    videoUrl: any;

  constructor(public popoverController: PopoverController,
              public ga: GoogleAnalytics,
              public admob: AdMobFree,
              public alertCtrl: AlertController, 
              public actionSheetCtrl: ActionSheetController, 
              public ref: ChangeDetectorRef, 
              public navCtrl: NavController, 
              public events: Events, 
              public iab: InAppBrowser, 
              public navParams: NavParams, 
              public serverProvider: ServerProvider,
              private socialSharing: SocialSharing,
              public storage: Storage,
              private toastCtrl: ToastController,
              public platform: Platform,
              public sanitizer: DomSanitizer) {

        this.map = navParams.get('map_data')
        let addToViews = navParams.get('add_to_views')

        storage.get('saved_maps').then((val) => {
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

      // Get creator maps and related maps
      this.getExtraMaps(true)

      };

    showPopover(event) {
        this.popover = this.popoverController.create('PopoverPage', {}, {cssClass: 'options-popover'})

        this.popover.present({
            ev: event
        });
    }

    getExtraMaps(addToViews) {
        this.serverProvider.getMapsFromCreator(this.map.id, this.map.creator, addToViews)
        .then(data => {
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
    }

    ionViewDidLoad() {
        console.log("View Did Load");
        this.loadAndScroll = Observable.merge(
            this.content.ionScroll,
            this.contentLoaded
        );
        this.events.subscribe('popover:report', () => {
            this.popover.dismiss()
            this.reportAlert()
        });
        this.events.subscribe('popover:share', () => {
            this.popover.dismiss()
            this.share()
        });

    }
    
    ionViewWillEnter() {
        console.log("will enter")
        this.showBanner()
         if(this.map.video ) {
            if(this.map.video.type == 'youtube') {
                this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl("https://www.youtube.com/embed/" + this.map.video.id);
            }
        }
    }
    ionViewWillLeave() {
        this.hideBanner()
        this.events.publish('map:clicked');
        this.videoUrl=null;
    }
    ionViewDidLeave() {
        this.events.unsubscribe('popover:report');
        this.events.unsubscribe('popover:share');
    }

    ionViewDidEnter() {
        // Track page - Google Analytics
        console.log("Tracking Map Details")
        this.ga.trackView('Map Details');

        this.ref.detectChanges();
    }


   presentActionSheet() {
    const actionSheet = this.actionSheetCtrl.create({
      cssClass: 'action-sheet-alert',
      title: 'Additional Actions',
      buttons: [
        {
          text: 'Report',
          role: 'report',
          icon: 'flag',
          handler: () => {
            console.log('Report clicked');
            this.reportAlert()
          }
        },
        {
          text: 'Share',
          role: 'share',
          icon: 'share',
          handler: () => {
            console.log('Share clicked');
            this.share()
          }
        }
      ]
    });
    actionSheet.present();
  }

  reportAlert() {
    this.alertCtrl.create({
        title: 'Report Map',
        cssClass: 'report-alert',
        inputs: [
            {
                type: 'radio',
                label: 'Spam or excess advertising',
                value: 'Spam or excess advertising',
                checked: false
            },
            {
                type: 'radio',
                label: 'Pornography or explicit material',
                value: 'Pornography or explicit material',
                checked: false
            },
            {
                type: 'radio',
                label: 'Hate speech or graphic violence',
                value: 'Hate speech or graphic violence',
                checked: false
            },
            {
                    type: 'radio',
                label: 'Harassment or bullying',
                value: 'Harrassment or bullying',
                checked: false
            },
            {
                type: 'radio',
                label: 'Other',
                value: 'other',
                checked: false
            }
        ],
        buttons: [
            {
                text:'Cancel'
            },
            {
                text: 'Report',
                handler: data => {
                    this.serverProvider.reportMap(this.map.id, data)
                    this.presentToast("Reported map, thanks for your feedback.")
                }
            }
        ]
    }).present();
  }
  
  share() {
    var msg = this.map.name + "  :  " + this.map.code + "\n\n" + this.map.desc + "\n\nFor this map and much more, download Creative Finder from the Google Play Store!"

    var options = {
        message: msg, // not supported on some apps (Facebook, Instagram)
        subject: 'Fortnite Creative Map - ' + this.map.name, // fi. for email
        files: [],
        url: 'http://bit.ly/creative-finder'
    };
    this.platform.ready().then(() => {
      this.socialSharing.shareWithOptions(options).then(() => {});
    });
  }

  mapClicked(map, addToViews) {
        this.ga.trackEvent('Engagements', "Related", map['name']);

        this.navCtrl.push('MapDetailsPage', {
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

                this.storage.set('saved_maps', JSON.stringify(new_obj)).then((val) => {
                    this.events.publish('maps:changed');
                    this.ref.detectChanges();
                });
            } else {
            }
        });
        this.saved = true;
        this.ga.trackEvent('Bookmarks', "Added", this.map['name']);
        this.presentToast("Bookmark added")
    }

    unsave() {
        this.storage.get('saved_maps').then((val) => {
            if(val) {
                let maps_obj = JSON.parse(val)

                for(let i = 0; i < maps_obj.maps.length; i++) {
                    if(maps_obj.maps[i]['name'] == this.map.name){
                        maps_obj.maps.splice(i, 1);
                        this.storage.set('saved_maps', JSON.stringify(maps_obj)).then((val) => {
                            this.events.publish('maps:changed');
                            this.ref.detectChanges();
                        });
                        this.saved = false;
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

    
    showBanner() {
        let bannerConfig: AdMobFreeBannerConfig = {
            id: "ca-app-pub-6794112313190428/7662762593",
            isTesting: false,
            autoShow: false
        };

        this.admob.banner.config(bannerConfig);
        this.admob.banner.prepare().then(() => {
            this.admob.banner.show()
        }).catch(e => console.log(e));
    }
    hideBanner() {
        this.admob.banner.hide().catch(e => console.log(e));
    }

    
    tryAgain() {
        this.errorLoading = false;
        this.getExtraMaps("false")
    }
}
