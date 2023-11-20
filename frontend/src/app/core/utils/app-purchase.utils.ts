import {
  Injectable
} from '@angular/core';
import {
  Plugins
} from '@capacitor/core';
import {
  LAST_PURCHASED_PRODUCT_ID,
   SUBSCRIPTION_IDS
} from '../global-variable';
import {
  Platform
} from '@ionic/angular';
// import {
//   Store,
//   Select,
//   State
// } from "@ngxs/store";
import "cordova-plugin-purchase";
import { CommonUseUtil } from './common-use.util';
import { CommonUseService } from 'src/app/services/common-use.service';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PurchaseResponse } from 'src/app/models/purchase-response.model';
// declare const CdvPurchase : any;
@Injectable({
  providedIn: 'root'
})
export class AppPurchaseUtil {
  private listenBuyProduct = new BehaviorSubject<PurchaseResponse>({productId:'',purchaseId:'',isSuccess:false,payload:null});
  private buying = false;
  private productId = '';

  constructor(private commonUseUtil:CommonUseUtil,
              private commonUseService:CommonUseService) {
    // this.initialize();
  }

  async initialize() {
    console.log("[Store] initialize");
    const registerProducts = this.getRegisterProducts();
    console.log("[Store] initialize",registerProducts);
    CdvPurchase.store.register(registerProducts);

    CdvPurchase.store.when().approved((transaction) => transaction.verify());
    CdvPurchase.store.when().unverified((unverified) => {
      console.log(`[Store] Unverified. code: ${unverified.payload.code}, ` +
        "status: " + unverified.payload.status + ", " + unverified.payload.message);
    });
    CdvPurchase.store.when().receiptsReady((receipt)=>{
      console.log('[Store] receiptsReady.',receipt);
    });
    CdvPurchase.store.when().receiptUpdated((receipt)=>{
      console.log('[Store] receiptUpdated.',receipt);
    });
    CdvPurchase.store.when().productUpdated((product)=>{
      console.log('[Store] productUpdated.',product);
    });

    CdvPurchase.store.when().verified(async (receipt) => {
      console.log('[Store] 1 Verified.',receipt);
      // for(let [i,val] of registerProducts.entries()){
      //   console.log('[Store] 2 Verified.',CdvPurchase.store.owned(val.id));
      //   if (CdvPurchase.store.owned(val.id)) {
      //     const productId = val.id;
      //     await this.doneProductPuchase(this.productId,receipt);
      //   }
      // }

      await this.doneProductPuchase(this.productId,receipt);
      receipt.finish();
    });

    CdvPurchase.store.error(error => {
      console.log('[Store] ERROR',error);
      this.listenBuyProduct.next({productId:'',purchaseId:'',isSuccess:false,payload:null});
      this.buying = false;
      if (error.code === CdvPurchase.ErrorCode.PAYMENT_CANCELLED) {
        console.log('[Store] The user cancelled the purchase flow.');
        return;
      }
    });

    CdvPurchase.store.verbosity = CdvPurchase.LogLevel.DEBUG;
    let platform = CdvPurchase.Platform.GOOGLE_PLAY;

    if(environment.production){
      if(this.commonUseUtil.isNativeAndroid()){
        platform = CdvPurchase.Platform.GOOGLE_PLAY;
      }
      if(this.commonUseUtil.isNativeIos()){
        platform = CdvPurchase.Platform.APPLE_APPSTORE;
      }
    }
    console.log("[Store] initialize",platform)
    await CdvPurchase.store.initialize([platform]);
  }

  orderProduct(productId:string) {
    return new Promise<PurchaseResponse>((resolve)=>{
      this.productId = productId;
      this.buying = true;
      console.log("[Store] subscriptionId",productId);
      console.log("[Store] Ordering product",CdvPurchase.store.get(productId));
      const offer = CdvPurchase.store.get(productId)?.getOffer();
      console.log("[Store] Ordering product offer",offer);
      offer?.order();
      let listenI = 0;
      const listen = this.listenBuyProduct.asObservable()
      .subscribe((purchaseResponse:PurchaseResponse)=>{
        if(listenI >= 1){
          this.buying = false;
          console.log('[Store] listen',purchaseResponse);
          listen.unsubscribe();
          resolve(purchaseResponse);
        }
        listenI++;
      })
    })
  }

  getRegisterProducts() {
    var subscriptionIds: any = SUBSCRIPTION_IDS;
    var listRegisterProducts:any = [];
    console.log('[Store] subscriptionIds', subscriptionIds);
    for (let x of Object.keys(subscriptionIds)) {
      for (let u of Object.keys(subscriptionIds[x])) {
        let product = null;
        let productId = subscriptionIds[x][u];
        console.log("[Store] getRegisterProducts productId",productId);
        // // #change
        if (this.commonUseUtil.isNativeAndroid() && productId.includes('android')) {
          product = {
            id: productId,
            type: CdvPurchase.ProductType.CONSUMABLE,
            platform: CdvPurchase.Platform.GOOGLE_PLAY
          }
        }

        if (this.commonUseUtil.isNativeIos() && productId.includes('ios')) {
          product = {
            id: productId,
            type: CdvPurchase.ProductType.CONSUMABLE,
            platform: CdvPurchase.Platform.APPLE_APPSTORE
          }
        }
        if(product){
          listRegisterProducts.push(product);
        }

      }
    }

    console.log('[Store] listRegisterProducts', listRegisterProducts);
    return listRegisterProducts;
  }

  doneProductPuchase(productId:string,receipt:any){
    return new Promise(async (resolve)=>{
      console.log("doneProductPuchase",productId,JSON.stringify(receipt),!this.buying);
      if(!this.buying){return;} // to avoid the multiple call of the subscription service

      this.buying = false;
      // await this.commonUseService.onSubscription(true,productId);
      localStorage.setItem(LAST_PURCHASED_PRODUCT_ID,productId);

      let payload:any = null;
      let purchaseId = '';
      if(this.commonUseUtil.isNativeAndroid()){
        payload = JSON.parse(receipt.sourceReceipt.transactions[0].nativePurchase.receipt);
        purchaseId = payload.orderId;
      }

      if(this.commonUseUtil.isNativeIos()){
        // IOS PAYLOAD #change
      }

      this.listenBuyProduct.next({productId:productId,purchaseId:purchaseId,isSuccess:true,payload:payload});

      resolve({});
    })
  }

  unsubsribe(){
  }
}


























// import {
//   Injectable
// } from '@angular/core';
// import {
//   LAST_PURCHASED_PRODUCT_ID,
//   SUBSCRIPTION_IDS
// } from '../global-variable';
// import "cordova-plugin-purchase";
// import {
//   CommonUseUtil
// } from './common-use.util';
// import {
//   CommonUseService
// } from 'src/app/services/common-use.service';
// import {
//   BehaviorSubject
// } from 'rxjs';
// import {
//   environment
// } from 'src/environments/environment';
// import {
//   AppStates
// } from '../app-states';
// import {
//   ToastService
// } from 'src/app/services/toast.service';
// import {
//   LStorage
// } from './lstorage.util';
// @Injectable({
//   providedIn: 'root'
// })
// export class AppPurchaseUtil {
//   private listenBuyProduct = new BehaviorSubject < boolean > (false);
//   private buying = false;
//   store ? : CdvPurchase.Store;

//   constructor(private commonUseUtil: CommonUseUtil,
//     private commonUseService: CommonUseService,
//     private toastService: ToastService,
//     private appStates: AppStates) {
//     // this.initializePurchases();
//   }

//   async initializeV2() {

//   }

//   async initializeV1() {

//     this.store = CdvPurchase.store;

//     console.log("App msg initialize.1");
//     const registerProducts = this.getRegisterProducts();
//     console.log("App msg initialize.2", registerProducts);

//     //REGISTER
//     this.store.register(registerProducts);

//     //APPROVED
//     this.store.when().approved((transaction) => {
//       // This would usually send a receipt to your server for verification
//       transaction.verify()
//     });

//     //VERIFIED
//     this.store.when().verified(async (receipt) => {
//       // Here, you can update your backend or local states to reflect the purchase
//       console.log(`App msg 1 Verified. ${receipt.id}, owned: ${receipt}`);
//       for (let [i, val] of registerProducts.entries()) {
//         if (!this.store) {
//           console.log(`App msg this.store`,this.store);
//           break;
//         }
//         console.log(`App msg 2 Verified. ${receipt.id}, owned: ${val.id}, ${this.store.owned(val.id)}`);
//         if (this.store.owned(val.id)) {
//           const productId = val.id;
//           await this.doneProductPuchase(productId);
//         }
//       }
//       receipt.finish();
//     });

//     //UPDATED
//     this.store.when().productUpdated((product) => {
//       // Handle product updates, like when a subscription is cancelled from outside the app
//       // this.toastService.presentToast('App msg productUpdated: ' + JSON.stringify(product), 1000)

//     });
//     this.store.when().receiptUpdated((receipt) => {
//       // Handle product updates, like when a subscription is cancelled from outside the app
//       // this.toastService.presentToast('App msg receiptUpdated', 1000)

//     });

//     //UNVERIFIED
//     this.store.when().unverified((unverified) => {
//       // Handle the error, e.g., alert the user, etc.
//       console.log(`App msg unverified:`,unverified);
//     });

//     // Show errors for 10 seconds.
//     this.store.error(error => {
//       console.log('App msg ERROR', error);
//       this.listenBuyProduct.next(false);
//       this.buying = false;
//       if (error.code === CdvPurchase.ErrorCode.PAYMENT_CANCELLED) {
//         console.log('The user cancelled the purchase flow.');
//         // this.appStates.setUserPremium(false);
//         return;
//       } else {
//         console.log('ERROR ' + error.code + ': ' + error.message);
//         this.toastService.presentToast(error.message)
//       }
//     });

//     this.store.verbosity = CdvPurchase.LogLevel.DEBUG; //TEMP

//     let platform = CdvPurchase.Platform.TEST;

//     if (environment.production) {
//       if (this.commonUseUtil.isNativeAndroid()) {
//         platform = CdvPurchase.Platform.GOOGLE_PLAY;
//       }
//       if (this.commonUseUtil.isNativeIos()) {
//         platform = CdvPurchase.Platform.APPLE_APPSTORE;
//       }
//     }
//     await this.store.initialize([platform]);
//   }

//   orderProduct(subscriptionId: string) {
//     return new Promise((resolve) => {
//       this.buying = true;
//       // this.toastService.presentToast('App msg Step1.Ordering product: '+subscriptionId, 10000);
//       if (!this.store) {
//         // this.toastService.presentToast('App msg No Store Found', 1000)
//         return resolve(false);
//       }
//       console.log("App msg Ordering product", this.store.get(subscriptionId));
//       // this.toastService.presentToast('App msg Step2.Ordering product: ' + subscriptionId, 10000)
//       const offer = this.store.get(subscriptionId)?.getOffer();
//       console.log("App msg Ordering product offer", offer);
//       // this.toastService.presentToast('App msg Step3.Ordering product: '+subscriptionId, 10000)
//       offer?.order();
//       // this.toastService.presentToast('App msg Step4.Ordering product: '+subscriptionId, 10000)
//       let listenI = 0;
//       if (this.commonUseUtil.isNativeIos()) listenI++; //Not sure what is this or why is requied;
//       const listen = this.listenBuyProduct.asObservable()
//         .subscribe((isSuccess: boolean) => {
//           // this.toastService.presentToast('App msg Step5.Ordering product.isSuccess='+isSuccess+': '+subscriptionId, 10000)
//           if (listenI >= 1) {
//             this.buying = false;
//             console.log('listen', isSuccess);
//             listen.unsubscribe();
//             resolve(isSuccess);
//           }
//           listenI++;
//         })
//     })
//   }

//   getRegisterProducts() {
//     var subscriptionIds: any = SUBSCRIPTION_IDS;
//     var listRegisterProducts:any = [];
//     console.log('subscriptionIds', subscriptionIds);
//     for (let x of Object.keys(subscriptionIds)) {
//       console.log('x', x);
//       for (let u of Object.keys(subscriptionIds[x])) {
//         console.log('u', u);
//         // for(let y of Object.keys(subscriptionIds[x][u])){
//         //     console.log('y',y);
//         //     let product = null;
//         //     let productId = subscriptionIds[x][u][y];
//         //     if(platform == 'android'){
//         //       product = {
//         //           id: productId,
//         //           type: CdvPurchase.ProductType.PAID_SUBSCRIPTION,
//         //           platform: CdvPurchase.Platform.GOOGLE_PLAY
//         //         }
//         //     }else{
//         //         product = {
//         //           id: productId,
//         //           type: CdvPurchase.ProductType.PAID_SUBSCRIPTION,
//         //           platform: CdvPurchase.Platform.APPLE_APPSTORE
//         //         }
//         //     }
//         //     listRegisterProducs.push(product);
//         // }
//         let product = null;
//         let productId = subscriptionIds[x][u];
//         // // #change
//         if (this.commonUseUtil.isNativeAndroid() && productId.includes('android')) {
//           product = {
//             id: productId,
//             type: CdvPurchase.ProductType.CONSUMABLE,
//             platform: CdvPurchase.Platform.GOOGLE_PLAY
//           }
//         }

//         if (this.commonUseUtil.isNativeIos() && productId.includes('ios')) {
//           product = {
//             id: productId,
//             type: CdvPurchase.ProductType.CONSUMABLE,
//             platform: CdvPurchase.Platform.APPLE_APPSTORE
//           }
//         }
//         listRegisterProducts.push(product);
//       }
//     }

//     console.log('listRegisterProducts', listRegisterProducts);
//     return listRegisterProducts;
//   }

//   doneProductPuchase(productId: string) {
//     return new Promise(async (resolve) => {
//       if (!this.buying) {
//         return;
//       } // to avoid the multiple call of the subscription service

//       this.buying = false;
//       // await this.commonUseService.onSubscription(true,productId);
//       this.appStates.setUserForcePremium(true);
//       // localStorage.setItem(LAST_PURCHASED_PRODUCT_ID,productId);
//       LStorage.set(LAST_PURCHASED_PRODUCT_ID, productId);
//       this.listenBuyProduct.next(true);
//       resolve({});
//     })
//   }

//   unsubsribe() {

//   }
// }
