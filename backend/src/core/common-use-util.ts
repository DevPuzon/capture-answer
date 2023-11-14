import {  Injectable } from "@nestjs/common";
import * as fs from 'fs-extra';
import { CHAT_PREMIUM_COST, CHAT_VISION_PREMIUM_COST, LOCAL_SUBSCRIBE } from 'src/core/global-constant';
import { AccountSubscribe } from "src/intefaces/account-subscribe";

@Injectable()
export class CommonUseUtil{
    
    subscriberList():Promise<any>{
        return new Promise(async (resolve)=>{ 
            const exists = await fs.pathExists(LOCAL_SUBSCRIBE);
            let data = {};
            if(exists){
                data = await fs.readJson(LOCAL_SUBSCRIBE);
            } 
            console.log('exists',exists);
            return resolve(data);
        })
    }

    findAccountSubscribeDevice(deviceId:string):Promise<AccountSubscribe>{
        return new Promise<AccountSubscribe>(async (resolve)=>{
            let account = (await this.subscriberList())[deviceId]; 
            return resolve(account);
        })
    }

    addAccountSubscribeDeviceId(accountSubscribe:AccountSubscribe):Promise<any>{
        return new Promise<any>(async (resolve)=>{
            const premiumList = await this.subscriberList();
            premiumList[accountSubscribe.deviceId] = accountSubscribe;
            console.log(premiumList);
            await fs.writeJson(LOCAL_SUBSCRIBE, premiumList, { spaces: 2 });
            return resolve({});
        })
    }

    updateAccountSubscriber(deviceId:string,freeChatCount:number,premiumCount:number){
        return new Promise<any>(async (resolve)=>{
            const account = await this.findAccountSubscribeDevice(deviceId);
            account.freeChatCount = freeChatCount;
            account.premiumCount = premiumCount;
            const premiumList = await this.subscriberList();
            premiumList[deviceId] = account;

            await fs.writeJson(LOCAL_SUBSCRIBE, premiumList, { spaces: 2 });
            return resolve(premiumList);
        })
    } 
    
    deleteAccountSubscriber(deviceId){
        return new Promise<any>(async (resolve)=>{ 
            const premiumList = await this.subscriberList();
            delete premiumList[deviceId]; 
            await fs.writeJson(LOCAL_SUBSCRIBE, premiumList, { spaces: 2 });
            return resolve(premiumList);
        })
    } 

    isPremiumUser(deviceId:string):Promise<boolean>{
        return new Promise<boolean>(async (resolve)=>{
            const account = await this.findAccountSubscribeDevice(deviceId);
            if(!account){return resolve(false);}

            resolve(account.premiumCount > 0);
        });
    }
 
    minusFreeChatAccountSubscribe(deviceId:string){
        return new Promise(async (resolve)=>{
            const accountSubscribeDevice = await this.findAccountSubscribeDevice(deviceId);
            accountSubscribeDevice.freeChatCount--;
            await this.addAccountSubscribeDeviceId(accountSubscribeDevice);
            resolve({});
        })
    }
 
    minusChatAccountSubscribe(deviceId:string){
        return new Promise(async (resolve)=>{
            let accountSubscribeDevice = await this.findAccountSubscribeDevice(deviceId);
            accountSubscribeDevice.premiumCount = accountSubscribeDevice.premiumCount - CHAT_PREMIUM_COST;
            await this.addAccountSubscribeDeviceId(accountSubscribeDevice);
            resolve({});
        })
    }

    minusChatWithVisonAccountSubscribe(deviceId:string){
        return new Promise(async (resolve)=>{
            let accountSubscribeDevice = await this.findAccountSubscribeDevice(deviceId);
            accountSubscribeDevice.premiumCount = accountSubscribeDevice.premiumCount - CHAT_VISION_PREMIUM_COST;
            await this.addAccountSubscribeDeviceId(accountSubscribeDevice);
            resolve({});
        })
    }
}