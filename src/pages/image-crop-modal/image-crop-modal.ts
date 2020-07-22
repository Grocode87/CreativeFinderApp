import { Component, ViewChild } from '@angular/core'
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { AngularCropperjsComponent } from 'angular-cropperjs';

/**
 * Generated class for the ImageCropModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-image-crop-modal',
  templateUrl: 'image-crop-modal.html',
})
export class ImageCropModalPage {
  @ViewChild('angularCropper') public angularCropper: AngularCropperjsComponent;
  cropperOptions: any;
  croppedImage = null;
 
  myImage = "/assets/imgs/crop-test.png";

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
      this.cropperOptions = {
      dragMode: 'crop',
      aspectRatio: 540/300,
      autoCrop: true,
      movable: true,
      zoomable: true,
      scalable: true,
      autoCropArea: 1,
    };

    // get the image to crop 
    this.myImage = navParams.get('img')
    console.log(this.myImage)
  }

  ionViewDidLoad() { }

  save() {
    /** save cropped image and return to map submit page with image data */
    let croppedImgB64String: string = this.angularCropper.cropper.getCroppedCanvas().toDataURL('image/jpeg', (100 / 100));
    this.croppedImage = croppedImgB64String;

    this.viewCtrl.dismiss(this.croppedImage);
  }

  cancel() {
    /** return to map submit page with no image data */
    this.viewCtrl.dismiss(null);
  }

  cropperTouchStart(event){
    /** fixes bug in cropper where the scaling of the box is extremely glitchy */
    event.stopPropagation();
    event.preventDefault(); //Most important
  }

}
