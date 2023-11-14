import { Injectable } from '@nestjs/common';
import { CommonUseUtil } from 'src/core/common-use-util';

@Injectable()
export class AdminService {

    constructor(private commonUseUtil:CommonUseUtil){}

    public subscribers(){
        return new Promise<any>(async (resolve)=>{
            const list = await this.commonUseUtil.subscriberList();
            return resolve(list)
        })
    }

    
    public updateSubscribers(deviceId:string,freeChatCount:number,premiumCount:number){
        return new Promise<any>(async (resolve)=>{
            const list = await this.commonUseUtil.updateAccountSubscriber(deviceId,freeChatCount,premiumCount);
            return resolve(list)
        })
    }

    
    public deleteSubscribers(deviceId:string){
        return new Promise<any>(async (resolve)=>{
            const list = await this.commonUseUtil.deleteAccountSubscriber(deviceId);
            return resolve(list)
        })
    }
}
