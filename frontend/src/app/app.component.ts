import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, Platform } from '@ionic/angular';
import { NativePermissionsUtil } from './core/utils/native-permissions.util';
import { CommonUseUtil } from './core/utils/common-use.util';
import { CommonUseService } from './services/common-use.service';
import { AppStates } from './core/app-states';
import { AppPurchaseUtil } from './core/utils/app-purchase.utils';
import { AdmobUtil } from './core/utils/admob.util';
import { TranslateService } from '@ngx-translate/core';
import { RateAppService } from './services/rate-app.service';
import { CryptUtil } from './core/utils/crypt.util';
import { environment } from 'src/environments/environment';
import { PushNotificationUtil } from './core/utils/push-notification.util';
import { SplashScreen } from '@capacitor/splash-screen';
import { Router } from '@angular/router';
import { UnlockFeaturesComponent } from './shared/components/unlock-features/unlock-features.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  isShowSplash = false;
  constructor(private platform : Platform,
              private commonUseUtil : CommonUseUtil,
              private router:Router,
              private modalController : ModalController,
              private commonUseService:CommonUseService,
              private loadingController:LoadingController,
              private appStates : AppStates,
              private appPurchaseUtil:AppPurchaseUtil,
              private rateAppService: RateAppService,
              private pushNotificationUtil:PushNotificationUtil,
              private nativePermissionUtil:NativePermissionsUtil,
              private translateService: TranslateService) {
    this.initPlatformDependents();
  }

  private async initPlatformDependents(){
    // await SplashScreen.hide();
    //On Ready
    this.platform.ready().then(async () => {
      console.log('platform.ready');
      this.translateService.setDefaultLang('en');
      this.appPurchaseUtil.initialize();

      // this.pushNotificationUtil.registerNotifications();
      // this.nativePermissionUtil.cameraAndroidPermission();
      // this.rateAppService.init();
    });

    //Become Active - AKA Restart
    this.platform.resume.subscribe((res) => {
      console.log('platform.resumed');
      // this.rateAppService.init();
    });

    //Pause
    this.platform.pause.subscribe((res) => {
      console.log('platform.paused');
    });

    this.initApp();
  }

  ngOnInit(): void {
  }

  // async initPrepareAdmob() {
  //   let listenShowI = 0;
  //   this.appStates.listenIsUserPremium().subscribe(async(isPremium)=>{
  //     if(listenShowI >= 1){
  //       if(isPremium){
  //         await this.admobUtil.hideBanner();
  //       }
  //     }
  //     listenShowI++;
  //   })
  // }

  async initApp() {
    const isNewUser = this.commonUseUtil.isNewUser();
    if(!isNewUser){
      // const load = await this.loadingController.create({message: 'Please wait...' })
      // await load.present();
      this.isShowSplash = true;
      this.appStates.setLoading(true);
      // this.appStates.setHistories(await this.commonUseService.getHistoryList());
      this.commonUseUtil.checkSettings();
      await this.commonUseService.checkFreePremium();
      this.isShowSplash = false;
      // await load.dismiss();

      this.showUnlockFeature();
      this.appStates.setLoading(false);
    }
  }

  showUnlockFeature() {
    const isNewUser = this.commonUseUtil.isNewUser();
    const isPremium = this.appStates.getIsUserPremium();
    const isShowOfferPlan = this.commonUseUtil.isShowOfferPlan();

    if (!isNewUser && isShowOfferPlan && !isPremium) {
      this.router.navigate(['dashboard', 'main-camera-dashboard']);
      this.commonUseUtil.setCountShowOffer(true);
      this.modalController.create({
        component: UnlockFeaturesComponent,
        backdropDismiss: false
      }).then(
        (modal) => {
          modal.present();
          modal.onDidDismiss().then((dataReturned) => {});
        })
    }
  }
}
