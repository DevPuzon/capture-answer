import {
  Injectable
} from "@angular/core";
import {
  BehaviorSubject
} from "rxjs";
import {
  HistoryData
} from "../models/history.model";
import { SettingsModel } from "../models/settings.model";


@Injectable({
  providedIn: 'root'
})
export class AppStates {

  readonly TAG = 'AppStates';

  private showGiftPopModal = new BehaviorSubject < boolean > (false);
  private settings = new BehaviorSubject < SettingsModel > ({isCrop:true});
  // private canShowAds = new BehaviorSubject < boolean > (false);
  private remainingTokens = new BehaviorSubject < number > (0);
  private loading = new BehaviorSubject < boolean > (false  );
  private userPremium = new BehaviorSubject < boolean > (false);
  private forceUserPremium = new BehaviorSubject < boolean > (false);
  private freeUserChat = new BehaviorSubject < number > (0);
  private histories = new BehaviorSubject < HistoryData[] > ([]);
  private isStartCamera = new BehaviorSubject < boolean > (false);
  private permissionStatus = new BehaviorSubject < any > ({});
  private isShowBanner = new BehaviorSubject < boolean > (false);
  private isAlreadyAdmobInit = new BehaviorSubject < boolean > (false);
  private availableRewardsCount = new BehaviorSubject < number > (0);
  private showSplash = new BehaviorSubject < boolean > (false);


  constructor() {}

  // setCanShowAds(value: boolean) {
  //   this.canShowAds.next(value);
  // }

  // listenCanShowAds() {
  //   return this.canShowAds.asObservable();
  // }

  showGiftPopModalListen() {
    return this.showGiftPopModal.asObservable();
  }

  setShowGiftModal(isShow: boolean) {
    this.showGiftPopModal.next(isShow);
  }

  listenRemainingTokens() {
    return this.remainingTokens.asObservable();
  }

  getRemainingTokens() {
    return this.remainingTokens.getValue();
  }

  setRemainingTokens(tokens: number) {
    this.setUserPremium(tokens >= 1);
    this.remainingTokens.next(tokens);
  }

  private setUserPremium(isPremium: boolean) {
    console.log("setUserPremium", isPremium);
    this.userPremium.next(isPremium);
  }

  getIsUserPremium() {
    return this.userPremium.getValue();
  }

  setUserForcePremium(isPremium: boolean) {
    this.forceUserPremium.next(isPremium);
    this.setUserPremium(isPremium);
  }

  getIsUserForcePremium() {
    return this.forceUserPremium.getValue();
  }

  listenIsUserPremium() {
    return this.userPremium.asObservable();
  }

  getHistories() {
    return this.histories.getValue();
  }

  setHistories(histories: HistoryData[]) {
    this.histories.next(histories);
  }

  listenHistories() {
    return this.histories.asObservable();
  }

  listenIsStartCamera() {
    return this.isStartCamera.asObservable();
  }

  setIsStartCamera(isStart: boolean) {
    console.log("setIsStartCamera", isStart);
    this.isStartCamera.next(isStart);
  }

  listenPermissionStatus() {
    return this.permissionStatus.asObservable();
  }

  getPermissionStatus() {
    return this.permissionStatus.getValue();
  }

  setPermissionStatus(permissionName: string) {
    const permissionStatus = this.permissionStatus.getValue();
    permissionStatus[permissionName] = true;
    this.permissionStatus.next(permissionStatus);
  }

  getIsShowBanner() {
    console.log('getIsShownBanner');
    return this.isShowBanner.getValue();
  }

  setIsShowBanner(isShownBanner: boolean) {
    console.log('setIsShownBanner', isShownBanner);
    return this.isShowBanner.next(isShownBanner);
  }

  listenIsShownBanner() {
    return this.isShowBanner.asObservable();
  }

  getIsAlreadyAdmobInit() {
    console.log('getIsAlreadyAdmobInit');
    return this.isAlreadyAdmobInit.getValue();
  }

  setIsAlreadyAdmobInit(isAlreadyAdmobInit: boolean) {
    console.log('setIsAlreadyAdmobInit', isAlreadyAdmobInit);
    return this.isAlreadyAdmobInit.next(isAlreadyAdmobInit);
  }

  setFreeUserChat(value: number) {
    this.freeUserChat.next(value);
  }

  getFreeUserChat() {
    return this.freeUserChat.getValue();
  }

  listenFreeUserChat() {
    return this.freeUserChat.asObservable();
  }

  setLoading(loading:boolean){
    this.loading.next(loading);
  }

  getLoading(){
    return this.loading.getValue();
  }

  listenLoading(){
    return this.loading.asObservable();
  }

  setShowSplash(showSplash:boolean){
    this.showSplash.next(showSplash);
  }

  getShowSplash(){
    return this.showSplash.getValue();
  }

  listenShowSplash(){
    return this.showSplash.asObservable();
  }


  setSettings(settings:SettingsModel){
    this.settings.next(settings);
  }

  getSettings(){
    return this.settings.getValue();
  }

  listenSettings(){
    return this.settings.asObservable();
  }

  setAvailableRewardsCount(count:number){
    this.availableRewardsCount.next(count);
  }

  getAvailableRewardsCount(){
    return this.availableRewardsCount.getValue();
  }

  listenAvailableRewardsCount(){
    return this.availableRewardsCount.asObservable();
  }



}
