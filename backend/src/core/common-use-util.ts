import {  Injectable } from "@nestjs/common";
import * as fs from 'fs-extra';
import { FREE_PREMIUM_FILE } from 'src/core/global-constant';
import { FreePremium } from "src/intefaces/free-premium";

@Injectable()
export class CommonUseUtil{
    
    readPremiumList():Promise<any>{
        return new Promise(async (resolve)=>{ 
            const exists = await fs.pathExists(FREE_PREMIUM_FILE);
            let data = {};
            if(exists){
                data = await fs.readJson(FREE_PREMIUM_FILE);
            } 
            console.log('exists',exists);
            return resolve(data);
        })
    }

    findFreePremiumDevice(deviceId:string):Promise<FreePremium>{
        return new Promise<FreePremium>(async (resolve)=>{
            const find = (await this.readPremiumList())[deviceId];
            return resolve(find);
        })
    }

    addFreePremiumDeviceId(freePremium:FreePremium):Promise<any>{
        return new Promise<any>(async (resolve)=>{
            const premiumList = await this.readPremiumList();
            premiumList[freePremium.deviceId] = freePremium;
            console.log(premiumList);
            await fs.writeJson(FREE_PREMIUM_FILE, premiumList, { spaces: 2 });
            return resolve({});
        })
    }

    isPremiumUser():Promise<boolean>{
        return new Promise<boolean>((resolve)=>{
            resolve(false);
        });
    }
 
    minusFreePremium(deviceId:string){
        return new Promise(async (resolve)=>{
            const freePremiumDevice = await this.findFreePremiumDevice(deviceId);
            freePremiumDevice.premiumCount--;
            await this.addFreePremiumDeviceId(freePremiumDevice);
            resolve({});
        })
    }
}