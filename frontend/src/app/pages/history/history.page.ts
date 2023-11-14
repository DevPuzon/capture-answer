import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
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
              private modalController : ModalController) { }

  ngOnInit() {
    this.init();
    this.checkData();
  }

  async init() {
    this.appStates.historiesListen().pipe(takeUntil(this.destroy$))
    .subscribe((histories:HistoryData[])=>{
      this.histories = histories.sort((a, b) => b.date - a.date);
      this.checkData();
    })
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
              await this.commonUseService.deleteHistoryItem(captureId);
            }
          }
        ]
      }
    )
    await alert.present();
  }
}
