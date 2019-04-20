import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { ServerProvider } from '../../providers/server/server'

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
  maps: any = []
  numMaps = 0;
  totalViews = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams, public serverProvider: ServerProvider) {
        var creatorData = navParams.get('creator')
        this.img = creatorData['img_url']
        this.name = creatorData['name']

        this.serverProvider.getCreator(this.name).then(data => {
            var results = data['results']

            this.maps = results['maps']
            this.numMaps = results['num_maps']
            this.totalViews = results['total_map_views']
        })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreatorDetailsPage');
  }

}
