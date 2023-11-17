import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { AdmobUtil } from 'src/app/core/utils/admob.util';
import { CommonUseService } from 'src/app/services/common-use.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-rewards',
  templateUrl: './rewards.page.html',
  styleUrls: ['./rewards.page.scss'],
})
export class RewardsPage implements OnInit {

  constructor(private adMobUtil:AdmobUtil,
              private toastService:ToastService,
              private commonUseService:CommonUseService,
              private loadingController:LoadingController) { }

  ngOnInit() {
  }

  async onGetReward(){
    const load = await this.loadingController.create({message:"Please wait..."});
    await load.present();
    await this.adMobUtil.showRewardVideo();
    await this.commonUseService.claimFreeAiChat();
    await this.toastService.rewardToast("Reward claimed successfully.");
    await load.dismiss();
  }
}
