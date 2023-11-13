import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subject, takeUntil } from 'rxjs';
import { AppStates } from 'src/app/core/app-states';
import { HistoryData } from 'src/app/models/history.model';
import { CommonUseService } from 'src/app/services/common-use.service';
import { OcrResultComponent } from 'src/app/shared/components/ocr-result/ocr-result.component';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit,OnDestroy {
  histories : HistoryData[] = [
    {
      "captureId":"232",
      "text":"lorem",
      "image":"https://images.saymedia-content.com/.image/t_share/MTc4MjUyODg2Mjk4ODYzMjEz/free-fun-100-question-quiz-3.png",
      "date":1699867355754
    },
    {
      "captureId":"232",
      "text":"lorem",
      "image":"https://images.saymedia-content.com/.image/t_share/MTc4MjUyODg2Mjk4ODYzMjEz/free-fun-100-question-quiz-3.png",
      "date":1699867355754
    },
    {
      "captureId":"232",
      "text":"lorem",
      "image":"https://images.saymedia-content.com/.image/t_share/MTc4MjUyODg2Mjk4ODYzMjEz/free-fun-100-question-quiz-3.png",
      "date":1699867355754
    },
    {
      "captureId":"232",
      "text":"lorem",
      "image":"https://images.saymedia-content.com/.image/t_share/MTc4MjUyODg2Mjk4ODYzMjEz/free-fun-100-question-quiz-3.png",
      "date":1699867355754
    },
    {
      "captureId":"232",
      "text":"lorem",
      "image":"https://images.saymedia-content.com/.image/t_share/MTc4MjUyODg2Mjk4ODYzMjEz/free-fun-100-question-quiz-3.png",
      "date":1699867355754
    },
    {
      "captureId":"232",
      "text":"lorem",
      "image":"https://images.saymedia-content.com/.image/t_share/MTc4MjUyODg2Mjk4ODYzMjEz/free-fun-100-question-quiz-3.png",
      "date":1699867355754
    },
    {
      "captureId":"232",
      "text":"lorem",
      "image":"https://images.saymedia-content.com/.image/t_share/MTc4MjUyODg2Mjk4ODYzMjEz/free-fun-100-question-quiz-3.png",
      "date":1699867355754
    },
    {
      "captureId":"232",
      "text":"lorem",
      "image":"https://images.saymedia-content.com/.image/t_share/MTc4MjUyODg2Mjk4ODYzMjEz/free-fun-100-question-quiz-3.png",
      "date":1699867355754
    },
    {
      "captureId":"232",
      "text":"lorem",
      "image":"https://images.saymedia-content.com/.image/t_share/MTc4MjUyODg2Mjk4ODYzMjEz/free-fun-100-question-quiz-3.png",
      "date":1699867355754
    },
  ];
  destroy$ = new Subject<void>();
  constructor(private commonUseService: CommonUseService,
              private appStates : AppStates,
              private modalController : ModalController) { }

  ngOnInit() {
    this.init();
  }

  async init() {
    // this.appStates.historiesListen().pipe(takeUntil(this.destroy$))
    // .subscribe((histories:HistoryData[])=>{
    //   this.histories = histories.sort((a, b) => b.date - a.date);
    // })
  }

  async onClickItem(history:HistoryData){
    const modal = await this.modalController.create({
      component:OcrResultComponent,
      componentProps:{
        isViewAsHistory:true,
        captureId:history.captureId,
        capturedImage:null,
        historyTextValue:history.text,
        saveImageString:history.image,
        // isoTranslateLanguage:history.translatedHistory.iso2,
        // translated:history.translatedHistory.text,
        // languageDetected:history.languageDetected
      }
    })
    await modal.present();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onDelete(captureId:string){

  }
}
