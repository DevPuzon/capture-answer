import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController, Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { AppStates } from 'src/app/core/app-states';
import { GOLD_SCANS, PLATINUM_SCANS } from 'src/app/core/global-variable';
import { AppPurchaseUtil } from 'src/app/core/utils/app-purchase.utils';
import { CommonUseUtil } from 'src/app/core/utils/common-use.util';
import { CommonUseService } from 'src/app/services/common-use.service';
import { ToastService } from 'src/app/services/toast.service';
import { PopupGiftComponent } from '../popup-gift/popup-gift.component';
import { MatDialog } from '@angular/material/dialog';
import { AdmobUtil } from 'src/app/core/utils/admob.util';


@Component({
  selector: 'app-unlock-features',
  templateUrl: './unlock-features.component.html',
  styleUrls: ['./unlock-features.component.scss'],
})
export class UnlockFeaturesComponent implements OnInit, AfterViewInit, OnDestroy {
  selectedPlan = 'monthly';
  textPaymentTerm = '';
  packages = [
    {
      textPlan:"MONTHLY_PLAN",
      description:"Lorem",
      price:5,
      selected:true
    },
    {
      textPlan:"ANNUAL_PLAN",
      description:"Lorem",
      price:15,
      selected:false
    },
  ];

  // platinumPackages = [
  //   {
  //     textPlan:"MONTHLY_PLAN",
  //     price:8,
  //     selected:false
  //   },
  //   {
  //     textPlan:"ANNUAL_PLAN",
  //     price:18,
  //     selected:false
  //   }
  // ];
  // scans = GOLD_SCANS;


  constructor(private router:Router,
              private toastService:ToastService,
              private commonUseService:CommonUseService,
              private loadingController:LoadingController,
              private modaController:ModalController,
              private platform:Platform,
              private appStates:AppStates,
              private dialog: MatDialog,
              private appPurchaseUtil:AppPurchaseUtil,
              private translateService: TranslateService,
              private admobUtils: AdmobUtil,
              private commonUseUtil:CommonUseUtil) {

    platform.ready().then(async () => {
      //this.appPurchaseUtil.initialize();
      //Preload
    });
  }

  ngOnInit() {
    this.appStates.setCanShowAds(false);
    this.admobUtils.hideBanner();
    setTimeout(() => {
      this.admobUtils.hideBanner(); //HACk
    }, 100);

    if(this.commonUseUtil.isNativeIos()){
      this.textPaymentTerm = 'The yearly subscription costs 50 USD and automatically renews annually, while the monthly subscription is priced at 5 USD and automatically renews every month. You have the freedom to cancel your subscription at any time by accessing the Payment & Subscriptions section within the Apple Store.';
    }else{
      this.textPaymentTerm = 'The yearly subscription costs 50 USD and automatically renews annually, while the monthly subscription is priced at 5 USD and automatically renews every month. You have the freedom to cancel your subscription at any time by accessing the Payment & Subscriptions section within the Google Play Store.';
    }
  }

  ngAfterViewInit() {
    this.admobUtils.hideBanner();
  }

  ngOnDestroy(){
    this.appStates.setCanShowAds(true);
  }

  onChangePackage(selectedPlanIndex:number,selectedPlan:string){
    for(let [i,val] of this.packages.entries()){val.selected=false;}
    this.selectedPlan = selectedPlan == "MONTHLY_PLAN" ? "monthly":"yearly";

    for(let [i,val] of this.packages.entries()){
      if(i == selectedPlanIndex){
        val.selected = true;
      }
    }
  }

  async onSubscribe(){
    const subscriptionId = this.commonUseUtil.getSubscriptionId(this.selectedPlan);
    console.log("onSubscribe",subscriptionId);
    const load = await this.loadingController.create({message: 'Please wait...' });
    await load.present();
    const isSuccess = await this.appPurchaseUtil.orderProduct(subscriptionId);
    console.log('isSuccess',isSuccess,subscriptionId);
    await load.dismiss();
    if(isSuccess){
      await (await this.toastService.presentToast(this.translateService.instant("SUBSCRIBED_OK"), 2500));
      // this.appStates.setIsShowBanner(true);
      await this.modaController.dismiss();
    }
  }

  // onChangeOffer(event:any){
  //   this.scans = event.index == 0 ? GOLD_SCANS : PLATINUM_SCANS;
  // }

  async onClose(){
    // this.appStates.setIsShowBanner(true);
    await this.modaController.dismiss();
    this.checkShowGiftModal();
  }

  async checkShowGiftModal() {
    //const isNewUser = this.commonUseUtil.isNewUser();
    const isCanGetGift = await this.commonUseService.isCanGetGift();
    console.log("checkShowGiftModal",isCanGetGift);
    if(isCanGetGift){
      this.dialog.open(PopupGiftComponent, {
        width: '360px',
        height:'480px',
        disableClose:true
      });
    }
  }

}
