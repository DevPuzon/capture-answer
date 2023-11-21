import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalController } from '@ionic/angular';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { AppStates } from 'src/app/core/app-states';
import { CommonUseUtil } from "src/app/core/utils/common-use.util";
import { CaptureResultComponent } from '../capture-result/capture-result.component';

@Component({
  selector: 'ocr-crop-image',
  templateUrl: './crop-image.component.html',
  styleUrls: ['./crop-image.component.scss']
})
export class CropImageComponent  implements OnInit,OnDestroy {
  @Input('captureId') captureId : string = '';
  @Input('capturedImage') capturedImage : string = '';
  croppedImage:any = '';
  constructor(private modalController:ModalController,
              private commonUseUtil:CommonUseUtil,
              private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.commonUseUtil.setIsStartCamera(false);
    if(!this.captureId){
      throw new Error("captureId required");
    }
    this.croppedImage = this.capturedImage;
  }

  async onContinue(){
    const modal = await this.modalController.create({
      component:CaptureResultComponent,
      componentProps:{
        captureId:this.captureId,
        capturedImage:this.croppedImage
      }
    })

    this.modalController.dismiss();
    await modal.present();
  }

  onBack(){
    this.commonUseUtil.setIsStartCamera(true);
    this.modalController.dismiss();
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    // console.log(this.croppedImage,event);
  }

  ngOnDestroy(): void {
    this.commonUseUtil.setIsStartCamera(true);
  }
}
