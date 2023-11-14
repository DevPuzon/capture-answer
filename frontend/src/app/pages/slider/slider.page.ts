import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SwiperOptions } from 'swiper/types';
import { LoadingController, ModalController } from '@ionic/angular';
import { UnlockFeaturesComponent } from 'src/app/shared/components/unlock-features/unlock-features.component';
import { CommonUseUtil } from 'src/app/core/utils/common-use.util';
import { CommonUseService } from 'src/app/services/common-use.service';
import { AppStates } from 'src/app/core/app-states';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.page.html',
  styleUrls: ['./slider.page.scss'],
})
export class SliderPage implements OnInit {
  activeIndex = 0 ;
  constructor(private router : Router,
              private appStates : AppStates,
              private commonUseService:CommonUseService,
              private loadingController:LoadingController,
              private commonUseUtil:CommonUseUtil,
              private modalController:ModalController) { }

  ngOnInit() {
    const swiperEl = document.querySelector('swiper-container') as any;

    const swiperParams : SwiperOptions = {
      slidesPerView: 1,
    };

    Object.assign(swiperEl, swiperParams);
    swiperEl.initialize();
    swiperEl.addEventListener('progress', (event:any) => {
      const [swiper, progress] = event.detail;
      console.log(event.detail);
      this.activeIndex = swiper.activeIndex;
    });
  }

  async onNext(){
    const swiperEl = document.querySelector('swiper-container') as any;
    swiperEl.swiper.slideNext();

    if(this.activeIndex >= 2){
      await this.initApp();
      this.router.navigate(['dashboard','main-camera-dashboard']);
      // const modal = await this.modalController.create(
      //   {
      //     component:UnlockFeaturesComponent,
      //     backdropDismiss:false
      //   }
      // )
      // await modal.present();
    }
  }

  async initApp() {
    console.log("init app");
    const load = await this.loadingController.create({message: 'Please wait...' })
    await load.present();
    console.log("init load");
    this.appStates.setLoading(true);
    this.appStates.setHistories(await this.commonUseService.getHistoryList());
    await this.commonUseService.checkFreePremium();
    await load.dismiss();
    this.appStates.setLoading(false);
    console.log("init done");
  }
}
