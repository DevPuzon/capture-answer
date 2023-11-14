import { Injectable, OnInit } from '@angular/core';
import { ALREADY_CLAIMED_GIFT, APP_NAME, HISTORY_LOCAL } from '../core/global-variable';
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
      const req = this.httpClient.post(environment.apiBaseURL+'common-use/claim-free-premium/'+deviceUID,
      {
      }).subscribe(
        (res:any) => {
          req.unsubscribe();
          if(res.success){
            const data = res.data;

            this.appStates.setRemainingTokens(data.premiumCount);
            this.appStates.setFreeUserChat(data.freeChatCount);
            localStorage.setItem(ALREADY_CLAIMED_GIFT,"1");
          }
          resolve({});
        }
      );
    })
  }

  checkFreePremium(){
    return new Promise<boolean>(async (resolve,reject)=>{
      const deviceUID = await CommonUseUtil.getDeviceUID();
      const req = this.httpClient.get(environment.apiBaseURL+'common-use/check-free-premium/'+deviceUID).subscribe(
        (res:any) => {
          req.unsubscribe();
          if(res.success){
            const data = res.data;

            this.appStates.setRemainingTokens(data.premiumCount);
            this.appStates.setFreeUserChat(data.freeChatCount);
            resolve(data.isCanClaimGift);
          }
        }
      );
    })
  }

  isCanGetGift(){
    return new Promise<boolean>(async (resolve,reject)=>{

      let giftAlreadyClaimed = localStorage.getItem(ALREADY_CLAIMED_GIFT);
      console.log("isCanGetGift",giftAlreadyClaimed,giftAlreadyClaimed && giftAlreadyClaimed == '1');
      if(giftAlreadyClaimed && giftAlreadyClaimed == '1') {
        return resolve(false);
      }

      const isCanClaimGift = await this.checkFreePremium();
      resolve(isCanClaimGift);
    })
  }

  saveHistory(item:HistoryData,file?:File){
    return new Promise<HistoryData[]>(async (resolve,reject)=>{
      const histories = await this.getHistoryList();
      const historyFindIndex = this.historyFindIndex(item.captureId,histories);

      if(historyFindIndex != -1){
        // new item
        histories[historyFindIndex] = item;
      }else{
        // already exist item
        if(file){
          item.image = await this.onUploadImage(file);
        }else{
          throw new Error("Requred file");
        }

        histories.push(item);
      }

      localStorage.setItem(HISTORY_LOCAL,JSON.stringify(histories));
      await this.getHistoryList();
      resolve(histories);
    })
  }

  deleteHistoryItem(captureId:string){
    return new Promise(async(resolve)=>{
      const histories = await this.getHistoryList();
      const historyFindIndex = this.historyFindIndex(captureId,histories);
      histories.splice(historyFindIndex,1);
      localStorage.setItem(HISTORY_LOCAL,JSON.stringify(histories));
      await this.getHistoryList();
      resolve(histories);
    })
  }

  private historyFindIndex(captureId:string, histories:HistoryData[]){
    return histories.findIndex((el)=>{return el.captureId == captureId});
  }

  getHistoryItem(captureId:string){
    return new Promise<HistoryData>(async (resolve)=>{
      const histories = await this.getHistoryList();
      const item:any = histories.find((el)=>{return captureId == el.captureId; });
      return resolve(item);
    })
  }

  getHistoryList(){
    return new Promise<HistoryData[]>(async (resolve,reject)=>{
      let histories:any[]|HistoryData[] = JSON.parse(localStorage.getItem(HISTORY_LOCAL) || '[]');
      console.log(histories);
      this.appStates.setHistories(histories);
      resolve(histories);
    })
  }

  sendFeedback(message:string){
    return new Promise<any>(async (resolve)=>{
      const deviceUID = await CommonUseUtil.getDeviceUID();
      const localLanguage = await this.commonUseUtil.getLocalLanguage();
      const req = this.httpClient.post(environment.apiBaseURL+"feedback",
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
      const req = this.httpClient.post(environment.apiBaseURL+"translate",
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


  // onSubscription(isStart:boolean,subscriptionId:string){
  //   return new Promise<any>(async (resolve,reject)=>{
  //     const deviceUID = await CommonUseUtil.getDeviceUID();
  //     let body = {};
  //     const localLanguage = await this.commonUseUtil.getLocalLanguage();
  //     if(isStart){
  //       body = {
  //         deviceUID: deviceUID,
  //         cultureIso2: localLanguage,
  //         subscriptionId: subscriptionId
  //       }
  //     }else{
  //       body = {
  //         deviceUID: deviceUID,
  //         cultureIso2: localLanguage
  //       }
  //     }
  //     const req = this.httpClient.post(environment.apiBaseURL+'/user/subscription/'+(isStart ? 'start':'end'),
  //       body
  //     ).subscribe((res:any)=>{
  //       const data :SubscriptionResponse = res;
  //       req.unsubscribe();
  //       console.log('onSubscription response',data,isStart,subscriptionId);
  //       this.commonUseUtil.addRemainingScans(data.data.ocrPremiumCycleCallsLeft);
  //       resolve({});
  //     })
  //   })
  // }

  onUploadImage(file:File){
    return new Promise<string>((resolve)=>{

      const formData = new FormData();
      formData.append('image', file);

      const req = this.httpClient.post(environment.apiBaseURL+"common-use/upload",
        formData
      ).subscribe((data:any) => {
        req.unsubscribe();
        return resolve(data.data.imageUrl);
      })

    })
  }

  getImage(url:string){
    return new Promise<string>((resolve)=>{
      const req = this.httpClient.get(url, { responseType: 'blob' })
      .subscribe((data:any) => {
        req.unsubscribe();
        return resolve(this.commonUseUtil.convertBlobToBase64(data));
      })

    })
  }
}
