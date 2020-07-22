import { Component } from '@angular/core';

/**
 * Generated class for the CropModalComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'crop-modal',
  templateUrl: 'crop-modal.html'
})
export class CropModalComponent {

  text: string;

  constructor() {
    console.log('Hello CropModalComponent Component');
    this.text = 'Hello World';
  }

}
