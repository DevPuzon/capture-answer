import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { Subject, takeUntil } from 'rxjs';
import { AppStates } from 'src/app/core/app-states';
import { HistoryData } from 'src/app/models/history.model';
import { CommonUseService } from 'src/app/services/common-use.service';
import { CaptureChatComponent } from 'src/app/shared/components/capture-chat/capture-chat.component';
import { CaptureResultComponent } from 'src/app/shared/components/capture-result/capture-result.component';
@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit,OnDestroy {
  histories : HistoryData[] = [];
  destroy$ = new Subject<void>();
  isShowNoData = false;

  constructor(private commonUseService: CommonUseService,
              private alertController:AlertController,
              private appStates : AppStates,
              private loadingController:LoadingController,
              private modalController : ModalController) { }

  ngOnInit() {
    this.init();
    this.checkData();
  }

  async init() {
    this.appStates.listenHistories().pipe(takeUntil(this.destroy$))
    .subscribe((histories:HistoryData[])=>{
      this.histories = histories.sort((a, b) => b.date - a.date);
      this.checkData();
    })

    const histories = this.appStates.getHistories();
    if(histories.length <= 0){
      const load = await this.loadingController.create({message:"Please wait..."});
      await load.present();
      await this.commonUseService.getHistories();
      await load.dismiss();
    }
  }

  checkData(){
    setTimeout(()=>{
      this.isShowNoData = this.histories.length <= 0 ;
    },2000);
  }
  async onClickItem(history:HistoryData){
    const modal = await this.modalController.create({
      id:"capture-chat",
      component:CaptureChatComponent,
      componentProps:{
        captureId:history.captureId,
        capturedImage:history.image
      }
    })
    await modal.present();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async onDelete(captureId:string){
    const alert = await this.alertController.create(
      {
        header:"Delete Confirmation",
        message:"Are you sure you want to delete this item?",
        buttons:[
          {
            text:"Cancel"
          },
          {
            text:"Delete",
            role:"destructive",
            handler:async ()=>{
              const load = await this.loadingController.create({message:"Please wait..."});
              await load.present();
              await this.commonUseService.deleteHistoryItem(captureId);
              await load.dismiss();
            }
          }
        ]
      }
    )
    await alert.present();
  }
}
