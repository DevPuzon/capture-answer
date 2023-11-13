import { Injectable } from '@angular/core';
import { AppRate, AppRateReviewTypeAndroid, AppRateReviewTypeIos } from '@awesome-cordova-plugins/app-rate/ngx';
import { Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { APPLICATION_ID, APPLICATION_IOS_ID } from '../core/global-variable';

@Injectable({
  providedIn: 'root'
})
export class RateAppService {

  private readonly STORAGE_KEY = 'appUsageCount';
  private readonly THRESHOLD = 6;

  constructor(
    private appRate: AppRate,
    private platform : Platform,
    private translateService: TranslateService
  ) { }

  // async init(): Promise<void> {

  //   await this.platform.ready();
  //   await this.incrementAppUsage();

  //   if (await this.shouldPromptForRating()) {
  //     // Display the rate prompt here using your plugin or custom UI
  //     // After displaying, reset the counter:
  //     this.checkPrompRating();
  //     await this.resetAppUsageCounter();
  //   }
  // }

  // private async incrementAppUsage(): Promise<void> {
  //   let count = +(await localStorage.getItem(this.STORAGE_KEY) || 0);
  //   console.log('RateAppService.count:'+count)

  //   count++;
  //   await localStorage.setItem(this.STORAGE_KEY, count+'');
  // }

  // private async shouldPromptForRating(): Promise<boolean> {
  //   const count = +(await localStorage.getItem(this.STORAGE_KEY) || 0);
  //   return count >= this.THRESHOLD;
  // }

  // private async resetAppUsageCounter(): Promise<void> {
  //   await localStorage.setItem(this.STORAGE_KEY, '0');
  // }

  // private checkPrompRating(){
  //   console.log('checkPrompRating');
  //   let dontShow = localStorage.getItem('APP_RATE_NEGATIVE');
  //   if(dontShow) return;

  //   setTimeout(() => {
  //     this.promptForRating();
  //   }, 3000);

  // }

  promptForRating() {
    console.log('promptForRating');
    this.appRate.setPreferences({
      usesUntilPrompt: 2, //Do not work
      promptAgainForEachNewVersion: false,
      simpleMode: true,
      storeAppURL: {
        ios: APPLICATION_IOS_ID,
        android: 'market://details?id'+APPLICATION_ID,
      },
      reviewType: {
        ios: AppRateReviewTypeIos.InAppBrowser,
        android: AppRateReviewTypeAndroid.InAppBrowser
      },
      customLocale: {
        title:  this.translateService.instant('APP_RATE_TITLE'),
        message: this.translateService.instant('APP_RATE_MSG'),
        cancelButtonLabel: this.translateService.instant('APP_RATE_NO'),
        laterButtonLabel: this.translateService.instant('APP_RATE_LATER'),
        rateButtonLabel: this.translateService.instant('APP_RATE_NOW')
      },
      callbacks: {
        onButtonClicked: (buttonIndex)=> {
          //buttonIndex 1 is not show again
          if(buttonIndex == 1){
            localStorage.setItem('APP_RATE_NEGATIVE', '1');
          }
        }
      }
    });

    this.appRate.promptForRating(true);
  }

}
