import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { SharedProvider } from 'src/shared/shared.modules';

@Module({
  controllers: [AdminController],
  providers: [AdminService,...SharedProvider]
})
export class AdminModule {}
