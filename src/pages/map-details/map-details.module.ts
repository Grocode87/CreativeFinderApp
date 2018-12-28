import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MapDetailsPage } from './map-details';

@NgModule({
  declarations: [
    MapDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(MapDetailsPage),
  ],
})
export class MapDetailsPageModule {}
