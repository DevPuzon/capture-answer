import { Module } from '@nestjs/common';
import { HistoryController } from './history.controller';
import { HistoryService } from './history.service';
import { SharedProvider } from 'src/shared/shared.modules';

@Module({
  controllers: [HistoryController],
  providers: [HistoryService,...SharedProvider]
})
export class HistoryModule {}
