import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CommonUseUtil } from 'src/core/common-use-util';
import * as admin from 'firebase-admin';
import { TABLE_API_REQUEST_VALIDATOR, TABLE_PRODUCT } from 'src/core/global-constant';
@Injectable()
export class ProductService {

    constructor(private commonUseUtil:CommonUseUtil){}

    public onPurchaseProduct(deviceId:string,purchaseId:string,productId:string,tokens:number,payload:any){
        return new Promise(async(resolve)=>{
            const db = admin.firestore();

            const isProductIdExist = (await db.collection(TABLE_PRODUCT)
            .doc(deviceId)
            .collection(TABLE_PRODUCT)
            .doc(purchaseId).get()).exists;

            if(isProductIdExist){
                throw new HttpException('Product Id is already exist', HttpStatus.FORBIDDEN);
            }
            
            await this.commonUseUtil.addPremiumCountToAccount(deviceId,tokens)

            await db.collection(TABLE_PRODUCT)
                .doc(deviceId)
                .collection(TABLE_PRODUCT)
                .doc(purchaseId)
                .set({
                        purchaseId,productId,tokens,
                        payload,timestamp:new Date().getTime()
                    })
            const account = await this.commonUseUtil.findAccountSubscribeDevice(deviceId);

            resolve(account);
        });
    } 

}
