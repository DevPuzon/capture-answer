import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Subject, takeUntil } from 'rxjs';
import { AppStates } from 'src/app/core/app-states';
import { AdmobUtil } from 'src/app/core/utils/admob.util';
import { CommonUseUtil } from "src/app/core/utils/common-use.util";
import { CommonUseService } from 'src/app/services/common-use.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-rewards',
  templateUrl: './rewards.page.html',
  styleUrls: ['./rewards.page.scss'],
})
export class RewardsPage implements OnInit,OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  availableRewardsCount = 3;

  constructor(private adMobUtil:AdmobUtil,
              private appStates:AppStates,
              private commonUseUtil: CommonUseUtil,
              private toastService:ToastService,
              private commonUseService:CommonUseService,
              private loadingController:LoadingController) {


    this.appStates.listenAvailableRewardsCount()
    .pipe(takeUntil(this.destroy$))
    .subscribe((availableRewardsCount)=>{
      this.availableRewardsCount = availableRewardsCount;
    });
  }

  ngOnInit() {
    this.init();
  }

  async init() {
    this.commonUseService.checkRewards();
  }

  async onGetReward(){
    if(this.availableRewardsCount >= 3){
      return;
    }

    const load = await this.loadingController.create({message:"Please wait..."});
    await load.present();

    if(this.commonUseUtil.isNativeAndroid() || this.commonUseUtil.isNativeIos()){
      await this.adMobUtil.showRewardVideo();
    }

    await this.commonUseService.claimFreeAiChat();
    await this.toastService.rewardToast("Reward claimed successfully.");
    await load.dismiss();
  }












  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
