import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MapDetailsPage } from './map-details';
import { LazyLoadImageModule } from 'ng-lazyload-image';
 
@NgModule({
declarations: [
    MapDetailsPage,
],
imports: [
    IonicPageModule.forChild(MapDetailsPage),
    LazyLoadImageModule
],
exports: [
    MapDetailsPage
]
})
export class MapDetailsPageModule {}