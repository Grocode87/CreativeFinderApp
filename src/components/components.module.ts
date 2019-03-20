import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular'

import { MyHeaderComponent } from './my-header/my-header';
import { MapItemComponent } from './map-item/map-item';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { MapCarouselComponent } from './map-carousel/map-carousel';

@NgModule({
	declarations: [MyHeaderComponent,
    MapItemComponent,
    MapCarouselComponent],
	imports: [IonicModule,LazyLoadImageModule],
	exports: [MyHeaderComponent,
    MapItemComponent,
    MapCarouselComponent]
})
export class ComponentsModule {}
