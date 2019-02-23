import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
declarations: [
    HomePage
],
imports: [
    IonicPageModule.forChild(HomePage),
    LazyLoadImageModule,
    ComponentsModule
],
exports: [
    HomePage
]
})
export class HomePageModule {}