import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CategorySelectorPopoverPage } from './category-selector-popover';

@NgModule({
  declarations: [
    CategorySelectorPopoverPage,
  ],
  imports: [
    IonicPageModule.forChild(CategorySelectorPopoverPage),
  ],
})
export class CategorySelectorPopoverPageModule {}
