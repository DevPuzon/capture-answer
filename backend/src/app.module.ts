import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfig } from './core/app-config';
import { ChatAiModule } from './components/chat-ai/chat-ai.module';
import { CommonUseModule } from './components/common-use/common-use.module';
import { MulterModule } from '@nestjs/platform-express';
import { SharedProvider } from './shared/shared.modules';
import { AdminModule } from './components/admin/admin.module';
import { ProductModule } from './components/product/product.module';
import { HistoryModule } from './components/history/history.module';

@Module({
  imports: [  
    ChatAiModule, 
    CommonUseModule, 
    AdminModule, ProductModule, HistoryModule
  ],
  controllers: [AppController],
  providers: [AppService,...SharedProvider ], 
})
export class AppModule {}
