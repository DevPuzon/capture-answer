import { Component, OnInit } from '@angular/core';
import { LoadingController, Platform } from '@ionic/angular';
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

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private platform : Platform,
              private commonUseUtil : CommonUseUtil,
              private admobUtil : AdmobUtil,
              private commonUseService:CommonUseService,
              private loadingController:LoadingController,
              private appStates : AppStates,
              private appPurchaseUtil:AppPurchaseUtil,
              private rateAppService: RateAppService,
              private nativePermissionUtil:NativePermissionsUtil,
              private translateService: TranslateService) {
    this.initPlatformDependents();

    this.nativePermissionUtil.cameraAndroidPermission();
  }

  private initPlatformDependents(){

    //On Ready
    this.platform.ready().then(async () => {
      console.log('platform.ready');
      this.translateService.setDefaultLang('en');
      this.appPurchaseUtil.initializeV1();
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

  }

  ngOnInit(): void {
    this.initApp();
    var a = CryptUtil.encryptData(environment.firebaseConfig);
    var b = CryptUtil.decryptData(a);
    console.log("a",a);
    console.log("b",b);
    // this.initPrepareAdmob();
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
      const load = await this.loadingController.create({message: 'Please wait...' })
      await load.present();
      this.appStates.setLoading(true);
      this.appStates.setHistories(await this.commonUseService.getHistoryList());
      this.commonUseUtil.checkSettings();
      await this.commonUseService.checkFreePremium();
      await load.dismiss();
      this.appStates.setLoading(false);
    }
  }
}
