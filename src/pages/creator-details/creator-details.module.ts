import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreatorDetailsPage } from './creator-details';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    CreatorDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(CreatorDetailsPage),
    ComponentsModule
  ],
})
export class CreatorDetailsPageModule {}
