import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { ServerProvider } from '../../providers/server/server'
import { GoogleAnalytics } from '@ionic-native/google-analytics/';

/**
 * Generated class for the CreatorDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-creator-details',
  templateUrl: 'creator-details.html',
})
export class CreatorDetailsPage {

  @ViewChild(Content) content: Content;

  img: any;
  name: any;
  maps: any;
  numMaps;
  totalViews;

  errorLoading = false;

  constructor(public navCtrl: NavController, public ga: GoogleAnalytics, public navParams: NavParams, public serverProvider: ServerProvider) {
        var creatorData = navParams.get('creator')

        console.log(creatorData)
        if(typeof creatorData === 'string') {
            this.name = creatorData;
        } else {
            this.name = creatorData['name']
        }

        this.getCreator()
  }

  getCreator() {
    this.serverProvider.getCreator(this.name).then(data => {
        this.errorLoading = false;
        var results = data['results']

        this.img = results['img_url']
        this.maps = results['maps']
        this.numMaps = results['num_maps']
        this.totalViews = results['total_map_views']
    }).catch(error => { 
        this.errorLoading = true;
    });
  }

  ionViewDidLoad() {}

  ionViewDidEnter() {
    this.ga.trackView('Creator Details');
  }

  tryAgain() {
      this.getCreator()
  }

}
