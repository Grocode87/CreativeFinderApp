import { Component } from '@angular/core';
import { IonicPage, ToastController, ModalController, NavController, NavParams } from 'ionic-angular';
import { AppState} from "../../app/app.global";
import { Storage } from '@ionic/storage';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Events } from 'ionic-angular';

//import { SocialSharing } from '@ionic-native/social-sharing';


/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  darkToggle:any;
  layoutToggle:any;
  // this is the complete list of currently supported params you can pass to the plugin (all optional)

  constructor(private toastCtrl: ToastController, public iab: InAppBrowser, public storage: Storage, public global: AppState, public modalCtrl : ModalController, public navCtrl: NavController, public navParams: NavParams, public events: Events) {
    storage.get('theme').then((val) => {
      if(val) {
        if(val == 'dark-theme') {
          this.darkToggle = true;
        }
      } else {
        storage.set('theme', '')
      }
    });
    storage.get('layout').then((val) => {
      if(val) {
        if(val == 'compact') {
          this.layoutToggle = true;
        }
      } else {
        storage.set('layout', '')
      }
    });
  }

  toggleDark(event) {
    console.log(event.checked)

    if(event.checked) {
      this.global.set('theme', 'dark-theme')
      this.storage.set('theme', 'dark-theme')
    } else {
      this.global.set('theme', '')
      this.storage.set('theme', '')
    }
  }
  toggleLayout(event) {
    var newVal = ''
    if(event.checked) {
        newVal = 'compact'
    }
    this.storage.set('layout', newVal)

    this.events.publish('layoutUpdated', newVal);
  }
  openFeedback() {
    this.iab.create('https://creativefinder.wufoo.com/forms/zzwizl801wddz3/');
  }
  /*share() {
    this.socialSharing.share("Creative Finder - The best place to find Fortnite Creative Codes", null, null, "https://bit.ly/2BieoNv").then(() => {
      this.presentToast("Shared succesfully")
    }).catch((e) => {
      // Error!
    });
  }*/
  openPP() {
      this.iab.create('http://cgrob10.pythonanywhere.com/static/privacy_policy.html');
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
