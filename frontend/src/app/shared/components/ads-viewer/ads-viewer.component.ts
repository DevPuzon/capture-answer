import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Subject, takeUntil } from 'rxjs';
import { AppStates } from 'src/app/core/app-states';
import { AdmobUtil } from 'src/app/core/utils/admob.util';

@Component({
  selector: 'app-ads-viewer',
  templateUrl: './ads-viewer.component.html',
  styleUrls: ['./ads-viewer.component.scss'],
})
export class AdsViewerComponent  implements OnInit,OnDestroy {
  private destroy$ = new Subject<void>();
  isPremium = false;

  constructor(private admobUtil:AdmobUtil,
              private platform:Platform,
              private appStates:AppStates) {
    platform.ready().then(()=>{
    })
  }

  async ngOnInit() {
    // let listenPremiumI = 0;
    // this.appStates.listenIsUserPremium().pipe(takeUntil(this.destroy$))
    // .subscribe((isPremium:boolean)=>{
    //   if(listenPremiumI >= 1){
    //     if(isPremium){
    //       this.admobUtil.hideBanner();
    //     }else{
    //       // this.admobUtil.showBanner();
    //     }
    //   }
    //   listenPremiumI++;
    // })

    this.appStates.listenIsUserPremium().pipe(takeUntil(this.destroy$))
    .subscribe((isPremium:boolean)=>{
      this.isPremium = isPremium;
    });

  }

  ngOnDestroy(): void {
    console.log("ngOnDestroy AdsViewerComponent")
    this.destroy$.next();
    this.destroy$.complete();
  }
}
