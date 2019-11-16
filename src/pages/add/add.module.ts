import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddPage } from './add';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    AddPage,
  ],
  imports: [
    IonicPageModule.forChild(AddPage),
    LazyLoadImageModule,
    ComponentsModule
  ],
exports: [
    AddPage
]
})
export class AddPageModule {}
