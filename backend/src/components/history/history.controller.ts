import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { HistoryService } from './history.service';
import { HistoryData } from 'src/intefaces/history.model';
import { response } from 'express';

@Controller('history')
export class HistoryController {

    constructor(private historyService: HistoryService){}

    @Post('histories-per-account')
    async getHistoryListPerAccount(@Body() data : any){ 
        try{
            const { deviceId } = data;
            const response = await this.historyService.getHistoryListPerAccount(deviceId);
            return { ...{ success:true, data:response}, statusCode: 200 };
        }catch(ex){  
            throw new HttpException({success:false,...ex}, HttpStatus.FORBIDDEN);
        }
    }
 
    @Post('save-history')
    async saveHistoryItem(@Body() data : any){ 
        try{
            const { deviceId,history } = data;
            const response = await this.historyService.saveHistoryItem(deviceId,history);
            return { ...{ success:true, data:response}, statusCode: 200 };
        }catch(ex){  
            throw new HttpException({success:false,...ex}, HttpStatus.FORBIDDEN);
        }
    }
 
    @Post('delete-history')
    async deleteHistoryItem(@Body() data : any){
        try{
            const { deviceId,captureId } = data;
            const response = await this.historyService.deleteHistoryItem(deviceId,captureId);
            return { ...{ success:true, data:response}, statusCode: 200 };
        }catch(ex){  
            throw new HttpException({success:false,...ex}, HttpStatus.FORBIDDEN);
        } 
    }
}
