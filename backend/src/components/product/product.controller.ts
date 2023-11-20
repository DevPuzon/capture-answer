import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { ProductService } from './product.service';
import { ENVIRONMENT } from 'src/environments/environment';

@Controller(ENVIRONMENT + '/product') 
export class ProductController {

    constructor(private productService: ProductService){}

    @Post('purchase') 
    async convoVision(@Body() data : any) {   
        try{ 
            const { deviceId,purchaseId,productId,tokens,payload } = data; 
            const response = await this.productService.onPurchaseProduct(deviceId,purchaseId,productId,tokens,payload)
            return { ...{ success:true, data:response}, statusCode: 200 };
        }catch(ex){  
            throw new HttpException({success:false,...ex}, HttpStatus.FORBIDDEN);
        }
    }
}
