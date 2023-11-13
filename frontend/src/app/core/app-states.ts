import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { HistoryData } from "../models/history.model";


@Injectable({
    providedIn: 'root'
})
export class AppStates {

    readonly TAG = 'AppStates';

    private showGiftPopModal = new BehaviorSubject<boolean>(false);
    private canShowAds = new BehaviorSubject<boolean>(false);
    private remainingScans = new BehaviorSubject<number>(0);
    private userPremium = new BehaviorSubject<boolean>(true); //#change
    private forceUserPremium = new BehaviorSubject<boolean>(false);
    private freeUserChat = new BehaviorSubject<number>(0);
    private histories = new BehaviorSubject<HistoryData[]>([]);
    private isStartCamera = new BehaviorSubject<boolean>(false);
    private permissionStatus = new BehaviorSubject<any>({});
    private isShowBanner = new BehaviorSubject<boolean>(false);
    private isAlreadyAdmobInit = new BehaviorSubject<boolean>(false);


    constructor(){}

    setCanShowAds(value: boolean) {
      this.canShowAds.next(value);
    }

    listenCanShowAds(){
      return this.canShowAds.asObservable();
    }

    showGiftPopModalListen(){
        return this.showGiftPopModal.asObservable();
    }

    setShowGiftModal(isShow:boolean){
        this.showGiftPopModal.next(isShow);
    }

    remainingScansListen(){
        return this.remainingScans.asObservable();
    }

    getRemainingScans(){
        return this.remainingScans.getValue();
    }

    setRemainingScans(scans:number){
        this.remainingScans.next(scans);
    }

    setUserPremium(isPremium:boolean){
        // this.userPremium.next(isPremium); #change
    }

    getIsUserPremium(){
        return this.userPremium.getValue();
    }

    setUserForcePremium(isPremium:boolean){
      this.forceUserPremium.next(isPremium);
      this.setUserPremium(isPremium);
    }

    getIsUserForcePremium(){
        return this.forceUserPremium.getValue();
    }

    listenIsUserPremium(){
      return this.userPremium.asObservable();
    }

    setHistories(histories:HistoryData[]){
        this.histories.next(histories);
    }

    historiesListen(){
        return this.histories.asObservable();
    }

    listenIsStartCamera(){
      return this.isStartCamera.asObservable();
    }

    setIsStartCamera(isStart:boolean){
      console.log("setIsStartCamera",isStart);
      this.isStartCamera.next(isStart);
    }

    listenPermissionStatus(){
      return this.permissionStatus.asObservable();
    }

    getPermissionStatus(){
      return this.permissionStatus.getValue();
    }

    setPermissionStatus(permissionName :string){
      const permissionStatus = this.permissionStatus.getValue();
      permissionStatus[permissionName] = true;
      this.permissionStatus.next(permissionStatus);
    }

    getIsShowBanner(){
      console.log('getIsShownBanner');
      return this.isShowBanner.getValue();
    }

    setIsShowBanner(isShownBanner:boolean){
      console.log('setIsShownBanner',isShownBanner);
      return this.isShowBanner.next(isShownBanner);
    }

    listenIsShownBanner(){
      return this.isShowBanner.asObservable();
    }

    getIsAlreadyAdmobInit(){
      console.log('getIsAlreadyAdmobInit');
      return this.isAlreadyAdmobInit.getValue();
    }

    setIsAlreadyAdmobInit(isAlreadyAdmobInit:boolean){
      console.log('setIsAlreadyAdmobInit',isAlreadyAdmobInit);
      return this.isAlreadyAdmobInit.next(isAlreadyAdmobInit);
    }

    setFreeUserChat(value:number){
      this.freeUserChat.next(value);
    }

    getFreeUserChat(){
      return this.freeUserChat.getValue();
    }

    listenFreeUserChat(){
      return this.freeUserChat.asObservable();
    }
}
