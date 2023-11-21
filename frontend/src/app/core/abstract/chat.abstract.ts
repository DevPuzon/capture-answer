
import { ChatService } from 'src/app/services/chat.service';
import { CollectionReference, DocumentData, Query, } from '@angular/fire/firestore';
import { Observable } from 'rxjs/internal/Observable';
import { Chat } from 'src/app/models/chat.model';
import { Injectable, OnInit } from '@angular/core';
@Injectable()
export abstract class ChatAbstract{
  convoRef : CollectionReference<DocumentData> = {} as  CollectionReference<DocumentData>;
  convoQuery : Query<DocumentData> = {} as  Query<DocumentData>;
  convoCollectionData : Observable<DocumentData[]>  = {} as  Observable<DocumentData[]>;

  chats : Chat[] = [];
  isConvoAllLoaded = false;
  tableName = "";
  roomId = "";
  constructor(
    public chatService : ChatService) { }



  public async initChat() {
    console.log(`initChat`,this.tableName,this.roomId);
    const [ convoRef , convoQuery , convoCollectionData ] =
    await this.chatService.convoObservable(this.tableName,this.roomId)

    this.convoRef = convoRef;
    this.convoQuery = convoQuery;
    this.convoCollectionData = convoCollectionData;


    this.chats = [];
    this.convoCollectionData.subscribe((el)=>{
      if(this.chats.length <= 0){
        this.chats = el as Chat[];
      }else{
        el.forEach((er : DocumentData)=>{
          const chatEr = er as Chat
          if(!this.chats.find((ch_el)=>{return ch_el.id == chatEr.id})){
            this.chats.unshift(chatEr);
          }
        });
      }
      console.log(JSON.stringify(this.chats));
      // this.processUserChat(this.chats);
      this.changeChats();
    })
  }

  public async loadChatMore(){
    if(this.isConvoAllLoaded){
      return;
    }
    const [ convoQuery , convoCollectionData ] = await this.chatService.loadMoreConvo(this.convoQuery,this.convoRef);
    this.convoQuery = convoQuery;
    this.convoCollectionData = convoCollectionData;

    this.convoCollectionData.subscribe((el)=>{
      if(el.length == 0){
        this.isConvoAllLoaded = true;
        return;
      }
      this.chats = this.chats.concat(el as Chat[]);
      // this.processUserChat(this.chats);
      console.log('loadChatMore',this.chats);
      this.changeChats();
    })
  }

  // private async processUserChat(chats : Chat[]) : Promise<Chat[]>{
  //   for(let chat of chats){
  //     chat.user = await CommonUseUtil.getUser();
  //   }
  //   return chats;
  // }


  abstract changeChats(): void;

}
