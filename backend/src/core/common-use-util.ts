import {  Injectable } from "@nestjs/common";
// import * as fs from 'fs-extra';
import { CHAT_PREMIUM_COST, CHAT_VISION_PREMIUM_COST, TABLE_CHAT_AI, TABLE_SUBSCRIBERS } from 'src/core/global-constant';
import { AccountSubscribe } from "src/intefaces/account-subscribe";
import * as admin from 'firebase-admin';

@Injectable()
export class CommonUseUtil{
    
    subscriberList():Promise<any>{
        return new Promise(async (resolve)=>{ 
            const db = admin.firestore();
            
            const querySnapshot = await db.collection(TABLE_SUBSCRIBERS).doc(TABLE_SUBSCRIBERS).get(); 
            const data =querySnapshot.data() || {}; 
            // const exists = await fs.pathExists(TABLE_SUBSCRIBERS);
            // let data = {};
            // if(exists){
            //     data = await fs.readJson(TABLE_SUBSCRIBERS);
            // } 
            // console.log('exists',exists);
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
            // await fs.writeJson(TABLE_SUBSCRIBERS, premiumList, { spaces: 2 });
            await this.insertUpdateSubscriber(premiumList);
            return resolve(premiumList);
        })
    }

    updateAccountSubscriber(deviceId:string,freeChatCount:number,premiumCount:number){
        return new Promise<any>(async (resolve)=>{
            const account = await this.findAccountSubscribeDevice(deviceId);
            
            account.freeChatCount = freeChatCount;
            account.premiumCount = premiumCount;
            
            const premiumList = await this.subscriberList();
            premiumList[deviceId] = account;

            // await fs.writeJson(TABLE_SUBSCRIBERS, premiumList, { spaces: 2 });
            await this.insertUpdateSubscriber(premiumList);
            return resolve(premiumList);
        })
    } 
    
    deleteAccountSubscriber(deviceId){
        return new Promise<any>(async (resolve)=>{ 
            const premiumList = await this.subscriberList();
            delete premiumList[deviceId]; 
            // await fs.writeJson(TABLE_SUBSCRIBERS, premiumList, { spaces: 2 });
            await this.insertUpdateSubscriber(premiumList);
            return resolve(premiumList);
        })
    } 

    insertUpdateSubscriber(premiumList:any){
        return new Promise(async (resolve)=>{ 
            const db = admin.firestore();
            const save = await db.collection(TABLE_SUBSCRIBERS).doc(TABLE_SUBSCRIBERS).set(premiumList); 
            return resolve(save);
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