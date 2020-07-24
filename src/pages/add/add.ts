import { ViewChild, Component } from '@angular/core';

import { IonicPage, NavController, Content, NavParams, AlertController, ModalController, LoadingController, ToastController } from 'ionic-angular';
import { trigger, transition, animate, style } from '@angular/animations'
import { FormControl, Validators  } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ActionSheetController } from 'ionic-angular';
import { ServerProvider } from '../../providers/server/server';



/**
 * Generated class for the AddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add',
  templateUrl: 'add.html',
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({transform: 'translateY(-50%)', opacity: '0%'}),
        animate('200ms ease-in', style({transform: 'translateY(0%)', opacity: '100%'}))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({transform: 'translateY(-50%)', opacity: '0%'}))
      ])
    ])
  ]
})
export class AddPage {
  
  @ViewChild(Content) content: Content;

  loading: any = false;
  currPage:any = 0
  code: any = "" 
  codeFormControl: any;
  codeSubmitAttempted: any = false;
  errorCode: any = "";

  showErrorHeader = false;
  errorHeaderText = ""

  loadSpinner: any;

  addedTypes: any = []
  categories:any = ["The Block", "PVP", "Hide-N-Seek", "Mini-Games", "Obstacle Course", "Race", "Training", "Remake", "Explore", "Escape", "Music", "Other"]
  c_selected = [0,0,0,0,0,0,0,0,0,0,0,0]
  

  images = []
  newImageOrder: any = []
  finalImageUrls = []
  imageReorder = false;
  mapData: any = [];
  
  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public alertCtrl: AlertController, 
              private modalCtrl: ModalController, 
              private camera: Camera,
              private actionSheetCtrl: ActionSheetController, 
              private serverProvider: ServerProvider,
              private loadingCtrl: LoadingController,
              private toastCtrl: ToastController) {

      this.codeFormControl = new FormControl('', Validators.compose([Validators.maxLength(14), Validators.minLength(14),Validators.pattern('^([0-9]{4})[-]([0-9]{4})[-]([0-9]{4})$'), Validators.required]));

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddPage');
  }

  nextPage() {
    this.currPage += 1;
    
  }
  lastPage() {
    this.currPage -= 1;
  }

  updatedCode(event) {
    console.log(event)

    if(this.code.length == 14) {
        this.code = this.code;
    } else if(this.code.length == 4 || this.code.length == 9) {
        
        this.code = this.code + '-'
    } else if(this.code.length == 5) {
        var codeLen = this.code.length

        if(this.code[this.code.length - 1] != "-") {
            var lastChar = this.code[this.code.length - 1]
            this.code = this.code.slice(0, this.code.length - 1) + "-" + this.code[this.code.length - 1]
            console.log(lastChar)
        }
    } else if(this.code.length == 10) {
        var codeLen = this.code.length

        if(this.code[this.code.length - 1] != "-") {
            let lastChar = this.code[this.code.length - 1]
            this.code = this.code.slice(0, codeLen - 1) + "-" + this.code[codeLen - 1]
            console.log(lastChar)
        }
    }
    
    console.log(/^([0-9]{4})[-]([0-9]{4})[-]([0-9]{4})$/.test(this.code));
  }
  submitCode() {
    this.loading = true;
    this.presentLoader()

    if(!this.codeFormControl.valid){
        this.loading = false;
        this.codeSubmitAttempted = true;
        this.errorCode = "Please enter a valid code";
        this.loadSpinner.dismiss()
    } else {
        // check to make sure that the code actually exists, if not, return error and go back to page
        this.serverProvider.getCodeData(this.code)
        .then(data => {
            console.log("loaded succesfully")
            console.log(data)
            if('error' in data) {
                console.log(data['error']['message']);
                this.loading = false;
                this.loadSpinner.dismiss();
                this.codeSubmitAttempted = true;
                this.errorCode = data['error']['message']
            } else {
                this.mapData = data['data'];
                this.addToImages(data['data']['img_url'])
                this.nextPage();
                this.loading = false;
                this.loadSpinner.dismiss();
            }
        }).catch(error => {
            this.loading = false;
            this.codeSubmitAttempted = true;
            this.errorCode = "Unknown error, please try again"
            this.loadSpinner.dismiss();
        });
    }
  }

  async presentPopover(ev: any) {
    let alert = this.alertCtrl.create();
    alert.setTitle('Select Categories');

    for (var index in this.categories) {
        var isChecked = false
        if(this.addedTypes.includes(this.categories[index])) {
            isChecked = true;
        }
        alert.addInput({
            type: 'checkbox',
            label: this.categories[index],
            value: this.categories[index],
            checked: isChecked
      });
    }

    alert.addButton('Cancel');
    alert.addButton({
      text: 'Okay',
      handler: data => {
        console.log('Checkbox data:', data);
        this.addedTypes = data
      }
    });
    alert.present();
  }
  removeType(type) {
    const index = this.addedTypes.indexOf(type, 0);
    if (index > -1) {
        this.addedTypes.splice(index, 1);
    }
  }

  startImageReorder() {
    if(this.images.length > 0) {
        if(this.imageReorder) {
            var numOrdered = 0
            this.newImageOrder.forEach( (order) => {
            if(order != -1) {
                numOrdered += 1;
            }
            });

            for(let i=0; i<this.newImageOrder.length; i++){
            if(this.newImageOrder[i] != -1) {
                this.images[i].order = this.newImageOrder[i]
            } else {
                this.images[i].order = numOrdered;
                numOrdered += 1;
            }
            }
            this.imageReorder = false
        } else {
            this.newImageOrder = []
            this.images.forEach( (image) => {
            this.newImageOrder.push(-1) 
            });


            this.imageReorder = true
        }
    }
  }

  editImageOrder(index) {
    console.log(index)
    var newOrder = -1
    for(let i=0; i<this.images.length; i++){
      var doesExist = false;
      this.newImageOrder.forEach((order) => {
          console.log("comparing newImageOrder: " + order + " to: " + i);
        if(order == i) {
            doesExist = true;
        }
        
      });
      if(!doesExist) {
        if(newOrder==-1) {
          newOrder = i;
          console.log()
        } else if(i < newOrder) {
          newOrder = i
        }
      }
    }
    

    var order = this.newImageOrder[index]
    if(order == -1) {
        this.newImageOrder[index] = newOrder
    } else {
        this.newImageOrder[index] = -1
    }
  }

  addToImages(imgUrl) {
      var imgOrder = this.images.length;
      var imgData = {
          'url': imgUrl,
          'order': imgOrder
      }
      this.images.push(imgData)
  }

  removeFromImages(imgUrl) {
      console.log("removing: " + imgUrl)
    var index = -1;
    for(let i=0; i<this.images.length; i++){
        console.log(this.images[i].url)
        if(this.images[i].url == imgUrl) {
            index = i;
        }
    }
    if(index != -1) {
        this.images.splice(index, 1);
    }

    //redo order
    index = 0
    this.images.forEach( (image) => {
        image.order = index;
        index += 1
    });

  }

  addImage(sourceType) {
    /** retrieves an image and sends it to crop modal */

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: sourceType
    }

    this.camera.getPicture(options).then((imageData) => {
      var myImage = 'data:image/jpeg;base64,' + imageData;
      var cropModal = this.modalCtrl.create('ImageCropModalPage', {'img': myImage})
      cropModal.present()

      cropModal.onDidDismiss(data => {
        console.log(data);
        if(data != null) {
          this.addToImages(data)
        }
      });
    });
  }
  

  removeImage(urlToRemove) {
    /* function that takes an image url and removes it 
    from the image url array, called when the delete button on an image is pressed*/
    this.removeFromImages(urlToRemove)
  }

  chooseImageAction() {
    /** present action sheet to choose image source - existing pictures or camera */
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Choose image source',
      buttons: [
        {
          text: 'Take a picture',
          icon: 'camera',
          handler: () => {
            this.addImage(1)
          }
        },{
          text: 'Use existing picture',
          icon: 'image',
          handler: () => {
            this.addImage(0)
          }
        }
      ]
    });
    actionSheet.present();
  }

  submitMapData() {
    /** Move to fianal review page
     *  - finish image reorder if not finished
     *  - create ordered image url array
     *  - make sure at least 1 image exists
     */
    if(this.images.length > 0) {
      if(this.addedTypes.length > 0) {
        if(this.imageReorder) {
            this.startImageReorder();
        }
        this.finalImageUrls = []
        for(let i=0;i<this.images.length;i++) {
          this.images.forEach((img) => {
            if(img.order == i) {
              this.finalImageUrls.push(img.url);
            }
          });
        }
        this.nextPage()

      } else {
        this.showErrorHeader = true;
        this.errorHeaderText = "Please add at least one category";
        setTimeout( () => {
          this.showErrorHeader = false;
        }, 4000);
      }
    } else {
      this.showErrorHeader = true;
      this.errorHeaderText = "Please add at least one image";
      setTimeout( () => {
        this.showErrorHeader = false;
      }, 4000);
    }
    
  }

  sendMap() {
    this.presentLoader()
    console.log(this.mapData)
    var imgUrls = []
    this.finalImageUrls.forEach( (url) => {
        imgUrls.push(url)
    });
    var sendData = {
        'code': this.mapData.code,
        'name': this.mapData.title,
        'desc': this.mapData.desc,
        'imgs': imgUrls,
        'creator': this.mapData.creator,
        'video_id': this.mapData.video_id,
        'types': this.addedTypes
    }
    console.log(sendData)
    
    this.serverProvider.uploadMap(sendData)
        .then(data => {
            console.log("sent succesfully")
            console.log(data)
            this.loadSpinner.dismiss();
            this.navCtrl.pop()
            this.presentToast('Successfully submitted map, thank you!')
        }).catch(error => {
            this.loadSpinner.dismiss();
            this.showErrorHeader = true;
            this.errorHeaderText = "Unable to submit map, please try again";
            setTimeout( () => {
                this.showErrorHeader = false;
            }, 4000);
        });
  }

  presentLoader() {
    this.loadSpinner = this.loadingCtrl.create({
      spinner: 'crescent'
    });
    this.loadSpinner.present();
  }

  presentToast(msg) {
        let toast = this.toastCtrl.create({
            message: msg,
            duration: 3500,
            position: 'bottom'
        });

        toast.onDidDismiss(() => {
            console.log('Dismissed toast');
        });

        toast.present();
    }

}
