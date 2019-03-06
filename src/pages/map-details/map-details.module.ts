import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MapDetailsPage } from './map-details';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { ComponentsModule } from '../../components/components.module' 
 
@NgModule({
declarations: [
    MapDetailsPage,
],
imports: [
    IonicPageModule.forChild(MapDetailsPage),
    LazyLoadImageModule,
    ComponentsModule
],
exports: [
    MapDetailsPage
]
})
export class MapDetailsPageModule {}