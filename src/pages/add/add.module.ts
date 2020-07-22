import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddPage } from './add';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { ComponentsModule } from '../../components/components.module';
import { IonicImageViewerModule } from 'ionic-img-viewer';

@NgModule({
  declarations: [
    AddPage
  ],
  imports: [
    IonicPageModule.forChild(AddPage),
    LazyLoadImageModule,
    ComponentsModule,
    IonicImageViewerModule
  ],
  entryComponents: [AddPage],
  exports: [
    AddPage,
  ]
})
export class AddPageModule {}
