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

@Module({
  imports: [ 
    MulterModule.register({
      dest: './uploads',
    }),
    ChatAiModule, 
    CommonUseModule, 
    AdminModule, ProductModule
  ],
  controllers: [AppController],
  providers: [AppService,...SharedProvider ], 
})
export class AppModule {}
