import {
    Injectable
} from '@nestjs/common';
import {
    v4 as uuidv4
} from 'uuid';
import {
    OCR_CHAT_AI_USER_ID,
    OCR_CHAT_PROMPT,
    READ_HISTORY_COUNT,
    TABLE_CHAT_AI,
    TABLE_CHAT_VISON_AI,
    TABLE_OPEN_AI_LOGS
} from 'src/core/global-constant';
import {
    Chat
} from 'src/components/chat-ai/interfaces/chat.model';
import * as admin from 'firebase-admin';
import {
    CommonUseUtil
} from 'src/core/common-use-util';
import OpenAI from "openai";
import {
    IS_PROD,
    OPEN_AI_KEY
} from 'src/environments/environment';
import {
    ChatCompletion
} from 'openai/resources';
import { AccountSubscribe } from 'src/intefaces/account-subscribe';

@Injectable()
export class ChatAiService {

    constructor(private commonUseUtil: CommonUseUtil) {}

    public chatAi(deviceId: string, message: string) {
        return new Promise(async (resolve, reject) => {
            let account = await this.commonUseUtil.findAccountSubscribeDevice(deviceId);
            try {
                account = await this.chatValidation(account, false);
            } catch (ex) {
                return reject(ex);
            }

            const roomId = deviceId;
            await this.saveMessage(TABLE_CHAT_AI, roomId, deviceId, message);
            const convoData = await this.getConvoHistory(TABLE_CHAT_AI,roomId);
            // const convoData = null;
            const botResponse = await this.requestChatGPT(convoData);
            const botMessage = botResponse.message;
            await this.saveMessage(TABLE_CHAT_AI, roomId, OCR_CHAT_AI_USER_ID, botMessage);
            this.saveOpenAiLogs(deviceId, botMessage, botResponse.logs, null); 

            resolve({
                message: botMessage,
                accountSubscribeDevice: account
            }); 
        })
    }

    public chatVisionAi(deviceId: string, roomId: string, message: string, imageUrl: string) {
        return new Promise(async (resolve, reject) => {
            console.log('chatVisionAi', deviceId, roomId, message, imageUrl);
            let account = await this.commonUseUtil.findAccountSubscribeDevice(deviceId);
            try {
                account = await this.chatValidation(account, true);
            } catch (ex) {
                return reject(ex);
            }
            console.log('chatVisionAi account', account);

            await this.saveMessage(TABLE_CHAT_VISON_AI, roomId, deviceId, message); 
            const convoData = await this.getConvoHistory(TABLE_CHAT_VISON_AI,roomId);
            const botResponse = await this.requestChatVisionGPT(imageUrl,convoData);
            const botMessage = botResponse.message;
            console.log('chatVisionAi botMessage', botMessage);
            await this.saveMessage(TABLE_CHAT_VISON_AI, roomId, OCR_CHAT_AI_USER_ID, botMessage);
            this.saveOpenAiLogs(deviceId, botMessage, botResponse.logs, null);
 
            console.log('chatVisionAi accountSubscribeDevice', account);
            resolve({
                message: botMessage,
                accountSubscribeDevice: account
            });

            // resolve({});
        })
    }











    private saveOpenAiLogs(deviceId: string, message: string, logs: any, other: any) {
        const db = admin.firestore();
        const docId = CommonUseUtil.getUID(); 
        db.collection(TABLE_OPEN_AI_LOGS).doc(deviceId)
        .collection(TABLE_OPEN_AI_LOGS).doc(docId).set({
            deviceId,
            message,
            logs,
            other
        });
    }

    private requestChatGPT(convoData : any): Promise < {
        message: string,
        logs: any
    } > {
        return new Promise < {
            message: string,
            logs: any
        } > (async (resolve) => {
            console.log("requestChatGPT starting");
            if (IS_PROD) {
                // message += prompt;
                const openai = new OpenAI({
                    apiKey: OPEN_AI_KEY,
                });
                // let messages: any = [{
                //     "role": "system",
                //     // "content": 'You are a helpful assistant.'
                //     "content": message
                // }];
                // if (convoData) {
                //     messages = messages.concat(convoData);
                // }
                const request: any = {
                    model: "gpt-3.5-turbo",
                    messages: convoData,
                    temperature: 1,
                    max_tokens: 256,
                    top_p: 1,
                    frequency_penalty: 0,
                    presence_penalty: 0,
                }
                const response: ChatCompletion = await openai.chat.completions.create(request);
                console.log('requestChatGPT',response);
                let responseMsg = response.choices[0].message.content;
                responseMsg = responseMsg.replaceAll('\n','<br>');
                console.log('requestChatGPT responseMsg',responseMsg); 
                console.log("requestChatGPT done");
                resolve({
                    message: responseMsg,
                    logs: {
                        request: request,
                        response: response
                    }
                });
            } else {
                console.log("requestChatGPT done");
                resolve({
                    message: 'test chat ai',
                    logs: null as ChatCompletion
                });
            }
        })
    }

    private requestChatVisionGPT(imageUrl: string,convoData : any[]): Promise < {
        message: string,
        logs: any
    } > {
        return new Promise < {
            message: string,
            logs: any
        } > (async (resolve) => {
            console.log("requestChatVisionGPT starting");
            if (IS_PROD) {
                const openai = new OpenAI({
                    apiKey: OPEN_AI_KEY,
                });
                
                let messages = [{
                    role: "user",
                    content: [ 
                        {
                            type: "image_url",
                            image_url: {
                                "url": imageUrl,
                                "detail": "low"
                            },
                        },
                    ],
                }];
                messages = [...convoData,...messages];

                const request: any = {
                    model: "gpt-4-vision-preview",
                    messages: messages, 
                    max_tokens: 300
                };
                const response = await openai.chat.completions.create(request);
                console.log('requestChatVisionGPT',response);
                let responseMsg = response.choices[0].message.content;
                responseMsg = responseMsg.replaceAll('\n','<br>');
                console.log('requestChatVisionGPT responseMsg',responseMsg);
                console.log("requestChatVisionGPT done");
                resolve({
                    message: responseMsg,
                    logs: {
                        request: request,
                        response: response
                    }
                });
            } else {
                console.log("requestChatVisionGPT done");
                resolve({
                    message: 'test from- ai requestChatVisionGPT',
                    logs: null as ChatCompletion
                });
            }
        })
    }

    private getConvoHistory(tableName:string,roomId: string):Promise<any[]> {
        return new Promise<any[]>(async (resolve) => {

            const db = admin.firestore();
            const collectionRef = db.collection(tableName).doc(roomId)
                .collection(tableName);

            const querySnapshot = await collectionRef.orderBy('created_at', 'desc')
            .limit(READ_HISTORY_COUNT).get();

            const convoHistory: any[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data() as Chat;
                if(OCR_CHAT_AI_USER_ID != data.user_id){
                    convoHistory.unshift({
                        role: OCR_CHAT_AI_USER_ID != data.user_id ? "user" : "assistant",
                        content: data.message
                    });
                }
                // else{
                //     convoHistory.unshift({
                //         role: 'assistant',
                //         content: ''
                //     });
                // }
            });
            console.log(convoHistory);

            resolve(convoHistory);
        })
    }

    private saveMessage(tableName: string, roomId: string, user_id: string, message: string, metadata ? : any) {
        return new Promise(async (resolve) => {
            console.log('saveMessage', tableName, roomId, user_id, message, metadata);
            const chat_id = uuidv4();
            const chat: Chat = {
                id: chat_id,
                user_id: user_id,
                message: message,
                meta_data: metadata ? metadata : false,
                created_at: admin.firestore.FieldValue.serverTimestamp(),
                updated_at: admin.firestore.FieldValue.serverTimestamp(),
            }

            console.log('saveMessage', chat);
            const db = admin.firestore();
            const saveChat = await db.collection(tableName).doc(roomId)
                .collection(tableName).doc(chat_id)
                .set(chat);

            resolve(saveChat);
        })
    }

    private chatValidation(account:AccountSubscribe,isUseChatVision: boolean):Promise<AccountSubscribe> {
        return new Promise<AccountSubscribe>(async (resolve, reject) => {
            console.log("chatValidation", account);
            const isPremiumUser = await this.commonUseUtil.isPremiumUser(account);
            // let accountSubscribeDevice = await this.commonUseUtil.findAccountSubscribeDevice(deviceId);

            console.log("chatValidation account", account,isPremiumUser);
            if (isPremiumUser) {
                // Has premium count above 0
                if (isUseChatVision) {
                    account = await this.commonUseUtil.minusChatWithVisonAccountSubscribe(account);
                } else {
                    const freeAiChat = account.freeChatCount;
                    if (freeAiChat > 0) {
                        // if has free ai Chat
                        account = await this.commonUseUtil.minusFreeChatAccountSubscribe(account);
                    } else {
                        account = await this.commonUseUtil.minusChatAccountSubscribe(account);
                    }
                }
            } else {
                // Has premium count below or equals 0
                if (isUseChatVision) {
                    return reject({
                        message: "No more token"
                    });
                }

                console.log("accountSubscribeDevice", account);
                if (!account || account.freeChatCount <= 0) {
                    return reject({
                        message: "No more token"
                    });
                } else {
                    account = await this.commonUseUtil.minusFreeChatAccountSubscribe(account);
                }
            }

            resolve(account);
        })
    }
}