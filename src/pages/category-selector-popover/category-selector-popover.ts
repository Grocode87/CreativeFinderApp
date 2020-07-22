import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the CategorySelectorPopoverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-category-selector-popover',
  templateUrl: 'category-selector-popover.html',
})
export class CategorySelectorPopoverPage {

  categories:any = ["PVP", "Explore", "Escape", "Obstacle Course", "Fun", "Other"]
  c_selected = [0,0,0,0,0,0]

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CategorySelectorPopoverPage');
  }

}
