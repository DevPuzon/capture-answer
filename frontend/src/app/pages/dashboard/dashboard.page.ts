import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationEnd, Router } from '@angular/router';
import { Browser } from '@capacitor/browser';
import { AlertController, LoadingController, MenuController, ModalController, Platform } from '@ionic/angular';
import { IonModal } from '@ionic/angular/common';
import { TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { AppStates } from 'src/app/core/app-states';
import { APPLICATION_ID, APP_NAME, SHARE_APP_MESSAGE, } from 'src/app/core/global-variable';
import { AdmobUtil } from 'src/app/core/utils/admob.util';
import { CommonUseUtil } from "src/app/core/utils/common-use.util";
import { CommonUseService } from 'src/app/services/common-use.service';
import { RateAppService } from 'src/app/services/rate-app.service';
import { ToastService } from 'src/app/services/toast.service';
import { PopupGiftComponent } from 'src/app/shared/components/popup-gift/popup-gift.component';
import { UnlockFeaturesComponent } from 'src/app/shared/components/unlock-features/unlock-features.component';
import { Share } from '@capacitor/share';
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
  remainingFreeAiChat:number =0;
  isLoading:boolean = false;

  constructor(private commonUseUtil : CommonUseUtil,
              private router : Router,
              private modalController:ModalController,
              private appStates:AppStates,
              private platform: Platform,
              private rateAppService:RateAppService,
              private toastService : ToastService,
              private commonUseService:CommonUseService,
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
          this.headerTitle = 'ai chat lounge';
        }else if(event.url.includes('settings')){
          this.headerTitle = 'settings';
        }else if(event.url.includes('open-source-libraries')){
          this.headerTitle = "open source libraries";
        }else if(event.url.includes('rewards')){
          this.headerTitle = "rewards";
        }else{
          this.headerTitle = 'capture & answer';
        }
      }
    });

    this.appStates.listenIsUserPremium()
    .pipe(takeUntil(this.destroy$))
    .subscribe((value)=>{
      this.isPremium = value;
    });

    this.appStates.listenFreeUserChat()
    .pipe(takeUntil(this.destroy$))
    .subscribe((remainingFreeAiChat)=>{
      this.remainingFreeAiChat = remainingFreeAiChat;
    });

    this.appStates.listenLoading()
    .pipe(takeUntil(this.destroy$))
    .subscribe((isLoading)=>{
      this.isLoading = isLoading;
    });
  }


  ngOnInit() {
    this.commonUseUtil.setNotNewUser();
    // this.checkShowGiftModal();  //TO MOVE
    this.appStates.setIsShowBanner(true);
    // this.admobUtil.initialAdmob();

    setTimeout(() => {
      this.checkShowGiftModal();
    }, 2500);
  }

  async checkShowGiftModal() {
    //const isNewUser = this.commonUseUtil.isNewUser();

    this.appStates.setLoading(true);
    const isCanGetGift = await this.commonUseService.isCanGetGift();
    this.appStates.setLoading(false);

    console.log("checkShowGiftModal",isCanGetGift);
    if(isCanGetGift){
      const modal = await this.modalController.create({
        backdropDismiss:false,
        component:PopupGiftComponent,
        id:"popup-gift-modal"
      })
      await modal.present();
    }
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
      case'SEND_US_A_MESSAGE':
        this.onFeedback();
      break;
      case'OPEN_SOURCE_LIBRARIES':
        this.onOpenSource();
      break;
      case'CHAT_WITH_AI':
        this.onChatWithAi();
      break;
      case'SETTINGS':
        this.onSettings();
      break;
      case'SHARE_APP':
        this.onShareApp();
      break;
      case 'RATE_APP_ON_GOOGLE_PLAY':
        this.onAppRate();
      break;
      case 'REWARDS':
        this.onRewards();
      break;
      case'PRIVACY_POLICY':
        this.onOpenPrivacyPolicy();
      break;
      default:
        console.error("item doesn't match")
      break;
    }
  }

  async onOpenPrivacyPolicy() {
    this.commonUseUtil.setIsStartCamera(false);
    await Browser.open({
      url:'https://medium.com/@wondertechphclub/privacy-policy-cf05313237ec'
    })
    if(this.commonUseUtil.isNativeAndroid() || this.commonUseUtil.isNativeIos()){
      this.commonUseUtil.setIsStartCamera(false);
    }
    await Browser.addListener('browserFinished', ()=>{
      this.commonUseUtil.setIsStartCamera(true);
    })
  }

  onRewards() {
    this.router.navigate(['dashboard','rewards']);
  }

  async onShareApp() {
    await Share.share({
      text: SHARE_APP_MESSAGE
    });
  }

  onSettings() {
    this.router.navigate(['dashboard','settings']);
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
