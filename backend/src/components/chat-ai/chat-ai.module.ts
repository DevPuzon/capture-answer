import { Module } from '@nestjs/common';
import { ChatAiService } from './chat-ai.service';
import { ChatAiController } from './chat-ai.controller'; 
import { SharedProvider } from 'src/shared/shared.modules';

@Module({
  imports:[],
  providers: [ChatAiService,...SharedProvider],
  controllers: [ChatAiController]
})
export class ChatAiModule {}
