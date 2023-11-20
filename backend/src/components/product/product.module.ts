import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { SharedProvider } from 'src/shared/shared.modules';
import { AdminMiddlware } from 'src/middlewares/admin.middleware';
import { AdminController } from '../admin/admin.controller';
import { ApiRequestMiddleware } from 'src/middlewares/api-request.middleware';

@Module({
  controllers: [ProductController],
  providers: [ProductService,...SharedProvider]
})
export class ProductModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ApiRequestMiddleware)
      .forRoutes(ProductController);
  }
}
