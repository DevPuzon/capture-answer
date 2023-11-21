import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { ChatAbstract } from 'src/app/core/abstract/chat.abstract';
import { UserAccount } from 'src/app/models/user-account.model';
import { OCR_CHAT_AI_USER_ID, TABLE_CHAT_AI } from 'src/app/core/global-variable';
import { CommonUseUtil } from "src/app/core/utils/common-use.util";
import { AppStates } from 'src/app/core/app-states';
import { LoadingController } from '@ionic/angular';
import { Subject, takeUntil } from 'rxjs';
import { ToastService } from 'src/app/services/toast.service';
@Component({
  selector: 'app-chat-bot',
  templateUrl: './chat-bot.page.html',
  styleUrls: ['./chat-bot.page.scss'],
})
export class ChatBotPage extends ChatAbstract implements OnInit, OnDestroy{

  private user : UserAccount = {} as UserAccount;
  private destroy$: Subject<void> = new Subject<void>();
  remainingFreeAiChat:number = 0;
  isPremium:boolean = false;

  constructor(chatService : ChatService,
              private loading : LoadingController,
              private toastService:ToastService,
              private appStates:AppStates){
    super(chatService);
    this.tableName = TABLE_CHAT_AI;

    this.appStates.listenIsUserPremium()
    .pipe(takeUntil(this.destroy$))
    .subscribe((value)=>{
      this.isPremium = this.appStates.getIsUserPremium();
    });

    this.appStates.listenFreeUserChat()
    .pipe(takeUntil(this.destroy$))
    .subscribe((remainingFreeAiChat)=>{
      this.remainingFreeAiChat = remainingFreeAiChat;
    });
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

    if(this.chats.length == 0){
      const botUser =  {
        id : OCR_CHAT_AI_USER_ID,
        name : "AiDep",
        profile_pic : "https://bootdey.com/img/Content/avatar/avatar3.png"
      }as UserAccount;

      this.chats.push(
        {
          id: '123123',
          user_id: OCR_CHAT_AI_USER_ID,
          message: 'Hello 👋, how can I assist you today?',
          user : botUser
        }
      )
      console.log("check chats",this.chats,this.chats.length);
    }
  }

  override changeChats(): void {
    console.log("ChatBotPage Change chats");
    this.checkChat();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  async onSendMessage(event:any){
    console.log("onSendMessage",event);
    const load = this.loading.create({ message : "Please wait ..."});
    (await load).present();

    try{
      await this.chatService.sendMessage(event.message,event.userId);
    }catch(ex:any){
      console.error("onSendMessage er",ex);
    }

    (await load).dismiss();
  }

  // convoRef : CollectionReference<DocumentData> = {} as  CollectionReference<DocumentData>;
  // convoQuery : Query<DocumentData> = {} as  Query<DocumentData>;
  // convoCollectionData : Observable<DocumentData[]>  = {} as  Observable<DocumentData[]>;

  // chats : Chat[] = [];
  // isConvoAllLoaded = false;
  // constructor(private chatService : ChatService,
  //   private userRepo : UserRepository) { }

  // ngOnInit() {
  //   this.initChat();
  // }

  // private async initChat() {
  //   const [ convoRef , convoQuery , convoCollectionData ] = await this.chatService.convoObservable()
  //   this.convoRef = convoRef;
  //   this.convoQuery = convoQuery;
  //   this.convoCollectionData = convoCollectionData;

  //   this.chats = [];
  //   this.convoCollectionData.subscribe((el)=>{
  //     if(this.chats.length <= 0){
  //       this.chats = el as Chat[];
  //     }else{
  //       el.forEach((er : DocumentData)=>{
  //         const chatEr = er as Chat
  //         if(!this.chats.find((ch_el)=>{return ch_el.id == chatEr.id})){
  //           this.chats.unshift(chatEr);
  //         }
  //       });
  //     }
  //     console.log(JSON.stringify(this.chats));
  //     this.processUserChat(this.chats);
  //   })
  // }

  // public async loadChatMore(){
  //   if(this.isConvoAllLoaded){
  //     return;
  //   }
  //   const [ convoQuery , convoCollectionData ] = await this.chatService.loadMoreConvo(this.convoQuery,this.convoRef);
  //   this.convoQuery = convoQuery;
  //   this.convoCollectionData = convoCollectionData;

  //   this.convoCollectionData.subscribe((el)=>{
  //     if(el.length == 0){
  //       this.isConvoAllLoaded = true;
  //       return;
  //     }
  //     this.chats = this.chats.concat(el as Chat[]);
  //     this.processUserChat(this.chats);
  //     console.log('loadChatMore',this.chats);
  //   })
  // }

  // private async processUserChat(chats : Chat[]) : Promise<Chat[]>{
  //   for(let chat of chats){
  //     chat.user = await this.userRepo.getUser(chat.user_id);
  //   }
  //   return chats;
  // }

}
