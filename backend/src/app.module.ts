import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfig } from './core/app-config';
import { ChatAiModule } from './chat-ai/chat-ai.module';
import { CommonUseModule } from './common-use/common-use.module';
import { CommonUseUtil } from './core/common-use-util'; 
import { SharedProvider } from './shared/shared.modules';

@Module({
  imports: [ChatAiModule, CommonUseModule],
  controllers: [AppController],
  providers: [AppService,...SharedProvider ], 
})
export class AppModule {}
