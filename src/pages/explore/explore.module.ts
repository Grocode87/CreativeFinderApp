import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ExplorePage } from './explore';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { ComponentsModule } from '../../components/components.module' 
import { VirtualScrollerModule } from 'ngx-virtual-scroller';
 
@NgModule({
declarations: [
    ExplorePage,
],
imports: [
    IonicPageModule.forChild(ExplorePage),
    LazyLoadImageModule,
    ComponentsModule,
    VirtualScrollerModule
],
exports: [
    ExplorePage
]
})
export class ExplorePageModule {}