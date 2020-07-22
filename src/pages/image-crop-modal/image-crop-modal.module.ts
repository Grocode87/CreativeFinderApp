import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ImageCropModalPage } from './image-crop-modal';
import { AngularCropperjsModule } from 'angular-cropperjs';

@NgModule({
  declarations: [
    ImageCropModalPage,
  ],
  imports: [
    IonicPageModule.forChild(ImageCropModalPage),
    AngularCropperjsModule
  ],
})
export class ImageCropModalPageModule {}
