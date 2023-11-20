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
import { environment } from 'src/environments/environment';
import { ProductService } from 'src/app/services/product.service';
import { PurchaseResponse } from 'src/app/models/purchase-response.model';


@Component({
  selector: 'app-unlock-features',
  templateUrl: './unlock-features.component.html',
  styleUrls: ['./unlock-features.component.scss'],
})
export class UnlockFeaturesComponent implements OnInit, AfterViewInit, OnDestroy {

  textPaymentTerm = '';
  packages = [
    {
      id:"one_consumable",
      title:"Discounted",
      description:"20 tokens",
      tokens:20,
      price:1,
      selected:true
    },
    {
      id:"five_consumable",
      title:"Silver",
      tokens:200,
      price:5,
      selected:false
    },
    {
      id:"ten_consumable",
      title:"Gold",
      tokens:450,
      price:10,
      selected:false
    },
    {
      id:"fifteen_consumable",
      title:"Diamond",
      tokens:750,
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
              private productService :ProductService,
              private appStates:AppStates,
              private dialog: MatDialog,
              private appPurchaseUtil:AppPurchaseUtil,
              private translateService: TranslateService,
              private admobUtils: AdmobUtil,
              private commonUseUtil:CommonUseUtil) {

    platform.ready().then(async () => {
      // this.appPurchaseUtil.initialize();
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

    const productId = this.commonUseUtil.getSubscriptionId(this.selectedPackage.id);
    console.log("onSubscribe",productId);
    const load = await this.loadingController.create({message: 'Please wait...' });
    await load.present();

    let purchase:PurchaseResponse = {
      isSuccess:false,
      payload:null,
      productId:productId,
      purchaseId:''
    };
    if(!environment.production && !this.commonUseUtil.isNativeAndroid() && !this.commonUseUtil.isNativeIos()){
      // test browser
      await this.productService.onPurchase('productId-11','purchaseId-11',23,{payloadTest:'payload'})
      purchase.isSuccess = true;
    }else{
      purchase = await this.appPurchaseUtil.orderProduct(productId);
      console.log('onSubscribe purchase',purchase);

    }

    if(purchase.isSuccess){
      const platformIdRm = this.commonUseUtil.isNativeAndroid() ? 'android_' : 'ios_';
      const tokens = this.packages.find((el)=>{return el.id == purchase.productId.replace(platformIdRm,'')})?.tokens as number;
      console.log('onSubscribe tokens',tokens);

      await this.productService.onPurchase(purchase.productId,purchase.purchaseId,tokens,purchase)
      await (await this.toastService.presentToast('Purchase successfully', 2500));

      await load.dismiss();
      await this.modaController.dismiss();

    }else{
      await load.dismiss();
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
