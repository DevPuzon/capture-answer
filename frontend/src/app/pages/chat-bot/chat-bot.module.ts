import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatBotPageRoutingModule } from './chat-bot-routing.module';

import { ChatBotPage } from './chat-bot.page';
import { SharedComponentsModule } from 'src/app/shared/modules/shared-components.module';
@NgModule({
    declarations: [ChatBotPage],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ChatBotPageRoutingModule,
        SharedComponentsModule
    ]
})
export class ChatBotPageModule {}
