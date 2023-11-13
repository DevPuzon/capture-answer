import { Body, Controller, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { CommonUseService } from './common-use.service';

@Controller('common-use')
export class CommonUseController {
    
    constructor(private commonUseService:CommonUseService){}
 
    @Post('free-premium/:deviceId') 
    async getFreePremium(@Param('deviceId') deviceId : string) {  
        try{  
            const response = await this.commonUseService.getFreePremium(deviceId)
            return { ...{ success:true, data:response}, statusCode: 200 };
        }catch(ex){  
            throw new HttpException(ex, HttpStatus.FORBIDDEN);
        }
    }
}
 
