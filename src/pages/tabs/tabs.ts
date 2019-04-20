import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavParams, NavController, Events, Tabs } from 'ionic-angular';

@IonicPage()
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = 'HomePage';
  tab2Root = 'ExplorePage';
  tab3Root = 'MyListPage';

  tabParams = { id: 1 };

  @ViewChild("tabs") tabs: Tabs;

  last_category: any;

  constructor(public navParams: NavParams, public navCtrl: NavController, public events: Events) {
    this.events.subscribe('view:category', (category) => {
        console.log("switching")
        this.last_category = category;
        this.tabs.select(1);
        this.tabParams.id = 10;
        this.events.publish('set:filters', category);
    });

    this.events.subscribe('explore:loaded', () => {
        if(this.last_category) {
        console.log("triggering loaded?")
        this.events.publish('set:filters', this.last_category);
        this.last_category = null;
        }
    });
  }
}
