import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Device } from '@capacitor/device';
import { environment } from 'src/environments/environment';
import { createWorker, Worker } from 'tesseract.js';
import { AppStates } from '../core/app-states';
import { OcrScan } from '../models/ocr-scan.model';
import { CommonUseService } from './common-use.service';
import { CommonUseUtil } from '../core/utils/common-use.util';

@Injectable({
  providedIn: 'root'
})
export class OcrService {
  worker!: Worker;

  constructor(private httpClient:HttpClient,
              private commonUseUtil:CommonUseUtil,
              private appState:AppStates) { }

  async recognizeTextFromImage(imageDataUrl: string | Blob): Promise<OcrScan> {
    return new Promise<OcrScan>(async (resolve)=>{
      let scanResult:OcrScan = {} as OcrScan;
      // #change
      const isUserPremium = this.appState.getIsUserPremium();
      // const isUserPremium = false
      if(isUserPremium){
        scanResult = await this.premiumScan(imageDataUrl);
      }else{
        scanResult = await this.standardScan(imageDataUrl);
      }
      console.log("recognizeTextFromImage",scanResult);
      resolve(scanResult);
    })
  }

  premiumScan(imageDataUrl: string | Blob){
    return new Promise<OcrScan>(async (resolve,reject)=>{

      const deviceUID = await CommonUseUtil.getDeviceUID();
      const req = this.httpClient.post(environment.baseURL+'/ocr/scan',
        {
          image:imageDataUrl,
          deviceUID:deviceUID
        }).subscribe(
          (res:any) => {
            req.unsubscribe();
            const data:OcrScan = res.data;
            this.commonUseUtil.setRemainingScans(data.ocrPremiumCycleCallsLeft as number);
            resolve(data);
          },
          (error:HttpErrorResponse) => {
            req.unsubscribe();
            switch(error.error.error.msg){
              case 'error_quota_exceed':
                reject('Quota exceed');
                break;
              case 'error_user_not_found':
                reject('User not found');
                break;
              default:
                reject('Something went wrong');
                break;
            }

          }
        );
    })
  }

  standardScan(imageDataUrl: string | Blob){
    return new Promise<OcrScan>(async (resolve)=>{
      const worker = await createWorker('eng');
      const {data} = await worker.recognize(imageDataUrl);
      await worker.terminate();
      const ocrScan :OcrScan ={
        text:data.text,

      }
      resolve(ocrScan);
    })
  }
}
