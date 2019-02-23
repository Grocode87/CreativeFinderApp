import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchResultsPage } from './search-results';
import { LazyLoadImageModule } from 'ng-lazyload-image';
 
@NgModule({
declarations: [
    SearchResultsPage,
],
imports: [
    IonicPageModule.forChild(SearchResultsPage),
    LazyLoadImageModule
],
exports: [
    SearchResultsPage
]
})
export class SearchResultsPageModule {}