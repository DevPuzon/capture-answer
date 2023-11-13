import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-capture-result',
  templateUrl: './capture-result.component.html',
  styleUrls: ['./capture-result.component.scss'],
})
export class CaptureResultComponent  implements OnInit {
  @Input('capturedImage') capturedImage : string = '';
  @Input('captureId') captureId : string = '';

  constructor(
    private modalController:ModalController) { }

  ngOnInit() {}

  onBack(){
    this.modalController.dismiss();
  }

  async onSendMessage(event:any){
    console.log("onSendMessage",event);
  }
}
