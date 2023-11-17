import { Injectable } from '@angular/core';
import { AppRate, AppRateReviewTypeAndroid, AppRateReviewTypeIos } from '@awesome-cordova-plugins/app-rate/ngx';
import { Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage-angular';
import { STORAGE_APP_URL_ANDROID, STORAGE_APP_URL_IOS } from '../core/global-variable';
// import { AnalyticsService } from './analytics.service';

@Injectable({
  providedIn: 'root'
})
export class RateAppService {

  private readonly STORAGE_KEY = 'appUsageCount';
  private readonly THRESHOLD = 5;

  constructor(
    private appRate: AppRate,
    // private storage: Storage,
    private platform : Platform,
    // private analyticsService: AnalyticsService,
    private translateService: TranslateService
  ) { }

  // async init(): Promise<void> {

  //   await this.platform.ready();
  //   await this.incrementAppUsage();

  //   if (await this.shouldPromptForRating()) {
  //     // Display the rate prompt here using your plugin or custom UI
  //     // After displaying, reset the counter:
  //     await this.checkPrompRating();
  //     await this.resetAppUsageCounter();
  //   }
  // }

  // private async incrementAppUsage(): Promise<void> {
  //   let count = +(await this.storage.get(this.STORAGE_KEY) || 0);
  //   count++;
  //   await this.storage.set(this.STORAGE_KEY, count+'');
  // }

  // private async shouldPromptForRating(): Promise<boolean> {
  //   const count = +(await this.storage.get(this.STORAGE_KEY) || 0);
  //   return count >= this.THRESHOLD;
  // }

  // private async resetAppUsageCounter(): Promise<void> {
  //   await this.storage.set(this.STORAGE_KEY, '0');
  // }

  // private async checkPrompRating(){

  //   let dontShow = await this.storage.get('APP_RATE_NEGATIVE');
  //   if(dontShow) return;

  //   setTimeout(() => {
  //     this.promptForRating();
  //   }, 3000);

  // }

  promptForRating() {
    // this.analyticsService.setScreenName('Popup Rate', 'rate-app.service')
    this.appRate.setPreferences({
      promptAgainForEachNewVersion: false,
      simpleMode: true,
      storeAppURL: {
        ios: STORAGE_APP_URL_IOS,
        android: STORAGE_APP_URL_ANDROID
      },
      reviewType: {
        ios: AppRateReviewTypeIos.InAppReview,
        android: AppRateReviewTypeAndroid.InAppReview
      },
      customLocale: {
        title:  this.translateService.instant('APP_RATE_TITLE'),
        message: this.translateService.instant('APP_RATE_MSG'),
        cancelButtonLabel: this.translateService.instant('APP_RATE_NO'),
        laterButtonLabel: this.translateService.instant('APP_RATE_LATER'),
        rateButtonLabel: this.translateService.instant('APP_RATE_NOW')
      },
      callbacks: {
        onButtonClicked: async (buttonIndex)=> {
          /*
            1=NEGATIVE  | 2=LATER | 3=RATENOW
          **/
          let label = "negative";
          if(buttonIndex == 2) label = 'later';
          else if(buttonIndex == 3) label = 'now';

          // this.analyticsService.logEvent('click_rate_answer-'+label, {})
          //buttonIndex 1 is not show again
          // if(buttonIndex == 1){
          //   await this.storage.set('APP_RATE_NEGATIVE', '1');
          // }
        }
      }
    });

    this.appRate.promptForRating(true);
  }

}
