import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular'

import { MyHeaderComponent } from './my-header/my-header';
import { MapItemComponent } from './map-item/map-item';
import { LazyLoadImageModule } from 'ng-lazyload-image';

@NgModule({
	declarations: [MyHeaderComponent,
    MapItemComponent],
	imports: [IonicModule,LazyLoadImageModule],
	exports: [MyHeaderComponent,
    MapItemComponent]
})
export class ComponentsModule {}
