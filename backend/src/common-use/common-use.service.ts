import { Injectable } from '@nestjs/common';
import { CommonUseUtil } from 'src/core/common-use-util';
import { FREE_PREMIUM_COUNT } from 'src/core/global-constant';
import { FreePremium } from 'src/intefaces/free-premium';

@Injectable()
export class CommonUseService {
    constructor (private commonUseUtil:CommonUseUtil){}

    public getFreePremium(deviceId:string){
        return new Promise(async (resolve)=>{
            const freePremiumDevice = await this.commonUseUtil.findFreePremiumDevice(deviceId);
            let ret : FreePremium= {deviceId:'',premiumCount:0};

            if(!freePremiumDevice){ 
                const premiumCount = FREE_PREMIUM_COUNT;
                await this.commonUseUtil.addFreePremiumDeviceId({deviceId,premiumCount});
                ret = {premiumCount:premiumCount,deviceId:deviceId};
            }else{
                ret = freePremiumDevice;
            }

            return resolve(ret);
        })
    } 
}
