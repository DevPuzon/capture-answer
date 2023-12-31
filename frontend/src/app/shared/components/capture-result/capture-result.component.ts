import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { CommonUseUtil } from "src/app/core/utils/common-use.util";
import { HistoryData } from 'src/app/models/history.model';
import { CommonUseService } from 'src/app/services/common-use.service';
import { CaptureChatComponent } from '../capture-chat/capture-chat.component';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-capture-result',
  templateUrl: './capture-result.component.html',
  styleUrls: ['./capture-result.component.scss'],
})
export class CaptureResultComponent  implements OnInit,OnDestroy {
  @Input('capturedImage') capturedImage : string = '';
  @Input('captureId') captureId : string = '';

  constructor(
    private commonUseUtil:CommonUseUtil,
    private chatService:ChatService,
    private loadingController:LoadingController,
    private commonUseService : CommonUseService,
    private modalController:ModalController) { }

  ngOnInit() {
    this.commonUseUtil.setIsStartCamera(false);
  }

  async onBack(){
    this.commonUseUtil.setIsStartCamera(true);
    await this.modalController.dismiss();
  }

  async onSendMessage(event:any){
    const { message } = event;
    const load  = await this.loadingController.create({message:"Please wait..."});
    await load.present();
    try{
      console.log("onSendMessage",event,message);
      const file = this.commonUseUtil.base64toFile(this.capturedImage,this.captureId.toString());
      const item:HistoryData = {
        captureId: this.captureId,
        text:message,
        image:'',
        date:new Date().getTime()
      }
      await this.commonUseService.setHistory(item,file);
      const { image } = await this.commonUseService.getHistoryItem(this.captureId);
      this.capturedImage = image;
      await this.chatService.sendMessageVision(this.captureId,message,image);
      await this.modalController.dismiss();
      await this.onOpenCaptureChat();
    }catch(ex){
      console.error(ex);
    }
    await load.dismiss();
  }

  async onOpenCaptureChat(){
    const modal = await this.modalController.create({
      id:"capture-chat",
      component:CaptureChatComponent,
      componentProps:{
        capturedImage:this.capturedImage,
        captureId:this.captureId,
        fromMainDashboard:true
      }
    })
    await modal.present();
  }

  ngOnDestroy(): void {
    this.commonUseUtil.setIsStartCamera(true);
  }
}
