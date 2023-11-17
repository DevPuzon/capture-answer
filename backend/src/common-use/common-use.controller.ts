import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CommonUseService } from './common-use.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ENVIRONMENT } from 'src/environments/environment';

@Controller(ENVIRONMENT+'/common-use')
export class CommonUseController {
    
    constructor(private commonUseService:CommonUseService){}
 
    @Post('claim-free-premium/:deviceId') 
    async getAccountSubscribe(@Param('deviceId') deviceId : string) {  
        try{  
            const response = await this.commonUseService.getAccountSubscribe(deviceId)
            return { ...{ success:true, data:response}, statusCode: 200 };
        }catch(ex){  
            throw new HttpException(ex, HttpStatus.FORBIDDEN);
        }
    }
 
    @Get('check-free-premium/:deviceId') 
    async checkAccountSubscribe(@Param('deviceId') deviceId : string) {  
        try{  
            console.log("checkAccountSubscribe");
            const response = await this.commonUseService.checkAccountSubscribe(deviceId)
            return { ...{ success:true, data:response}, statusCode: 200 };
        }catch(ex){  
            throw new HttpException(ex, HttpStatus.FORBIDDEN);
        }
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('image'))
    async uploadImage(@UploadedFile() file: any) {
        try{  
            const response = await this.commonUseService.uploadImage(file)
            return { ...{ success:true, data:response}, statusCode: 200 };
        }catch(ex){  
            throw new HttpException(ex, HttpStatus.FORBIDDEN);
        }
    }

    
    @Post('claim-free-ai-chat/:deviceId')  
    async claimFreeAiChat(@Param('deviceId') deviceId : string) {  
        try{  
            const response = await this.commonUseService.claimFreeAiChat(deviceId)
            return { ...{ success:true, data:response}, statusCode: 200 };
        }catch(ex){  
            throw new HttpException(ex, HttpStatus.FORBIDDEN);
        }
    }
}
 
