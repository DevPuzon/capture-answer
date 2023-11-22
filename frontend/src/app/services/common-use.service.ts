import { Injectable, inject } from '@angular/core';
import { ALREADY_CLAIMED_GIFT } from '../core/global-variable';
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
import { LStorage } from '../core/utils/lstorage.util';
import { Storage, ref, uploadBytesResumable } from '@angular/fire/storage';
@Injectable({
  providedIn: 'root'
})
export class CommonUseService   {
  private readonly storage: Storage = inject(Storage);

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
            // localStorage.setItem(ALREADY_CLAIMED_GIFT,"1");
            LStorage.set(ALREADY_CLAIMED_GIFT,"1");
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

  claimFreeAiChat(){
    return new Promise<boolean>(async (resolve,reject)=>{
      const deviceUID = await CommonUseUtil.getDeviceUID();
      const req = this.httpClient.post(environment.apiBaseURL+'common-use/claim-free-ai-chat/'+deviceUID,{}).subscribe(
        (res:any) => {
          req.unsubscribe();
          if(res.success){
            const data = res.data;

            this.appStates.setRemainingTokens(data.premiumCount);
            this.appStates.setFreeUserChat(data.freeChatCount);

            this.appStates.setAvailableRewardsCount(data.claimRewardsCount);

            resolve(data.isCanClaimGift);
          }
        }
      );
    })
  }

  checkRewards(){
    return new Promise<boolean>(async (resolve,reject)=>{
      const deviceUID = await CommonUseUtil.getDeviceUID();
      const req = this.httpClient.post(environment.apiBaseURL+'common-use/check-rewards/'+deviceUID,{}).subscribe(
        (res:any) => {
          req.unsubscribe();
          if(res.success){
            const data = res.data;

            this.appStates.setAvailableRewardsCount(data.claimRewardsCount);
            resolve(data);
          }
        },
        (ex)=>{
          const error = ex.error;
          console.log("checkRewards ex",error);
          this.appStates.setAvailableRewardsCount(error.claimRewardsCount);
          resolve(false)
        }
      );
    })
  }

  getHistories(){
    return new Promise<HistoryData[]>(async (resolve,reject)=>{

      const deviceUID = await CommonUseUtil.getDeviceUID();

      const body ={
        deviceId:deviceUID,
        history:history
      }

      const req = this.httpClient.post(environment.apiBaseURL+'history/histories-per-account',
      body).subscribe(
        (res:any) => {
          req.unsubscribe();
          if(res.success){
            this.appStates.setHistories(res.data);

            return resolve(res.data);
          }
        }
      );

    })
  }

  setHistory(history:HistoryData,file:File){
    return new Promise<HistoryData[]>(async (resolve,reject)=>{
      const histories = this.appStates.getHistories();
      if(histories.length <= 0){
        await this.getHistories();
      }

      const deviceUID = await CommonUseUtil.getDeviceUID();

      if(file){
        history.image = await this.onUploadImage(file);
      }else{
        throw new Error("Required file");
      }


      const body ={
        deviceId:deviceUID,
        history:history
      }

      const req = this.httpClient.post(environment.apiBaseURL+'history/save-history',
      body).subscribe(
        (res:any) => {
          req.unsubscribe();
          if(res.success){
            const histories = this.appStates.getHistories();
            histories.push(history);

            this.appStates.setHistories(histories);

            return resolve(res.data);
          }
        }
      );

    })
  }

  deleteHistoryItem(captureId:string){
    return new Promise(async(resolve)=>{

      // let histories = this.appStates.getHistories();
      // console.log("deleteHistoryItem histories 1",histories);
      // const fIndex = histories.findIndex((el)=>{return el.captureId == captureId});
      // console.log("deleteHistoryItem fIndex 1",fIndex);
      // histories.splice(fIndex, 1);
      // console.log("deleteHistoryItem histories 2",histories);
      // return;

      const deviceUID = await CommonUseUtil.getDeviceUID();
      const body ={
        deviceId:deviceUID,
        captureId:captureId
      }

      const req = this.httpClient.post(environment.apiBaseURL+'history/delete-history',
      body).subscribe(
        (res:any) => {
          req.unsubscribe();
          if(res.success){
            let histories = this.appStates.getHistories();
            const fIndex = histories.findIndex((el)=>{return el.captureId == captureId});
            histories.splice(fIndex, 1);

            this.appStates.setHistories(histories);

            return resolve(res.data);
          }
        }
      );

    })
  }


  getHistoryItem(captureId:string){
    return new Promise<HistoryData>(async (resolve)=>{

      const histories = this.appStates.getHistories();
      const item:any = histories.find((el)=>{return captureId == el.captureId; });

      return resolve(item);
    })
  }


  isCanGetGift(){
    return new Promise<boolean>(async (resolve,reject)=>{

      // let giftAlreadyClaimed = localStorage.getItem(ALREADY_CLAIMED_GIFT);
      let giftAlreadyClaimed = LStorage.get(ALREADY_CLAIMED_GIFT);
      console.log("isCanGetGift",giftAlreadyClaimed,giftAlreadyClaimed && giftAlreadyClaimed == '1');
      if(giftAlreadyClaimed && giftAlreadyClaimed == '1') {
        return resolve(false);
      }

      const isCanClaimGift = await this.checkFreePremium();
      resolve(isCanClaimGift);
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

  // onUploadImage(file:File){
  //   return new Promise<string>((resolve)=>{

  //     const formData = new FormData();
  //     formData.append('image', file);

  //     const req = this.httpClient.post(environment.apiBaseURL+"common-use/upload",
  //       formData
  //     ).subscribe((data:any) => {
  //       req.unsubscribe();
  //       return resolve(data.data.imageUrl);
  //     })

  //   })
  // }



  // setHistory(item:HistoryData,file?:File){
  //   return new Promise<HistoryData[]>(async (resolve,reject)=>{
  //     const histories = await this.getHistoryList();
  //     const historyFindIndex = this.historyFindIndex(item.captureId,histories);

  //     if(historyFindIndex != -1){
  //       // new item
  //       histories[historyFindIndex] = item;
  //     }else{
  //       // already exist item
  //       if(file){
  //         item.image = await this.onUploadImage(file);
  //       }else{
  //         throw new Error("Requred file");
  //       }

  //       histories.push(item);
  //     }

  //     // localStorage.setItem(HISTORY_LOCAL,JSON.stringify(histories));
  //     LStorage.set(HISTORY_LOCAL,JSON.stringify(histories));
  //     await this.getHistoryList();
  //     resolve(histories);
  //   })
  // }

  // deleteHistoryItem(captureId:string){
  //   return new Promise(async(resolve)=>{
  //     const histories = await this.getHistoryList();
  //     const historyFindIndex = this.historyFindIndex(captureId,histories);
  //     histories.splice(historyFindIndex,1);
  //     // localStorage.setItem(HISTORY_LOCAL,JSON.stringify(histories));
  //     LStorage.set(HISTORY_LOCAL,JSON.stringify(histories));
  //     await this.getHistoryList();
  //     resolve(histories);
  //   })
  // }

  // private historyFindIndex(captureId:string, histories:HistoryData[]){
  //   return histories.findIndex((el)=>{return el.captureId == captureId});
  // }

  // getHistoryItem(captureId:string){
  //   return new Promise<HistoryData>(async (resolve)=>{
  //     const histories = await this.getHistoryList();
  //     const item:any = histories.find((el)=>{return captureId == el.captureId; });
  //     return resolve(item);
  //   })
  // }


  onUploadImage(file:File){
    return new Promise<string>(async (resolve)=>{


      const fileName = `${Date.now()}_${file.name}`;
      const storageRef = ref(this.storage, fileName);
      const upload = await uploadBytesResumable(storageRef, file);
      const imageUrl = `https://firebasestorage.googleapis.com/v0/b/ocr-chat-ai.appspot.com/o/${fileName}?alt=media`;

      console.log("onUploadImage upload",upload);
      return resolve(imageUrl);
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
