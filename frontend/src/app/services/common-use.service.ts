import { Injectable, OnInit } from '@angular/core';
import { APP_NAME, HISTORY_LOCAL, REMAINING_SCANS } from '../core/global-variable';
import { AppStates } from '../core/app-states';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Device } from '@capacitor/device';
import { OcrScan } from '../models/ocr-scan.model';
import { CommonUseUtil } from '../core/utils/common-use.util';
import { HistoryData } from '../models/history.model';
import { TranslateData } from '../models/translate.model';
import { SubscriptionResponse } from '../models/subscription.model';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
@Injectable({
  providedIn: 'root'
})
export class CommonUseService   {
  constructor(
              private appStates:AppStates,
              private commonUseUtil:CommonUseUtil,
              private httpClient:HttpClient) {
  }

  claimFreePremium(){
    return new Promise(async (resolve,reject)=>{
      const deviceUID = await CommonUseUtil.getDeviceUID();
      const req = this.httpClient.post(environment.baseURL+'/common-use/free-premium/'+deviceUID,{
        deviceUID:deviceUID
      }).subscribe(
        (res:any) => {
          req.unsubscribe();
          if(res.success){
            const data = res.data;
            if(!this.appStates.getIsUserForcePremium()){
              this.appStates.setUserPremium(data.premiumCount > 0);
            }
            this.appStates.setFreeUserChat(data.premiumCount);
          }
          resolve({});
        }
      );
    })
  }

  isCanGetGift(){
    return new Promise<boolean>(async (resolve,reject)=>{

      let giftAlreadyClaimed = localStorage.getItem('giftAlreadyClaimed');
      if(giftAlreadyClaimed && giftAlreadyClaimed=='1') return resolve(false);  //To avoid multiple api calls

      const deviceUID = await CommonUseUtil.getDeviceUID();
      const req = this.httpClient.post(environment.baseURL+'/ocr/gift/status',{
        deviceUID:deviceUID
      }).subscribe(
        (res:any) => {
          req.unsubscribe();
          resolve(res.data.canRequestOcrGift);
        },
        (error:HttpErrorResponse) => {
          req.unsubscribe();
        }
      );
    })
  }

  saveHistory(item:HistoryData,saveImageString:string){
    return new Promise<HistoryData[]>(async (resolve,reject)=>{
      const histories = await this.getHistoryList();
      const histroyFindIndex = this.histroyFindIndex(item.captureId,histories);
      if(histroyFindIndex != -1){
        histories[histroyFindIndex] = item;
      }else{
        histories.push(item);
      }
      if(this.commonUseUtil.isNativeAndroid() || this.commonUseUtil.isNativeIos()){
        const docPath = `${APP_NAME}/${new Date().getTime()}.msp`;
        await Filesystem.writeFile({
          path: docPath,
          data: saveImageString,
          directory: Directory.Documents,
          encoding: Encoding.UTF8,
        });
        localStorage.setItem(HISTORY_LOCAL+item.captureId,docPath);
      }else{
        saveImageString = await this.commonUseUtil.resizeBase64Image(saveImageString,50,50)
        localStorage.setItem(HISTORY_LOCAL+item.captureId,saveImageString);
      }
      localStorage.setItem(HISTORY_LOCAL,JSON.stringify(histories));
      await this.getHistoryList();
      resolve(histories);
    })
  }

  private histroyFindIndex(captureId:string, histories:HistoryData[]){
    return histories.findIndex((el)=>{return el.captureId == captureId});
  }

  getHistoryList(){
    return new Promise<HistoryData[]>(async (resolve,reject)=>{
      let histories:any[]|HistoryData[] = JSON.parse(localStorage.getItem(HISTORY_LOCAL) || '[]');
      for(let [i,val] of histories.entries()){
        console.log(HISTORY_LOCAL+val.captureId);
        if(this.commonUseUtil.isNativeAndroid() || this.commonUseUtil.isNativeIos()){
          const docPath = localStorage.getItem(HISTORY_LOCAL+val.captureId) as string;
          const contents = await Filesystem.readFile({
            path: docPath,
            directory: Directory.Documents,
            encoding: Encoding.UTF8,
          });
          histories[i].image = contents.data;
        }else{
          histories[i].image = localStorage.getItem(HISTORY_LOCAL+val.captureId);
        }
      }
      console.log(histories);
      this.appStates.setHistories(histories);
      resolve(histories);
    })
  }

  sendFeedback(message:string){
    return new Promise<any>(async (resolve)=>{
      const deviceUID = await CommonUseUtil.getDeviceUID();
      const localLanguage = await this.commonUseUtil.getLocalLanguage();
      const req = this.httpClient.post(environment.baseURL+"/feedback",
        {
          deviceUID: deviceUID,
          cultureIso2: localLanguage,
          message: message
        }
      ).subscribe(()=>{
        req.unsubscribe();
        resolve({});
      })
    })
  }

  translateLanguage(text:string,iso2:string){
    return new Promise<string>(async (resolve,reject)=>{
      const deviceUID = await CommonUseUtil.getDeviceUID();
      const req = this.httpClient.post(environment.baseURL+"/translate",
        {
          deviceUID: deviceUID,
          text: text,
          targetCultureIso2: iso2
        }
      ).subscribe((data:any|TranslateData) => {
        req.unsubscribe();
        resolve(data.data.text);
      })
    })
  }


  onSubscription(isStart:boolean,subscriptionId:string){
    return new Promise<any>(async (resolve,reject)=>{
      const deviceUID = await CommonUseUtil.getDeviceUID();
      let body = {};
      const localLanguage = await this.commonUseUtil.getLocalLanguage();
      if(isStart){
        body = {
          deviceUID: deviceUID,
          cultureIso2: localLanguage,
          subscriptionId: subscriptionId
        }
      }else{
        body = {
          deviceUID: deviceUID,
          cultureIso2: localLanguage
        }
      }
      const req = this.httpClient.post(environment.baseURL+'/user/subscription/'+(isStart ? 'start':'end'),
        body
      ).subscribe((res:any)=>{
        const data :SubscriptionResponse = res;
        req.unsubscribe();
        console.log('onSubscription response',data,isStart,subscriptionId);
        this.commonUseUtil.addRemainingScans(data.data.ocrPremiumCycleCallsLeft);
        resolve({});
      })
    })
  }
}
