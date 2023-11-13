import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ModalController } from '@ionic/angular';
import { COMMON_QUESTIONS } from 'src/app/core/global-variable';
import { CommonUseUtil } from 'src/app/core/utils/common-use.util';
import { UserAccount } from 'src/app/models/user-account.model';
import { ChatService } from 'src/app/services/chat.service';
import { ChatSuggestionComponent } from '../chat-suggestion/chat-suggestion.component';

@Component({
  selector: 'chat-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent  implements OnInit {
  @Output() onSendMessage: EventEmitter<any> = new EventEmitter<any>();

  messageForm: FormGroup;
  user: UserAccount = {} as UserAccount;
  commonQuestions = COMMON_QUESTIONS;
  constructor(private fb: FormBuilder,
    private modalController:ModalController,
    private loading : LoadingController,
    private chatService : ChatService) {
    this.messageForm = this.fb.group({
      message: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.initUser();
    this.commonQuestions = this.commonQuestions.slice(0, 10);
  }

  async initUser() {
    this.user = await CommonUseUtil.getUser()
  }

  async onSubmit() {
    console.log("onSubmit",this.messageForm.valid);
    if (this.messageForm.valid) {
      console.log("onSubmit",this.messageForm.value);
      const { message } = this.messageForm.value;
      this.messageForm.reset();
      console.log("onSubmit",{message:message,userId:this.user.id});
      this.onSendMessage.emit({message:message,userId:this.user.id});
    }
  }

  onTranscripListener(transcript : string){
    console.log("onTranscripListener",transcript);
    this.messageForm.patchValue({message : transcript});
  }

  addToMessage(commonQuestion:string){
    let { message } = this.messageForm.value;
    message = message ? message+"\n"+commonQuestion : commonQuestion;
    this.messageForm.patchValue(
      {
        message: message
      }
    )
  }

  async onSuggestionMore(){
    const modal = await this.modalController.create({
      component:ChatSuggestionComponent
    })
    await modal.present();
    modal.onDidDismiss().then((el)=>{
      console.log("onSuggestionMore dismiss",el,el.data);
      if(el.data){
        this.addToMessage(el.data);
      }
    })
  }
}
