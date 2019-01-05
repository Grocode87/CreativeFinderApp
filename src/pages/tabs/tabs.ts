import { Component } from '@angular/core';

import { ExplorePage } from '../explore/explore';
import { HomePage } from '../home/home';
import { MyListPage } from '../my-list/my-list';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = ExplorePage;
  tab3Root = MyListPage;

  constructor() {

  }
}
