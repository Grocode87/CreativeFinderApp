import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyListPage } from './my-list';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { ComponentsModule } from '../../components/components.module' 
 
@NgModule({
declarations: [
    MyListPage,
],
imports: [
    IonicPageModule.forChild(MyListPage),
    LazyLoadImageModule,
    ComponentsModule
],
exports: [
    MyListPage
]
})
export class MyListPageModule {}