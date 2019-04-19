import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchResultsPage } from './search-results';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { ComponentsModule } from '../../components/components.module' 
import { VirtualScrollerModule } from 'ngx-virtual-scroller';
 
@NgModule({
declarations: [
    SearchResultsPage,
],
imports: [
    IonicPageModule.forChild(SearchResultsPage),
    LazyLoadImageModule,
    ComponentsModule,
    VirtualScrollerModule
],
exports: [
    SearchResultsPage
]
})
export class SearchResultsPageModule {}