import {
    HttpException,
    HttpStatus,
    Injectable
} from "@nestjs/common";
// import * as fs from 'fs-extra';
import {
    CHAT_PREMIUM_COST,
    CHAT_VISION_PREMIUM_COST,
    TABLE_API_REQUEST_VALIDATOR,
    TABLE_CHAT_AI,
    TABLE_CLAIM_REWARDS,
    TABLE_SUBSCRIBERS
} from 'src/core/global-constant';
import {
    AccountSubscribe
} from "src/intefaces/account-subscribe";
import * as admin from 'firebase-admin';
import {
    ClaimRewards
} from "src/intefaces/claim-rewards";

@Injectable()
export class CommonUseUtil {

    subscriberList(): Promise < any > {
        return new Promise(async (resolve) => {
            const db = admin.firestore();

            const querySnapshot = await db.collection(TABLE_SUBSCRIBERS)
                .get();
            let list = [];
            for (const data of querySnapshot.docs) {
                list.push(data.data());
            }
            return resolve(list);
        })
    }

    findAccountSubscribeDevice(deviceId: string): Promise < AccountSubscribe > {
        return new Promise < AccountSubscribe > (async (resolve) => {
            const db = admin.firestore();

            let account = (await db.collection(TABLE_SUBSCRIBERS).doc(deviceId).get()).data() as AccountSubscribe;
            return resolve(account);
        })
    }

    addAccountSubscribeDeviceId(accountSubscribe: AccountSubscribe): Promise < AccountSubscribe > {
        return new Promise < AccountSubscribe > (async (resolve) => {
            const db = admin.firestore();
            await db.collection(TABLE_SUBSCRIBERS)
                .doc(accountSubscribe.deviceId).set(accountSubscribe);

            return resolve(accountSubscribe);
        })
    }

    updateAccountSubscriber(deviceId: string, freeChatCount: number = -1, premiumCount: number = -1) {
        return new Promise < any > (async (resolve) => {
            const account = await this.findAccountSubscribeDevice(deviceId);

            if (freeChatCount != -1) {
                account.freeChatCount = freeChatCount;
            }
            if (premiumCount != -1) {
                account.premiumCount = premiumCount;
            }

            const db = admin.firestore();
            await db.collection(TABLE_SUBSCRIBERS)
                .doc(account.deviceId).set(account);


            return resolve({});
        })
    }

    addPremiumCountToAccount(deviceId: string, premiumCount: number) {
        return new Promise < any > (async (resolve, reject) => {
            let account = await this.findAccountSubscribeDevice(deviceId);
            if (!account) {
                throw new HttpException({
                    success: false,
                    message: "Device Id doesn't exist"
                }, HttpStatus.FORBIDDEN);
            }
            account.premiumCount = account.premiumCount + premiumCount;
            await this.updateAccountSubscriber(deviceId, -1, account.premiumCount);
            return resolve({});
        })
    }

    deleteAccountSubscriber(deviceId) {
        return new Promise < any > (async (resolve) => {
            const db = admin.firestore();
            await db.collection(TABLE_SUBSCRIBERS)
                .doc(deviceId).delete();

            return resolve({});
        })
    }

    insertUpdateSubscriber(premiumList: any) {
        return new Promise(async (resolve) => {
            const db = admin.firestore();
            const save = await db.collection(TABLE_SUBSCRIBERS).doc(TABLE_SUBSCRIBERS).set(premiumList);
            return resolve(save);
        })
    }
 
    isPremiumUser(account:AccountSubscribe): Promise < boolean > {
        return new Promise < boolean > (async (resolve) => { 
            if (!account) {
                return resolve(false);
            } 
            resolve(account.premiumCount > 0);
        });
    }

    minusFreeChatAccountSubscribe(account:AccountSubscribe):Promise<AccountSubscribe> {
        return new Promise<AccountSubscribe>(async (resolve) => { 
            account.freeChatCount--;
            account.freeChatCount = CommonUseUtil.formatNumber(account.freeChatCount);
            account = await this.addAccountSubscribeDeviceId(account);
            resolve(account);
        })
    }

    minusChatAccountSubscribe(account:AccountSubscribe):Promise<AccountSubscribe> {
        return new Promise<AccountSubscribe>(async (resolve) => { 
            account.premiumCount = account.premiumCount - CHAT_PREMIUM_COST;

            account.premiumCount = CommonUseUtil.formatNumber(account.premiumCount);
            console.log("minusChatAccountSubscribe", account);
            account = await this.addAccountSubscribeDeviceId(account);
            resolve(account);
        })
    }

    minusChatWithVisonAccountSubscribe(account:AccountSubscribe):Promise<AccountSubscribe> {
        return new Promise<AccountSubscribe>(async (resolve) => { 
            account.premiumCount = account.premiumCount - CHAT_VISION_PREMIUM_COST;
            account = await this.addAccountSubscribeDeviceId(account);
            resolve(account);
        })
    }

    currentClaimedRewards(deviceId: string) {
        return new Promise < ClaimRewards | null > (async (resolve, reject) => {
            const db = admin.firestore();
            const querySnapshot = await db.collection(TABLE_CLAIM_REWARDS).doc(deviceId).get();
            const data = querySnapshot.data() as ClaimRewards || null;
            return resolve(data);
        })
    }

    claimRewards(deviceId: string) {
        return new Promise(async (resolve, reject) => {
            const db = admin.firestore();
            let currentClaimedRewards = null;
            try {
                currentClaimedRewards = await this.checkRewards(deviceId);
            } catch (ex) {
                return reject(ex);
            }
            currentClaimedRewards.claimRewardsCount += 1;

            console.log("claimRewards currentClaimedRewards", deviceId, currentClaimedRewards);
            await db.collection(TABLE_CLAIM_REWARDS).doc(deviceId).set(currentClaimedRewards);

            return resolve({
                ...currentClaimedRewards,
                isCanClaim: true
            });
        })
    }

    checkRewards(deviceId: string) {
        return new Promise(async (resolve, reject) => {
            let currentClaimedRewards = await this.currentClaimedRewards(deviceId);
            if (currentClaimedRewards) {
                const lastDate = new Date(currentClaimedRewards.lastClaim).getDate();
                const currentDate = new Date().getDate();
                if (currentDate != lastDate) {
                    currentClaimedRewards.claimRewardsCount = 0;
                }
            }

            if (!currentClaimedRewards) {
                currentClaimedRewards = {
                    deviceId: deviceId,
                    claimRewardsCount: 0,
                    lastClaim: new Date().getTime()
                }
            } else {
                if (currentClaimedRewards.claimRewardsCount >= 3) {
                    return reject({
                        ...currentClaimedRewards,
                        success: false,
                        message: "Exceed the claim rewards per day"
                    });
                }
            }
            currentClaimedRewards.lastClaim = new Date().getTime();

            resolve(currentClaimedRewards);
        })
    }

    isApiRequestIdExist(transactionId: string) {
        return new Promise(async (resolve) => {
            const db = admin.firestore();
            const isExist = (await db.collection(TABLE_API_REQUEST_VALIDATOR).doc(transactionId).get()).exists;
            return resolve(isExist);
        })
    }

    saveApiRequestLogs(transactionId: string, payload: any) {
        return new Promise(async (resolve) => {
            const db = admin.firestore();
            await db.collection(TABLE_API_REQUEST_VALIDATOR)
                .doc(transactionId).set({
                    payload: payload,
                    timestamp: new Date().getTime()
                });

            return resolve({});
        })
    }

    static formatNumber(num: number): number {
        const decimalPart = num % 1 === 0 ? 0 : num % 1;
        const ret = parseFloat((decimalPart === 0 ? num.toFixed(0) : num.toFixed(1)).toString());
        console.log("formatNumber", decimalPart, num, ret);
        return ret;
    }



    static getUID(length = 10) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let uid = '';
        const charactersLength = characters.length;

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charactersLength);
            uid += characters.charAt(randomIndex);
        }
        return uid;
    }
}