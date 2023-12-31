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
    console.log('onScroll');
    const doc = this.scrollContainer.nativeElement;
    console.log('onScroll',doc,this.scrollContainer);
    console.log('doc.scrollHeight',doc.scrollHeight);
    console.log('doc.offsetHeight',doc.offsetHeight);
    console.log('doc.scrollTop',doc.scrollTop);

    let scrollHeight = doc.scrollHeight;
    let offsetHeight = doc.offsetHeight;
    let scrollTop = doc.scrollTop;
    let checker = 10;

    console.log(scrollHeight-offsetHeight)
    console.log(scrollTop * -1)
    console.log(parseInt(((scrollHeight-offsetHeight) - (scrollTop * -1)).toString()));
    console.log(parseInt(((scrollHeight-offsetHeight) - (scrollTop * -1)).toString()) <= checker);

    if(parseInt(((scrollHeight-offsetHeight) - (scrollTop * -1)).toString()) <= checker){
      console.log('Scroll is at the top');
      this.loadMore.emit(true);
    }
  }
}
