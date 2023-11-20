import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { SharedProvider } from 'src/shared/shared.modules';
import { ApiRequestMiddleware } from 'src/middlewares/api-request.middleware';
import { AdminMiddlware } from 'src/middlewares/admin.middleware';

@Module({
  controllers: [AdminController],
  providers: [AdminService,...SharedProvider]
})
export class AdminModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AdminMiddlware)
      .forRoutes(AdminController);
  }
}