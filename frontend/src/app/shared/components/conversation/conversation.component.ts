import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { OCR_CHAT_AI_USER_ID } from 'src/app/core/global-variable';
import { CommonUseUtil } from "src/app/core/utils/common-use.util";
import { Chat } from 'src/app/models/chat.model';
import { UserAccount } from 'src/app/models/user-account.model';

@Component({
  selector: 'chat-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss'],
})
export class ConversationComponent  implements OnInit {
  @Input() chats : Chat[] = [];
  @Output("loadMore") loadMore = new EventEmitter<boolean>();
  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;


  convoUsers : UserAccount[] = [];
  chatAiUserId = OCR_CHAT_AI_USER_ID;
  user : UserAccount = {} as UserAccount;

  constructor() { }

  ngOnInit() {
    this.initUser();
  }

  async initUser() {
    this.user = await CommonUseUtil.getUser()
  }

  onScroll() {
    const doc = this.scrollContainer.nativeElement;
    if((doc.scrollHeight-doc.offsetHeight) - (doc.scrollTop * -1) <= 0){
      console.log('Scroll is at the top');
      this.loadMore.emit(true);
    }
  }
}
