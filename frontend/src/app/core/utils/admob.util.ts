import {
  Injectable
} from '@angular/core';
import { AdMob, BannerAdOptions, BannerAdSize, BannerAdPosition, BannerAdPluginEvents, AdMobBannerSize, InterstitialAdPluginEvents, AdOptions, AdLoadInfo, RewardAdPluginEvents, AdMobRewardItem, RewardAdOptions } from '@capacitor-community/admob';
import { environment } from 'src/environments/environment';
import { AppStates } from '../app-states';

@Injectable({
  providedIn: 'root'
})
export class AdmobUtil {
  private readonly TAG = "[AdmobUtil]";
  constructor(private appStates:AppStates ) {
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

  hideBanner(){
    console.log(this.TAG,'hideBanner');
    AdMob.hideBanner();
  }




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

    const options: BannerAdOptions = {
      adId: 'ca-app-pub-2424323323577681/4618343494',
      adSize: BannerAdSize.BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 0,
      isTesting: true
      // npa: true
    };
    AdMob.showBanner(options);
  }
}
