import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { COMMON_QUESTIONS } from 'src/app/core/global-variable';

@Component({
  selector: 'app-chat-suggestion',
  templateUrl: './chat-suggestion.component.html',
  styleUrls: ['./chat-suggestion.component.scss'],
})
export class ChatSuggestionComponent  implements OnInit {
  commonQuestions = COMMON_QUESTIONS;
  constructor(
    public modalController : ModalController) { }

  ngOnInit() {}

  onBack(){
    this.modalController.dismiss();
  }

  addToMessage(question:string){
    this.modalController.dismiss(question);
  }
}
