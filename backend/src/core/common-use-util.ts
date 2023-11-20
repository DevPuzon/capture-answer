import {  HttpException, HttpStatus, Injectable } from "@nestjs/common";
// import * as fs from 'fs-extra';
import { CHAT_PREMIUM_COST, CHAT_VISION_PREMIUM_COST, TABLE_API_REQUEST_VALIDATOR, TABLE_CHAT_AI, TABLE_CLAIM_REWARDS, TABLE_SUBSCRIBERS } from 'src/core/global-constant';
import { AccountSubscribe } from "src/intefaces/account-subscribe";
import * as admin from 'firebase-admin';
import { ClaimRewards } from "src/intefaces/claim-rewards";

@Injectable()
export class CommonUseUtil{
    
    subscriberList():Promise<any>{
        return new Promise(async (resolve)=>{ 
            const db = admin.firestore();
            
            const querySnapshot = await db.collection(TABLE_SUBSCRIBERS)
                                  .get();
            let list = [];
            for(const data of querySnapshot.docs){
                list.push(data.data());
            } 
            return resolve(list);
        })
    }

    findAccountSubscribeDevice(deviceId:string):Promise<AccountSubscribe>{
        return new Promise<AccountSubscribe>(async (resolve)=>{ 
            const db = admin.firestore();

            let account = (await db.collection(TABLE_SUBSCRIBERS).doc(deviceId).get()).data() as AccountSubscribe;
            return resolve(account);
        })
    }

    addAccountSubscribeDeviceId(accountSubscribe:AccountSubscribe):Promise<any>{
        return new Promise<any>(async (resolve)=>{ 
            const db = admin.firestore();
            await db.collection(TABLE_SUBSCRIBERS)
            .doc(accountSubscribe.deviceId).set(accountSubscribe);

            return resolve({});
        })
    }

    updateAccountSubscriber(deviceId:string,freeChatCount:number = -1 ,premiumCount:number = -1 ){
        return new Promise<any>(async (resolve)=>{
            const account = await this.findAccountSubscribeDevice(deviceId);
            
            if(freeChatCount != -1){ 
                account.freeChatCount = freeChatCount;
            } 
            if(premiumCount != -1){ 
                account.premiumCount = premiumCount;
            }
             
            const db = admin.firestore();
            await db.collection(TABLE_SUBSCRIBERS)
            .doc(account.deviceId).set(account);


            return resolve({});
        })
    }

    addPremiumCountToAccount(deviceId:string,premiumCount:number){
        return new Promise<any>(async (resolve,reject)=>{ 
            let account = await this.findAccountSubscribeDevice(deviceId);
            if(!account){
                throw new HttpException({success:false,message:"Device Id doesn't exist"}, HttpStatus.FORBIDDEN);
            }
            account.premiumCount = account.premiumCount + premiumCount;
            await this.updateAccountSubscriber(deviceId,-1,account.premiumCount);
            return resolve({});
        })
    }
    
    deleteAccountSubscriber(deviceId){
        return new Promise<any>(async (resolve)=>{  
            const db = admin.firestore();
            await db.collection(TABLE_SUBSCRIBERS)
            .doc(deviceId).delete();

            return resolve({});
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

    currentClaimedRewards(deviceId:string){
        return new Promise<ClaimRewards|null>(async (resolve,reject)=>{ 
            const db = admin.firestore();
            const querySnapshot = await db.collection(TABLE_CLAIM_REWARDS).doc(deviceId).get(); 
            const data = querySnapshot.data() as ClaimRewards || null; 
            return resolve(data);
        })
    }

    claimRewards(deviceId:string){
        return new Promise(async (resolve,reject)=>{ 
            const db = admin.firestore();
            let currentClaimedRewards = null;
            try{
                currentClaimedRewards = await this.checkRewards(deviceId);
            }catch(ex){
                return reject(ex);
            } 
            currentClaimedRewards.claimRewardsCount+=1;

            console.log("claimRewards currentClaimedRewards",deviceId,currentClaimedRewards);
            await db.collection(TABLE_CLAIM_REWARDS).doc(deviceId).set(currentClaimedRewards);

            return resolve({...currentClaimedRewards,isCanClaim:true});
        })
    }
    
    checkRewards(deviceId:string) {
        return new Promise(async (resolve,reject)=>{ 
            let currentClaimedRewards = await this.currentClaimedRewards(deviceId);
            if(currentClaimedRewards){
                const lastDate = new Date(currentClaimedRewards.lastClaim).getDate();
                const currentDate = new Date().getDate();
                if(currentDate != lastDate){
                    currentClaimedRewards.claimRewardsCount = 0;
                }
            }

            if(!currentClaimedRewards){
                currentClaimedRewards = {
                    deviceId:deviceId,
                    claimRewardsCount:0,
                    lastClaim: new Date().getTime()
                }
            }else{
                if(currentClaimedRewards.claimRewardsCount >= 3){
                    return reject({...currentClaimedRewards,success:false,message:"Exceed the claim rewards per day"});
                }
            }
            currentClaimedRewards.lastClaim = new Date().getTime();

            resolve(currentClaimedRewards);
        })
    }

    isApiRequestIdExist(transactionId:string){
        return new Promise(async (resolve)=>{
            const db = admin.firestore();
            const isExist = (await db.collection(TABLE_API_REQUEST_VALIDATOR).doc(transactionId).get()).exists;
            return resolve(isExist);
        })
    }

    saveApiRequestLogs(transactionId:string,payload:any){ 
        return new Promise(async (resolve)=>{
            const db = admin.firestore();
            await db.collection(TABLE_API_REQUEST_VALIDATOR)
            .doc(transactionId).set(
                {
                    payload:payload,
                    timestamp:new Date().getTime()
                }
            ); 

            return resolve({});
        })
    }
}