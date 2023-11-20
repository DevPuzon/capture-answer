import { Injectable } from '@nestjs/common';
import { CommonUseUtil } from 'src/core/common-use-util';
import { AccountSubscribe } from 'src/intefaces/account-subscribe';

@Injectable()
export class AdminService {

    constructor(private commonUseUtil:CommonUseUtil){}

    public subscribers(){
        return new Promise<any>(async (resolve)=>{
            const list = await this.commonUseUtil.subscriberList();
            return resolve(list)
        })
    }

    
    public updateSubscriber(deviceId:string,freeChatCount:number,premiumCount:number){
        return new Promise<any>(async (resolve)=>{
            await this.commonUseUtil.updateAccountSubscriber(deviceId,freeChatCount,premiumCount);
            return resolve({deviceId,freeChatCount})
        })
    }

    public addSubscriber(deviceId:string,freeChatCount:number,premiumCount:number){
        return new Promise<any>(async (resolve)=>{
            const accountSubscribe:AccountSubscribe = {
                deviceId:deviceId,
                freeChatCount:freeChatCount,
                premiumCount:premiumCount
            }
            await this.commonUseUtil.addAccountSubscribeDeviceId(accountSubscribe);
            return resolve({deviceId,freeChatCount})
        })
    }
    
    public deleteSubscriber(deviceId:string){
        return new Promise<any>(async (resolve)=>{
            const list = await this.commonUseUtil.deleteAccountSubscriber(deviceId);
            return resolve(list)
        })
    }
}
