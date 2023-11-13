import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { Subject, Subscription, switchMap, takeUntil, timer } from 'rxjs';
import { AppStates } from 'src/app/core/app-states';
import { LANGUAGES, LANGUAGES_ISO_2 } from 'src/app/core/global-variable';
import { CommonUseUtil } from 'src/app/core/utils/common-use.util';
import { HistoryData } from 'src/app/models/history.model';
import { OcrScan } from 'src/app/models/ocr-scan.model';
import { CommonUseService } from 'src/app/services/common-use.service';
import { OcrService } from 'src/app/services/ocr.service';
import { Share } from '@capacitor/share';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from 'src/app/services/toast.service';
import { Clipboard } from '@capacitor/clipboard';

@Component({
  selector: 'ocr-ocr-result',
  templateUrl: './ocr-result.component.html',
  styleUrls: ['./ocr-result.component.scss'],
})
export class OcrResultComponent  implements OnInit {
  private destroy$ = new Subject<void>();
  private typingTimer: Subscription | undefined;

  isShowTranslate = false;
  @Input('captureId') captureId : string = '';
  @Input('capturedImage') capturedImage : string = '';
  @Input('historyTextValue') historyTextValue : string = '';
  @Input('translated') translated : string = '';
  @Input('isoTranslateLanguage') isoTranslateLanguage : string = '';
  @Input('languageDetected') languageDetected : string = 'Unknown';
  @Input('saveImageString') saveImageString : string = '';
  @Input('isViewAsHistory') isViewAsHistory : boolean = false;

  ocrScan: OcrScan = {} as OcrScan;
  isPremium = false;
  languagesIsoList:any[] = LANGUAGES_ISO_2;
  tabAction = '';

  constructor(private ocrService:OcrService,
              private toastService:ToastService,
              private appStates:AppStates,
              private commonUseService:CommonUseService,
              private commonUseUtil:CommonUseUtil,
              private loadingCtrl:LoadingController,
              private translateService: TranslateService,
              private modalController:ModalController) { }

  async ngOnInit() {
    if(!this.captureId){
      throw new Error("captureId required");
    }

    this.init();
    if(this.isViewAsHistory){
      this.ocrScan = {
        text:this.historyTextValue
      }
      const resultDetectedLang :any = document.getElementById("ocr-result--detected--textarea");
      this.autoResizeTextArea(resultDetectedLang);
      const resultTranslatedLang :any = document.getElementById("ocr-result--translated--textarea");
      this.autoResizeTextArea(resultTranslatedLang);
    }else{
      this.extractText();
      this.saveImageString = this.capturedImage;
    }
    // this.autoResizeTextArea(resultTranslatedLang);
  }

  init() {
    this.appStates.listenIsUserPremium().pipe(takeUntil(this.destroy$))
    .subscribe((isPremium:boolean)=>{
      this.isPremium = isPremium;
    })
  }

  autoResizeTextArea(textarea:any){
    console.log('autoResizeTextArea',textarea);
    setTimeout(() => {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }, 1);
  }

  onBack(){
    this.modalController.dismiss();
  }

  onChangeDetectedLang(event:any){
    if (this.typingTimer) {
      this.typingTimer.unsubscribe();
    }
    const typingTimer$ = timer(2000);
    this.typingTimer = typingTimer$
    .pipe(
      takeUntil(this.destroy$),
      switchMap(() => {
        console.log('onChangeDetectedLang',event);
        const value = event.target.value;
        this.ocrScan.text = value;
        this.onSave();
        this.onTranslate(this.ocrScan.text,this.isoTranslateLanguage);
        return typingTimer$;
      })
    )
    .subscribe();
  }

  onSave(){
    const item:HistoryData ={
      captureId:this.captureId,
      text:this.ocrScan.text,
      image:'',
      date:new Date().getTime(),
      // languageDetected:this.languageDetected,
      // translatedHistory:{
      //   iso2:this.isoTranslateLanguage,
      //   text:this.translated
      // }
    }
    console.log("onSave",item);
    this.commonUseService.saveHistory(item,this.saveImageString);
  }

  async extractText() {
    if(!this.capturedImage){
      return console.error("No image");
    }
    const loading = await this.loadingCtrl.create({message: 'Please wait...' });
    await loading.present();
    this.ocrScan = await this.ocrService.recognizeTextFromImage(this.capturedImage);
    if(this.ocrScan.iso2){
      const findLanguage = this.languagesIsoList.find((el)=>{return el.iso2 == this.ocrScan.iso2});
      if(findLanguage){
        this.languageDetected = findLanguage.language || "Unknown";
      }
    }

    const resultDetectedLang :any = document.getElementById("ocr-result--detected--textarea");
    this.autoResizeTextArea(resultDetectedLang);

    this.onSave();
    await loading.dismiss();

  }

  async onTranslateChange(event:any){
    console.log("onTranslateChange",event);
    const value = event.value;
    const text = this.ocrScan.text;
    await this.onTranslate(text,value);
    this.onSave();
  }

  onTranslate(text:string,iso2:string,isShowLoad = true){
    return new Promise(async (resolve)=>{
      if(!text || !iso2){
        return resolve({});
      }
      const load = await this.loadingCtrl.create({message: 'Please wait...'});
      if(isShowLoad){
        await load.present();
      }
      this.isoTranslateLanguage = iso2;
      this.translated = await this.commonUseService.translateLanguage(text,iso2);
      await load.dismiss();
      const resultTranslatedLang :any = document.getElementById("ocr-result--translated--textarea");
      this.autoResizeTextArea(resultTranslatedLang);
      resolve({});
    })
  }

  async onShare(){
    this.tabAction = 'share';
    this.isShowTranslate = false;
    const textToCopy = this.ocrScan.text;
    await Share.share({
      text: textToCopy
    });
  }

  async onCopy(){
    if(this.commonUseUtil.isNativeAndroid() || this.commonUseUtil.isNativeIos()){
      const { type, value } = await Clipboard.read();

      console.log(`Got ${type} from clipboard: ${value}`);
    }else{
      this.tabAction = 'copy';
      this.isShowTranslate = false;
      const textToCopy = this.ocrScan.text;
      const selBox = document.getElementById('copy-textarea') as HTMLElement | any;
      selBox.value = textToCopy;
      selBox.focus();
      selBox.select();
      document.execCommand('copy');
    }

    await(await this.toastService.presentToast(this.translateService.instant("COPIED_OK"),1500));

  }

  async onShowTranslate(){
    const isPremium = this.appStates.getIsUserPremium();
    if(!isPremium){
      await ( await this.toastService.presentToast(this.translateService.instant("TOAST_MESSAGE_PREMIUM_ACCESS_UNAVAILABLE"), 3000));
      return;
    }
    this.tabAction = 'translate';
    this.isShowTranslate = !this.isShowTranslate;
  }

  onFileSave(){

  }
}
