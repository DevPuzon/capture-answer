import { Component, OnInit } from '@angular/core';
import { AdmobUtil } from 'src/app/core/utils/admob.util';

@Component({
  selector: 'app-rewards',
  templateUrl: './rewards.page.html',
  styleUrls: ['./rewards.page.scss'],
})
export class RewardsPage implements OnInit {

  constructor(private adMobUtil:AdmobUtil) { }

  ngOnInit() {
  }

  async onGetReward(){
    await this.adMobUtil.showRewardVideo();
  }
}
