import { Module } from '@nestjs/common';
import { CommonUseService } from './common-use.service';
import { CommonUseController } from './common-use.controller';  
import { SharedProvider } from 'src/shared/shared.modules';

@Module({ 
  providers: [CommonUseService,...SharedProvider],
  controllers: [CommonUseController]
})
export class CommonUseModule {}
