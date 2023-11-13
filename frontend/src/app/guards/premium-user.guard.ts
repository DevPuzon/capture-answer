import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AppStates } from '../core/app-states';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../services/toast.service';

@Injectable({
  providedIn: 'root'
})
export class PremiumUserGuard implements CanActivate {
  constructor(private appStates : AppStates,
              private toastService : ToastService,
              private translateService: TranslateService,
              private router : Router){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      const isPremium = this.appStates.getIsUserPremium();
      if(!isPremium){
        this.toastService.presentToast(this.translateService.instant("TOAST_MESSAGE_PREMIUM_ACCESS_UNAVAILABLE"), 3000);
        this.router.navigate(['dashboard','main-camera-dashboard']);
      }

    return true;
  }
}
