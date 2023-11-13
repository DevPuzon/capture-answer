import {
  Injectable
} from "@angular/core";
import { Filesystem } from "@capacitor/filesystem";
import { Platform } from "@ionic/angular";
import { COUNT_SHOW_OFFER, NOT_NEW_USER, REMAINING_SCANS, SUBSCRIPTION_IDS } from "../global-variable";
import { PopupGiftComponent } from "src/app/shared/components/popup-gift/popup-gift.component";
import { MatDialog } from "@angular/material/dialog";
import { CommonUseService } from "src/app/services/common-use.service";
import { AppStates } from "../app-states";
import { environment } from "src/environments/environment";
import { Device } from "@capacitor/device";
import { TranslateService } from "@ngx-translate/core";
import { UserAccount } from "src/app/models/user-account.model";

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
    localStorage.setItem(NOT_NEW_USER,"1");
  }

  isNewUser(): boolean{
    //return true; //HACK TODO
    return !localStorage.getItem(NOT_NEW_USER);
  }

  setCountShowOffer(isReset = false){
    const countStr = localStorage.getItem(COUNT_SHOW_OFFER) as string;
    let count = parseInt(countStr ? countStr : "0");
    count++;
    if(isReset){
      count = 0;
    }
    localStorage.setItem(COUNT_SHOW_OFFER,count.toString());
  }

  isShowOfferPlan():boolean{
    const countStr = localStorage.getItem(COUNT_SHOW_OFFER) as string;
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

  deducScans(many = 1){
    let remainingScans = this.appStates.getRemainingScans();
    if(remainingScans > 0){
      remainingScans = remainingScans - many;
      this.setRemainingScans(remainingScans);
    }
  }

  setRemainingScans(countScans:number){
    localStorage.setItem(REMAINING_SCANS,countScans.toString());
    this.appStates.setRemainingScans(countScans);
  }

  addRemainingScans(add:number){
    console.log("addRemainingScans",add);
    const remaining = this.getRemainingScans() + add;
    this.setRemainingScans(remaining);
  }

  getRemainingScans(){
    const countStr = localStorage.getItem(REMAINING_SCANS) as string;
    let count = parseInt(countStr ? countStr : "0");
    return count;
  }

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
}