import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { ChatAbstract } from 'src/app/core/abstract/chat.abstract';
import { AppStates } from 'src/app/core/app-states';
import { OCR_CHAT_AI_USER_ID, TABLE_CHAT_AI } from 'src/app/core/global-variable';
import { CommonUseUtil } from 'src/app/core/utils/common-use.util';
import { UserAccount } from 'src/app/models/user-account.model';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-capture-chat',
  templateUrl: './capture-chat.component.html',
  styleUrls: ['./capture-chat.component.scss'],
})
export class CaptureChatComponent extends ChatAbstract implements OnInit {

  private user : UserAccount = {} as UserAccount;

  constructor(chatService : ChatService,
              private modalController:ModalController,
              private loading : LoadingController,
              private appStates:AppStates){
    super(chatService);
    this.tableName = TABLE_CHAT_AI;
  }

  async ngOnInit() {
    this.user = await CommonUseUtil.getUser();
    this.roomId = this.user.id;

    this.initChat();
    this.appStates.listenFreeUserChat().subscribe((el)=>{
      console.log('ChatBotPage listenFreeUserChat',el);
    })
  }

  checkChat() {
    console.log("check chats",this.chats,this.chats.length);

    // if(this.chats.length == 0){
    //   const botUser =  {
    //     id : OCR_CHAT_AI_USER_ID,
    //     name : "AiDep",
    //     profile_pic : "https://bootdey.com/img/Content/avatar/avatar3.png"
    //   }as UserAccount;

    //   this.chats.push(
    //     {
    //       id: '123123',
    //       user_id: OCR_CHAT_AI_USER_ID,
    //       message: 'Hello 👋, how can I assist you today?',
    //       user : botUser
    //     }
    //   )
    //   console.log("check chats",this.chats,this.chats.length);
    // }
  }

  override changeChats(): void {
    console.log("ChatBotPage Change chats");
    this.checkChat();
  }

  ngOnDestroy(): void {
  }

  onBack(){
    this.modalController.dismiss();
  }

  async onSendMessage(event:any){
    const load = this.loading.create({ message : "Please wait ..."});
    (await load).present();

    await this.chatService.sendMessage(event.message,event.userId);

    (await load).dismiss();
  }
}