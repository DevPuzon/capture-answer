import {
    Injectable
} from '@nestjs/common';
import {
    CommonUseUtil
} from 'src/core/common-use-util';
import {
    FREE_CHAT_COUNT,
    PREMIUM_COUNT
} from 'src/core/global-constant';
import {
    AccountSubscribe
} from 'src/intefaces/account-subscribe';
import * as admin from 'firebase-admin';

@Injectable()
export class CommonUseService {
    constructor(private commonUseUtil: CommonUseUtil) {}

    public getAccountSubscribe(deviceId: string) {
        return new Promise(async (resolve) => {
            const accountSubscribeDevice = await this.commonUseUtil.findAccountSubscribeDevice(deviceId);
            let ret: AccountSubscribe = {
                deviceId: deviceId,
                premiumCount: 0,
                freeChatCount: 0
            };

            if (!accountSubscribeDevice) {
                const freeChatCount = FREE_CHAT_COUNT;
                const premiumCount = PREMIUM_COUNT;
                await this.commonUseUtil.addAccountSubscribeDeviceId({
                    deviceId,
                    freeChatCount,
                    premiumCount
                });

                ret = {
                    premiumCount: premiumCount,
                    freeChatCount: freeChatCount,
                    deviceId: deviceId
                };
            } else {
                ret = accountSubscribeDevice;
            }

            return resolve(ret);
        })
    }

    public checkAccountSubscribe(deviceId: string) {
        return new Promise(async (resolve) => {
            const accountSubscribeDevice = await this.commonUseUtil.findAccountSubscribeDevice(deviceId);
            let ret: AccountSubscribe = {
                deviceId: deviceId,
                premiumCount: 0,
                freeChatCount: 0,
                isCanClaimGift: false
            };

            if (accountSubscribeDevice) {
                ret = Object.assign(accountSubscribeDevice, {
                    isCanClaimGift: false
                });
            } else {
                ret.isCanClaimGift = true;
            }
            console.log("checkAccountSubscribe", ret, accountSubscribeDevice);
            return resolve(ret);
        })
    }

    public uploadImage(file: any) {
        return new Promise(async (resolve) => {
            console.log("uploadImage", file);
            const bucket = admin.storage().bucket();

            const fileName = `${Date.now()}_${file.originalname}`;
            const fileUpload = bucket.file(fileName);

            const stream = fileUpload.createWriteStream({
                metadata: {
                    contentType: file.mimetype,
                },
            });

            stream.on('error', (error) => { 
            }); 
            stream.on('finish', () => { 
            }); 
            stream.end(file.buffer);
 
            const imageUrl = `https://firebasestorage.googleapis.com/v0/b/ocr-chat-ai.appspot.com/o/${fileName}?alt=media`;
            console.log("uploadImage",imageUrl)
            return resolve ({
                imageUrl
            });
        });
    }

    public claimFreeAiChat(deviceId:string){
        return new Promise(async (resolve)=>{
            const freeAiChat = 1;
            const account = await this.commonUseUtil.findAccountSubscribeDevice(deviceId);
            account.freeChatCount+= freeAiChat;
            await this.commonUseUtil.updateAccountSubscriber(deviceId,account.freeChatCount,account.premiumCount);
            resolve(account);
        })
    }
}