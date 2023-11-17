import {
  Injectable
} from "@angular/core";
import { Filesystem } from "@capacitor/filesystem";
import { Platform } from "@ionic/angular";
import { COUNT_SHOW_OFFER, NOT_NEW_USER, SETTINGS, SUBSCRIPTION_IDS } from "../global-variable";
import { MatDialog } from "@angular/material/dialog";
import { AppStates } from "../app-states";
import { Device } from "@capacitor/device";
import { TranslateService } from "@ngx-translate/core";
import { UserAccount } from "src/app/models/user-account.model";
import { SettingsModel } from "src/app/models/settings.model";
import { LStorage } from "./lstorage.util";

declare var navigator:any;
@Injectable({
  providedIn: 'root'
})
export class CommonUseUtil {

  constructor(private platform: Platform,
              private appStates:AppStates,
              private translateService: TranslateService,
              private dialog: MatDialog) {}

  async readFileAsBase64(filePath: string): Promise<string | Blob> {
    return new Promise<string | Blob>(async (resolve,reject)=>{
      if(!this.platform.is('capacitor')){
        return reject('Not capacitor');
      }

      const result = await Filesystem.readFile({
        path: filePath
      });
      const base64Image = 'data:image/jpeg;base64,' + result.data;
      console.log("readFileAsFile",result,base64Image);
      resolve(base64Image);
    })
  }

  isNativeAndroid():boolean{
    return this.platform.is('android') && this.platform.is('capacitor')
  }
  isNativeIos():boolean{
    return this.platform.is('ios') && this.platform.is('capacitor')
  }

  setNotNewUser():void{
    // localStorage.setItem(NOT_NEW_USER,"1");
    LStorage.set(NOT_NEW_USER,"1");
  }

  isNewUser(): boolean{
    // return !localStorage.getItem(NOT_NEW_USER);
    return !LStorage.get(NOT_NEW_USER);
  }

  setCountShowOffer(isReset = false){
    // const countStr = localStorage.getItem(COUNT_SHOW_OFFER) as string;
    const countStr = LStorage.get(COUNT_SHOW_OFFER) as string;
    let count = parseInt(countStr ? countStr : "0");
    count++;
    if(isReset){
      count = 0;
    }
    // localStorage.setItem(COUNT_SHOW_OFFER,count.toString());
    LStorage.set(COUNT_SHOW_OFFER,count.toString());
  }

  isShowOfferPlan():boolean{
    // const countStr = localStorage.getItem(COUNT_SHOW_OFFER) as string;
    const countStr = LStorage.get(COUNT_SHOW_OFFER) as string;
    if(!countStr){
      return true;
    }
    const count = parseInt(countStr ? countStr : "0");
    if(count >= 5){
      return true
    }
    return false;
  }


  // onShowGifModal(){
  //   this.dialog.open(PopupGiftComponent, {
  //     width: '360px',
  //     height:'480px',
  //     disableClose:true
  //   });
  // }

  // deducScans(many = 1){
  //   let remainingScans = this.appStates.getRemainingTokens();
  //   if(remainingScans > 0){
  //     remainingScans = remainingScans - many;
  //     this.setRemainingScans(remainingScans);
  //   }
  // }

  // setRemainingScans(countScans:number){
  //   this.appStates.setRemainingTokens(countScans);
  //   this.appStates.setUserPremium(countScans >= 1);
  // }

  // addRemainingScans(add:number){
  //   console.log("addRemainingScans",add);
  //   const remaining = this.getRemainingScans() + add;
  //   this.setRemainingScans(remaining);
  // }

  // getRemainingScans(){
  //   const countStr = localStorage.getItem(REMAINING_SCANS) as string;
  //   let count = parseInt(countStr ? countStr : "0");
  //   return count;
  // }

  static getDeviceUID(){
    return new Promise<string>(async (resolve)=>{
      let ret = (await Device.getId()).identifier;
      console.log("device ID identifier",ret);
      resolve(ret);
    })
  }

  static getUser(){
    return new Promise<UserAccount>(async (resolve)=>{
      let id = await CommonUseUtil.getDeviceUID();
      resolve({
        id:id
      });
    })
  }

  getUID(length = 10){
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let uid = '';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charactersLength);
      uid += characters.charAt(randomIndex);
    }
    return uid;
  }

  resizeBase64Image(base64Image: string, maxWidth: number, maxHeight: number): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const image = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject('Canvas not supported');
        return;
      }

      image.onload = () => {
        let newWidth, newHeight;

        if (image.width > image.height) {
          newWidth = maxWidth;
          newHeight = (image.height * maxWidth) / image.width;
        } else {
          newHeight = maxHeight;
          newWidth = (image.width * maxHeight) / image.height;
        }

        canvas.width = newWidth;
        canvas.height = newHeight;

        ctx.drawImage(image, 0, 0, newWidth, newHeight);

        resolve(canvas.toDataURL());
      };

      image.src = base64Image;
    });
  }

  getSubscriptionId(selectedTimeOffer:string){
    let nativeStr = 'android';
    if(this.isNativeAndroid()){
      nativeStr = 'android';
    }
    if(this.isNativeIos()){
      nativeStr = 'ios';
    }
    console.log("getSubscriptionId",selectedTimeOffer,nativeStr)
    const subscriptionIds:any = SUBSCRIPTION_IDS;
    return subscriptionIds[nativeStr+'SubscriptionIds'][selectedTimeOffer];
  }

  getLocalLanguage(): string {
    return this.translateService.getBrowserLang() || 'nf';
  }

  setIsStartCamera(isStart:boolean){
    const permissions = this.appStates.getPermissionStatus();
    if(this.isNativeAndroid()){
      for(let permission of Object.keys(permissions)){
        if(permission == 'camera'){
          this.appStates.setIsStartCamera(isStart);
        }
      }
    }else{
      this.appStates.setIsStartCamera(isStart);
    }
  }


  base64toFile(base64String : string, filename : string) {
    const mimeType = "image/png";
    const base64Data = base64String.split(',')[1];
    const binaryData = atob(base64Data);
    const arrayBuffer = new ArrayBuffer(binaryData.length);
    const uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < binaryData.length; i++) {
      uint8Array[i] = binaryData.charCodeAt(i);
    }

    const blob = new Blob([uint8Array], { type: mimeType });

    const file = new File([blob], filename, { type: mimeType });

    return file;
  }

  formatNumber(num:number) {
    const absNum = Math.abs(num);

    if (absNum >= 1e6) {
      return (num / 1e6).toFixed(1) + 'M';
    } else if (absNum >= 1e3) {
      return (num / 1e3).toFixed(1) + 'k';
    }

    return num.toFixed(1).toString();
  }

  convertBlobToBase64(blob: Blob) {
    return new Promise<string>((resolve)=>{
      const reader = new FileReader();
      reader.onloadend = () => {
        return resolve(reader.result as string);
      };
      reader.readAsDataURL(blob);
    })
  }

  saveSettings(settings:SettingsModel){
    // localStorage.setItem(SETTINGS,JSON.stringify(settings));
    LStorage.set(SETTINGS,JSON.stringify(settings));
    this.appStates.setSettings(settings);
  }

  checkSettings(){
    // const settings = localStorage.getItem(SETTINGS);
    const settings = LStorage.get(SETTINGS);
    if(settings){
      this.appStates.setSettings(JSON.parse(settings));
    }
  }

  public isShowInterstitial():boolean{
    let ret = false;
    // let countShowInter = parseInt(localStorage.getItem("isShowInterstitial") || '0');
    let countShowInter = parseInt(LStorage.get("isShowInterstitial") || '0');
    if(countShowInter >= 3){
      ret = true;
      countShowInter = 0;
    }
    countShowInter++;
    // localStorage.setItem('isShowInterstitial',countShowInter.toString());
    LStorage.set('isShowInterstitial',countShowInter.toString());
    return ret;
  }
}
