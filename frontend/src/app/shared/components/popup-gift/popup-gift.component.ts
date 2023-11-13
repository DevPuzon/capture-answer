import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { FREE_SCANS } from 'src/app/core/global-variable';
import { CommonUseUtil } from 'src/app/core/utils/common-use.util';
import { CommonUseService } from 'src/app/services/common-use.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-popup-gift',
  templateUrl: './popup-gift.component.html',
  styleUrls: ['./popup-gift.component.scss'],
})
export class PopupGiftComponent  implements OnInit {
  freeScans = FREE_SCANS;

  constructor(private commonUseService:CommonUseService,
              private commonUseUtil:CommonUseUtil,
              private loadingController:LoadingController,
              private toastService:ToastService,
              private translateService: TranslateService,
              public dialogRef: MatDialogRef<PopupGiftComponent> ) { }

  ngOnInit() {}

  async onClaim(){
    // const load = await this.loadingController.create({message: 'Please wait...' });
    // this.dialogRef.close();
    // await load.present();
    // try{
    //   await this.commonUseService.claimGift();
    //   load.dismiss();
    //   localStorage.setItem('giftAlreadyClaimed', '1');
    //   (await this.toastService.presentToast(this.translateService.instant("CLAIMED_OK"),3000));
    // }catch(ex:any){
    //   load.dismiss();
    //   (await this.toastService.presentToast(ex,3000));
    // }
  }

  onClose() {
    this.dialogRef.close();
  }

}
