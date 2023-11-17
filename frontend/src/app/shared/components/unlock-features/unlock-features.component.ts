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

  textPaymentTerm = '';
  packages = [
    {
      id:"one",
      title:"Discounted",
      description:"20 tokens",
      price:1,
      selected:true
    },
    {
      id:"five",
      title:"Silver",
      description:"200 tokens",
      price:5,
      selected:false
    },
    {
      id:"ten",
      title:"Gold",
      description:"450 tokens",
      price:10,
      selected:false
    },
    {
      id:"fifteen",
      title:"Diamond",
      description:"750 tokens",
      price:15,
      selected:false
    }
  ];
  selectedPackage = this.packages[0];

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
    const language = this.commonUseUtil.getLocalLanguage();
    console.log('langauge',language);

    if(this.commonUseUtil.isNativeIos()){
      this.textPaymentTerm = 'You have the freedom to cancel your subscription at any time by accessing the Payment & Subscriptions section within the Apple Store.';
    }else{
      this.textPaymentTerm = 'You have the freedom to cancel your subscription at any time by accessing the Payment & Subscriptions section within the Google Play Store.';
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
    for(let [i,val] of this.packages.entries()){
      if(i == selectedPlanIndex){
        val.selected = true;
        this.selectedPackage = val;
      }
    }
  }

  async onSubscribe(){
    const subscriptionId = this.commonUseUtil.getSubscriptionId(this.selectedPackage.id);
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
    // this.checkShowGiftModal();
  }

  // async checkShowGiftModal() {
  //   //const isNewUser = this.commonUseUtil.isNewUser();
  //   const isCanGetGift = await this.commonUseService.isCanGetGift();
  //   console.log("checkShowGiftModal",isCanGetGift);
  //   if(isCanGetGift){
  //     this.dialog.open(PopupGiftComponent, {
  //       width: '360px',
  //       height:'480px',
  //       disableClose:true
  //     });
  //   }
  // }

}
