import {
  Injectable
} from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  CanActivate,
  Route,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import {
  Observable
} from 'rxjs';
import { CommonUseUtil } from "../core/utils/common-use.util";
import {
  ModalController,
  Platform
} from '@ionic/angular';
import {
  UnlockFeaturesComponent
} from '../shared/components/unlock-features/unlock-features.component';
import {
  AdmobUtil
} from '../core/utils/admob.util';
import {
  AppStates
} from '../core/app-states';

@Injectable({
  providedIn: 'root'
})
export class IntroGuardGuard implements CanActivate {
  constructor(private commonUseUtil: CommonUseUtil,
    private modalController: ModalController,
    private admobUtils: AdmobUtil,
    private platform: Platform,
    private appStates: AppStates,
    private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable < boolean | UrlTree > | Promise < boolean | UrlTree > | boolean | UrlTree {


    const isNewUser = this.commonUseUtil.isNewUser();

    if (!isNewUser) {
      this.router.navigate(['dashboard', 'main-camera-dashboard']);
    }

    console.log("can activate intro", !isNewUser);
    this.commonUseUtil.setCountShowOffer();
    return true;
  }

}
