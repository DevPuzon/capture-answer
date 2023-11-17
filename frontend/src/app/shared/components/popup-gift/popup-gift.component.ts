import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoadingController, ModalController } from '@ionic/angular';
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
              private modalController:ModalController,
              private loadingController:LoadingController,
              private toastService:ToastService, ) { }

  ngOnInit() {}

  async onClaim(){
    const load = await this.loadingController.create({message: 'Please wait...' });
    await load.present();
    await new Promise(async (resolve)=>{

      try{
        await this.commonUseService.claimFreePremium();
        (await this.toastService.presentToast("Claimed successfully!",3000));
        resolve({});
      }catch(ex:any){
        (await this.toastService.presentToast(ex,3000));
        resolve({});
      }
    })

    await load.dismiss();
    this.modalController.dismiss();
  }

  onClose() {
    this.modalController.dismiss();
  }

}
