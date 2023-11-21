import {
    Controller,
    HttpException,
    HttpStatus,
    Headers,
    Post,
    Req,
    Body
} from '@nestjs/common';
import {
    ENVIRONMENT
} from 'src/environments/environment';
import {
    AdminService
} from './admin.service';

@Controller('admin')
export class AdminController {

    constructor(private adminService: AdminService) {}

    @Post('list-subscribers')
    async subscribers(@Headers('authorization') authorization: string) {
        try {
            // this.checkToken(authorization);
            const response = await this.adminService.subscribers();
            return {
                ...{
                    success: true,
                    data: response
                },
                statusCode: 200
            };
        } catch (ex) {
            throw new HttpException(ex, HttpStatus.FORBIDDEN);
        }
    }

    
    @Post('update-subscriber')
    async updateSubscriber(@Headers('authorization') authorization: string,@Body() data:any) {
        try {
            // this.checkToken(authorization);
            
            const { deviceId,freeChatCount,premiumCount } = data;
            const response = await this.adminService.updateSubscriber(deviceId,freeChatCount,premiumCount);
            return {
                ...{
                    success: true,
                    data: response
                },
                statusCode: 200
            };
        } catch (ex) {
            throw new HttpException(ex, HttpStatus.FORBIDDEN);
        }
    }
    
    @Post('add-subscriber')
    async addSubscriber(@Headers('authorization') authorization: string,@Body() data:any) {
        try {
            // this.checkToken(authorization);
            
            const { deviceId,freeChatCount,premiumCount } = data;
            const response = await this.adminService.addSubscriber(deviceId,freeChatCount,premiumCount);
            return {
                ...{
                    success: true,
                    data: response
                },
                statusCode: 200
            };
        } catch (ex) {
            throw new HttpException(ex, HttpStatus.FORBIDDEN);
        }
    }


    @Post('delete-subscriber')
    async deleteSubscriber(@Headers('authorization') authorization: string,@Body() data:any) {
        try {
            // this.checkToken(authorization);

            const { deviceId } = data;

            const response = await this.adminService.deleteSubscriber(deviceId);
            return {
                ...{
                    success: true,
                    data: response
                },
                statusCode: 200
            };
        } catch (ex) {
            throw new HttpException(ex, HttpStatus.FORBIDDEN);
        }
    }

    // private checkToken(authorizationHeader: string) {
    //     // const token = authorizationHeader.substring(7);
    //     // if (token != 'msp') { 
    //     //     throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    //     // }
    // }
}