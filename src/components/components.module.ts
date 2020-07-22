import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular'

import { MyHeaderComponent } from './my-header/my-header';
import { MapItemComponent } from './map-item/map-item';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { MapCarouselComponent } from './map-carousel/map-carousel';
import { CropModalComponent } from './crop-modal/crop-modal';

@NgModule({
	declarations: [MyHeaderComponent,
    MapItemComponent,
    MapCarouselComponent,
    CropModalComponent,
    ],
	imports: [IonicModule,LazyLoadImageModule],
    entryComponents: [
        
    ],
	exports: [MyHeaderComponent,
    MapItemComponent,
    MapCarouselComponent,
    CropModalComponent,
    ]
})
export class ComponentsModule {}
