import { Body, Controller, HttpException, HttpStatus, Param, Post, Req } from '@nestjs/common'; 
import { ChatAiService } from './chat-ai.service';

@Controller('chat-ai')
export class ChatAiController {

    constructor(private chatAiService:ChatAiService){}
 
    @Post('convo/:deviceId') 
    async convo(@Param('deviceId') deviceId : string,@Body() data : any) {  
        try{
            const { message } = data; 

            const response = await this.chatAiService.chatAi(deviceId,message)
            return { ...{ success:true, data:response}, statusCode: 200 };
        }catch(ex){  
            throw new HttpException({success:false,...ex}, HttpStatus.FORBIDDEN);
        }
    }
}