
import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toastController: ToastController) { }

  async presentToast(message: string, duration: number = 2000) {
    const toast = await this.toastController.create({
      message: message,
      color:"light",
      position:"top",
      cssClass:"toast-c",
      icon:"notifications",
      keyboardClose:true,
      duration: duration,
      // any other default properties you want
    });
    toast.present();
  }

  async rewardToast(message: string, duration: number = 2000) {
    const toast = await this.toastController.create({
      message: message,
      color:"success",
      position:"top",
      cssClass:"toast-c",
      icon:"star",
      keyboardClose:true,
      duration: duration,
      // any other default properties you want
    });
    toast.present();
  }
}
