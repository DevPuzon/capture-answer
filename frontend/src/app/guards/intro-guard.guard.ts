import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Route, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { CommonUseUtil } from '../core/utils/common-use.util';
import { ModalController } from '@ionic/angular';
import { UnlockFeaturesComponent } from '../shared/components/unlock-features/unlock-features.component';
import { AdmobUtil } from '../core/utils/admob.util';
import { AppStates } from '../core/app-states';

@Injectable({
  providedIn: 'root'
})
export class IntroGuardGuard implements CanActivate {
  constructor(private commonUseUtil:CommonUseUtil,
              private modalController:ModalController,
              private admobUtils: AdmobUtil,
              private appStates: AppStates,
              private router:Router){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const isNewUser = this.commonUseUtil.isNewUser();
    const isPremium = this.appStates.getIsUserPremium();
    const isShowOfferPlan = this.commonUseUtil.isShowOfferPlan();
    if(!isNewUser ){
      if(isShowOfferPlan && !isPremium){

        this.router.navigate(['dashboard','main-camera-dashboard']);
        this.commonUseUtil.setCountShowOffer(true);
        this.modalController.create(
          {
            component:UnlockFeaturesComponent,
            backdropDismiss:false
          }
        ).then(
          (modal)=>{
            modal.present();
            modal.onDidDismiss().then((dataReturned) => {
            });
          })

      }else{
        this.router.navigate(['dashboard','main-camera-dashboard']);
      }
    }
    console.log("can activate intro",!isNewUser);
    this.commonUseUtil.setCountShowOffer();
    return true;
  }

}
