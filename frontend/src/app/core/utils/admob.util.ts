import {
  Injectable
} from '@angular/core';
import { AdMob, BannerAdOptions, BannerAdSize, BannerAdPosition, BannerAdPluginEvents, AdMobBannerSize, InterstitialAdPluginEvents, AdOptions, AdLoadInfo, RewardAdPluginEvents, AdMobRewardItem, RewardAdOptions } from '@capacitor-community/admob';
import { environment } from 'src/environments/environment';
import { AppStates } from '../app-states';
import { CommonUseUtil } from './common-use.util';
import { LoadingController } from '@ionic/angular';
import { CommonUseService } from 'src/app/services/common-use.service';

@Injectable({
  providedIn: 'root'
})
export class AdmobUtil {
  private readonly TAG = "[AdmobUtil]";
  constructor(
    private commonUseUtil:CommonUseUtil ) {
  }

  // initialAdmob(){
  //   return new Promise(async (resolve)=>{
  //     const isAlreadyAdmobInit = this.appStates.getIsAlreadyAdmobInit();
  //     console.log(this.TAG,"!isAlreadyAdmobInit",!isAlreadyAdmobInit);
  //     if(isAlreadyAdmobInit){return resolve({});}
  //     this.appStates.setIsAlreadyAdmobInit(true);
  //     const { status } = await AdMob.trackingAuthorizationStatus();
  //     console.log(this.TAG,'initialAdmob',status);
  //     if (status === 'notDetermined') {
  //       /**
  //        * If you want to explain TrackingAuthorization before showing the iOS dialog,
  //        * you can show the modal here.
  //        * ex)
  //        * const modal = await this.modalCtrl.create({
  //        *   component: RequestTrackingPage,
  //        * });
  //        * await modal.present();
  //        * await modal.onDidDismiss();  // Wait for close modal
  //        **/
  //     }

  //     await AdMob.initialize({
  //       testingDevices: [] ,
  //       initializeForTesting: environment.admobTest,
  //     });
  //     resolve({});
  //   })
  // }

  // showBanner() {
  //   return new Promise(async (resolve)=>{
  //     // const isShownBanner = this.appStates.getIsShownBanner();
  //     // console.log(this.TAG,"isShownBanner",isShownBanner);
  //     // if(isShownBanner){
  //     //   return resolve({});
  //     // }
  //     // this.appStates.setIsShownBanner(true);

  //     AdMob.addListener(BannerAdPluginEvents.Loaded, () => {
  //       console.log(this.TAG,'BannerAdPluginEvents.Loaded');
  //     });

  //     AdMob.addListener(BannerAdPluginEvents.SizeChanged, (size: AdMobBannerSize) => {
  //       console.log(this.TAG,'BannerAdPluginEvents.SizeChanged',size);
  //     });

  //     const options: BannerAdOptions = {
  //       adId: 'ca-app-pub-2424323323577681/4618343494',
  //       adSize: BannerAdSize.BANNER,
  //       position: BannerAdPosition.BOTTOM_CENTER,
  //       margin: 0,
  //       isTesting: true
  //       // npa: true
  //     };
  //     console.log(this.TAG,"AdMob.showBanner");
  //     AdMob.showBanner(options);
  //     resolve({});
  //   })
  // }

  // hideBanner(){
  //   console.log(this.TAG,'hideBanner');
  //   // AdMob.hideBanner();
  // }




  async initialAdmob(){
    const { status } = await AdMob.trackingAuthorizationStatus();
    console.log(this.TAG,status);
    if (status === 'notDetermined') {
      /**
       * If you want to explain TrackingAuthorization before showing the iOS dialog,
       * you can show the modal here.
       * ex)
       * const modal = await this.modalCtrl.create({
       *   component: RequestTrackingPage,
       * });
       * await modal.present();
       * await modal.onDidDismiss();  // Wait for close modal
       **/
    }

    await AdMob.initialize({
      testingDevices: [] ,
      initializeForTesting: environment.admobTest,
    });
    this.showBanner();
  }

  showBanner() {
    console.log(this.TAG,"showBanner");
    AdMob.addListener(BannerAdPluginEvents.Loaded, () => {
      console.log(this.TAG,'BannerAdPluginEvents.Loaded');
    });

    AdMob.addListener(BannerAdPluginEvents.SizeChanged, (size: AdMobBannerSize) => {
      console.log(this.TAG,'BannerAdPluginEvents.SizeChanged',size);
    });


    let adId = '';
    if(this.commonUseUtil.isNativeAndroid()){
      adId = 'ca-app-pub-2424323323577681/8312174678';
    }
    if(this.commonUseUtil.isNativeIos()){
      adId = '';
    }
    const options: BannerAdOptions = {
      adId: adId,
      adSize: BannerAdSize.BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 0,
      isTesting: environment.admobTest
      // npa: true
    };
    AdMob.showBanner(options);
  }

  async showInterstitial() {
    if(!this.commonUseUtil.isShowInterstitial()){return;}

    console.log(this.TAG,"showInterstitial");
    AdMob.addListener(InterstitialAdPluginEvents.Loaded, (info: AdLoadInfo) => {
      // Subscribe prepared interstitial
      console.log(this.TAG,'InterstitialAdPluginEvents.Loaded',info);
    });

    let adId = '';
    if(this.commonUseUtil.isNativeAndroid()){
      adId = 'ca-app-pub-2424323323577681/1746766324';
    }
    if(this.commonUseUtil.isNativeIos()){
      adId = '';
    }
    const options: AdOptions = {
      adId: adId,
      isTesting: environment.admobTest
      // npa: true
    };
    await AdMob.prepareInterstitial(options);
    await AdMob.showInterstitial();
  }

  showRewardVideo() {
    return new Promise(async (resolve)=>{
      console.log(this.TAG,"showRewardVideo");
        AdMob.addListener(RewardAdPluginEvents.Loaded, (info: AdLoadInfo) => {
          // Subscribe prepared rewardVideo
          console.log(this.TAG,'RewardAdPluginEvents.Loaded',info);
        });

        AdMob.addListener(RewardAdPluginEvents.Rewarded, (rewardItem: AdMobRewardItem) => {
          // Subscribe user rewarded
          console.log(this.TAG,'RewardAdPluginEvents.Rewarded',rewardItem);
        });

        let adId = '';
        if(this.commonUseUtil.isNativeAndroid()){
          adId = 'ca-app-pub-2424323323577681/6679243395';
        }
        if(this.commonUseUtil.isNativeIos()){
          adId = '';
        }
        const options: RewardAdOptions = {
          adId: adId,
          isTesting: environment.admobTest
          // npa: true
          // ssv: {
          //   userId: "A user ID to send to your SSV"
          //   customData: JSON.stringify({ ...MyCustomData })
          // }
        };
        await AdMob.prepareRewardVideoAd(options);
        const rewardItem = await AdMob.showRewardVideoAd();
        console.log(this.TAG,"rewardItem",rewardItem);

        resolve({});
    })

  }
}
