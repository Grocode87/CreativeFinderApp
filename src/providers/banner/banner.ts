import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AdMobFree, AdMobFreeBannerConfig } from '@ionic-native/admob-free';

/*
  Generated class for the BannerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class BannerProvider {

  constructor(public http: HttpClient, public admob: AdMobFree) {
     let bannerConfig: AdMobFreeBannerConfig = {
            isTesting: true, // Remove in production
            autoShow: false
            //id: Your Ad Unit ID goes here
        };
        console.log("creating ad")
        this.admob.banner.config(bannerConfig);
        this.admob.banner.prepare().then(() => {}).catch(e => console.log(e));
  }

  showAd() {
      this.admob.banner.show()
  }

  hideAd() {
      this.admob.banner.hide()
  }

}
