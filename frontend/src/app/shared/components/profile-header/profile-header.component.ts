import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { AppStates } from 'src/app/core/app-states';
import { UnlockFeaturesComponent } from '../unlock-features/unlock-features.component';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from 'src/app/services/toast.service';
import { CommonUseUtil } from "src/app/core/utils/common-use.util";

@Component({
  selector: 'ocr-profile-header',
  templateUrl: './profile-header.component.html',
  styleUrls: ['./profile-header.component.scss'],
})
export class ProfileHeaderComponent  implements OnInit,OnDestroy {
  @Input('isShowRight') isShowRight = false;
  remainingTokens : string = '0';
  private destroy$:Subject<void> = new Subject<void>();

  constructor(
    private appStates:AppStates,
    private commonUseUtil:CommonUseUtil,
    private modalController:ModalController,
    private translateService: TranslateService,
    private toastService:ToastService) { }

  ngOnInit() {
    this.appStates.listenRemainingTokens()
    .pipe(takeUntil(this.destroy$)).subscribe((tokens)=>{
      console.log('ProfileHeaderComponent',tokens);
      this.remainingTokens = this.commonUseUtil.formatNumber(tokens);
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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

  // async onOcrPremiumQuantityClicked() {
  //   if(!this.remainingScans || +this.remainingScans == 0)
  //     (await this.toastService.presentToast(this.translateService.instant("0_OCR_TO_USE"),3000));
  //   else
  //     (await this.toastService.presentToast(this.translateService.instant("X_OCR_TO_USE", { remainingScans: this.remainingScans }),3000));
  // }

}
