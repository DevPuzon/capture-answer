import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Browser } from '@capacitor/browser';
import { AlertController, LoadingController, MenuController, ModalController, Platform } from '@ionic/angular';
import { IonModal } from '@ionic/angular/common';
import { TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { AppStates } from 'src/app/core/app-states';
import { APPLICATION_ID, APP_NAME, } from 'src/app/core/global-variable';
import { AdmobUtil } from 'src/app/core/utils/admob.util';
import { CommonUseUtil } from 'src/app/core/utils/common-use.util';
import { CommonUseService } from 'src/app/services/common-use.service';
import { RateAppService } from 'src/app/services/rate-app.service';
import { ToastService } from 'src/app/services/toast.service';
import { PopupGiftComponent } from 'src/app/shared/components/popup-gift/popup-gift.component';
import { UnlockFeaturesComponent } from 'src/app/shared/components/unlock-features/unlock-features.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit,OnDestroy {
  @ViewChild('modalI') modalI!: IonModal;

  private destroy$: Subject<void> = new Subject<void>();
  headerTitle = 'capture & answer';
  showFiller = false;
  isPremium: boolean = false;
  constructor(private commonUseUtil : CommonUseUtil,
              private router : Router,
              private modalController:ModalController,
              private appStates:AppStates,
              private admobUtil:AdmobUtil,
              private platform: Platform,
              private rateAppService:RateAppService,
              private loadingController : LoadingController,
              private toastService : ToastService,
              private commonUseService:CommonUseService,
              private alertController : AlertController,
              private translateService: TranslateService,
              // private menuController : MenuController
              ) {
    this.router.events
    .pipe(takeUntil(this.destroy$))
    .subscribe((event) => {
      if (event instanceof NavigationEnd) {
        console.log('URL changed to:', event.url);
        if(event.url.includes('history')){
          this.headerTitle = 'history';
        }else if(event.url.includes('chat-with-ai')){
          this.headerTitle = 'chat with ai';
        }else if(event.url.includes('open-source-libraries')){
          this.headerTitle = "open source libraries";
        }else{
          this.headerTitle = 'capture & answer';
        }
      }
    });
    this.isPremium = this.appStates.getIsUserPremium();
    this.appStates.listenIsUserPremium().subscribe((value)=>{
      this.isPremium = this.appStates.getIsUserPremium();
    });
  }


  ngOnInit() {
    this.commonUseUtil.setNotNewUser();
    // this.checkShowGiftModal();  //TO MOVE
    this.appStates.setIsShowBanner(true);
    // this.admobUtil.initialAdmob();
  }

  onCloseMenu(){
    console.log('onCloseMenu');
    // this.menuController.close('dashboardMenu');
  }

  onClickItemMenu(item : string){
    this.modalI.dismiss();
    // this.menuController.toggle();
    switch(item){
      case'MAIN':
        this.onMain();
      break;
      case'UNLOCK_FEATURES':
        this.onUnlockFeatures();
      break;
      case'MANAGE_MY_SUBSCRIPTION':
        this.onManageSubscription();
      break;
      case'HISTORY':
        this.onHistory();
      break;
      case'SEND_US_A_FEEDBACK':
        this.onFeedback();
      break;
      case'OPEN_SOURCE_LIBRARIES':
        this.onOpenSource();
      break;
      case'CHAT_WITH_AI':
        this.onChatWithAi();
      break;
      case 'RATE_APP_ON_GOOGLE_PLAY':
        this.onAppRate();
      break;

      default:
        console.error("item doesn't match")
      break;
    }
  }

  onChatWithAi() {
    this.router.navigate(['dashboard','chat-with-ai']);
  }

  onAppRate() {
    this.rateAppService.promptForRating();
  }

  onMain() {
    this.router.navigate(['dashboard','main-camera-dashboard']);
  }

  async onUnlockFeatures() {
    // this.router.navigate(['unlock-features']);
    const modal = await this.modalController.create(
      {
        component:UnlockFeaturesComponent,
        backdropDismiss:false
      }
    )
    modal.present();
  }

  async onManageSubscription() {
    if(!this.isPremium){
      this.toastService.presentToast(this.translateService.instant("TOAST_MESSAGE_PREMIUM_ACCESS_UNAVAILABLE"), 3000);
      return;
    }

    let url = '';
    if (this.platform.is('ios')) {
      // Direct users to the subscription management page on iOS
      url = 'itms-apps://buy.itunes.apple.com/WebObjects/MZFinance.woa/wa/manageSubscriptions';
      //url = 'https://buy.itunes.apple.com/WebObjects/MZFinance.woa/wa/manageSubscriptions';
    } else if (this.platform.is('android')) {
      // Direct users to the subscription management page on Android
      url = 'https://play.google.com/store/account/subscriptions';
    } else {
      // Handle other platforms or web version
      await ( await this.toastService.presentToast(this.translateService.instant("SYSTEM_OS_NOT_SUPPORTED"), 3000));
      console.warn('This platform is not supported for managing subscriptions');
      return;
    }

    // Open the URL in the external system browser
    window.open(url, '_system');
  }

  async onHistory() {
    this.router.navigate(['dashboard','history']);
  }

  async onFeedback() {
    const recipientEmail = 'softwaresolutionph@gmail.com';
    const subject = APP_NAME+' Feedback';
    const mailtoLink = `mailto:${recipientEmail}?subject=${subject}`;
    window.location.href = mailtoLink;
  }

  onOpenSource() {
    this.router.navigate(['dashboard','open-source-libraries']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}