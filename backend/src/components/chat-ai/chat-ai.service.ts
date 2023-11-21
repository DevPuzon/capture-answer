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

@Injectable()
export class ChatAiService {

    constructor(private commonUseUtil: CommonUseUtil) {}

    public chatAi(deviceId: string, message: string) {
        return new Promise(async (resolve, reject) => {
            let accountSubscribeDevice;
            try {
                accountSubscribeDevice = await this.chatValidation(deviceId, false);
            } catch (ex) {
                return reject(ex);
            }

            const roomId = deviceId;
            await this.saveMessage(TABLE_CHAT_AI, roomId, deviceId, message);
            const convoData = await this.getConvoHistory(roomId);
            const botResponse = await this.requestChatGPT(message, OCR_CHAT_PROMPT, convoData);
            const botMessage = botResponse.message;
            await this.saveMessage(TABLE_CHAT_AI, roomId, OCR_CHAT_AI_USER_ID, botMessage);
            this.saveOpenAiLogs(deviceId, botMessage, botResponse.logs, null);

            accountSubscribeDevice = await this.commonUseUtil.findAccountSubscribeDevice(deviceId);
            resolve({
                message: botMessage,
                accountSubscribeDevice: accountSubscribeDevice
            });

            // resolve({});
        })
    }

    public chatVisionAi(deviceId: string, roomId: string, message: string, imageUrl: string) {
        return new Promise(async (resolve, reject) => {
            console.log('chatVisionAi', deviceId, roomId, message, imageUrl);
            let accountSubscribeDevice;
            try {
                accountSubscribeDevice = await this.chatValidation(deviceId, true);
            } catch (ex) {
                return resolve(ex);
            }
            console.log('chatVisionAi accountSubscribeDevice', accountSubscribeDevice);

            await this.saveMessage(TABLE_CHAT_VISON_AI, roomId, deviceId, message);
            // const convoData = await this.getConvoHistory(roomId);
            const botResponse = await this.requestChatVisionGPT(message, imageUrl);
            const botMessage = botResponse.message;
            console.log('chatVisionAi botMessage', botMessage);
            await this.saveMessage(TABLE_CHAT_VISON_AI, roomId, OCR_CHAT_AI_USER_ID, botMessage);
            this.saveOpenAiLogs(deviceId, botMessage, botResponse.logs, null);

            accountSubscribeDevice = await this.commonUseUtil.findAccountSubscribeDevice(deviceId);

            console.log('chatVisionAi accountSubscribeDevice', accountSubscribeDevice);
            resolve({
                message: botMessage,
                accountSubscribeDevice: accountSubscribeDevice
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

    private requestChatGPT(message: string, prompt: string, convoData ? : any): Promise < {
        message: string,
        logs: any
    } > {
        return new Promise < {
            message: string,
            logs: any
        } > (async (resolve) => {
            if (IS_PROD) {
                message += prompt;
                const openai = new OpenAI({
                    apiKey: OPEN_AI_KEY,
                });
                let messages: any = [{
                    "role": "system",
                    "content": message
                }];
                if (convoData) {
                    messages = messages.concat(convoData);
                }
                const request: any = {
                    model: "gpt-3.5-turbo",
                    messages: messages,
                    temperature: 1,
                    max_tokens: 256,
                    top_p: 1,
                    frequency_penalty: 0,
                    presence_penalty: 0,
                }
                const response: ChatCompletion = await openai.chat.completions.create(request);
                console.log(response);

                resolve({
                    message: response.choices[0].message.content,
                    logs: {
                        request: request,
                        response: response
                    }
                });
            } else {
                resolve({
                    message: 'test chat ai',
                    logs: null as ChatCompletion
                });
            }
        })
    }

    private requestChatVisionGPT(message: string, imageUrl: string): Promise < {
        message: string,
        logs: any
    } > {
        return new Promise < {
            message: string,
            logs: any
        } > (async (resolve) => {
            if (IS_PROD) {
                const openai = new OpenAI({
                    apiKey: OPEN_AI_KEY,
                });
                const request: any = {
                    model: "gpt-4-vision-preview",
                    messages: [{
                        role: "user",
                        content: [{
                                type: "text",
                                text: message
                            },
                            {
                                type: "image_url",
                                image_url: {
                                    "url": imageUrl,
                                    "detail": "low"
                                },
                            },
                        ],
                    }], 
                    max_tokens: 300
                };
                const response = await openai.chat.completions.create(request);
                console.log(response);
                resolve({
                    message: response.choices[0].message.content,
                    logs: {
                        request: request,
                        response: response
                    }
                });
            } else {
                resolve({
                    message: 'test from- ai requestChatVisionGPT',
                    logs: null as ChatCompletion
                });
            }
        })
    }

    private getConvoHistory(roomId: string) {
        return new Promise(async (resolve) => {

            const db = admin.firestore();
            const collectionRef = db.collection(TABLE_CHAT_AI).doc(roomId)
                .collection(TABLE_CHAT_AI);
            const querySnapshot = await collectionRef.orderBy('created_at', 'desc').limit(READ_HISTORY_COUNT).get();

            const convoHistory: any[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data() as Chat;
                convoHistory.push({
                    role: OCR_CHAT_AI_USER_ID != data.user_id ? "user" : "assistant",
                    content: data.message
                });
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

    private chatValidation(deviceId: string, isUseChatVision: boolean) {
        return new Promise(async (resolve, reject) => {
            console.log("chatValidation", deviceId);
            const isPremiumUser = await this.commonUseUtil.isPremiumUser(deviceId);
            let accountSubscribeDevice = await this.commonUseUtil.findAccountSubscribeDevice(deviceId);

            console.log("chatValidation accountSubscribeDevice", accountSubscribeDevice);
            if (isPremiumUser) {
                // Has premium count above 0
                if (isUseChatVision) {
                    await this.commonUseUtil.minusChatWithVisonAccountSubscribe(deviceId);
                } else {
                    const freeAiChat = accountSubscribeDevice.freeChatCount;
                    if (freeAiChat > 0) {
                        // if has free ai Chat
                        await this.commonUseUtil.minusFreeChatAccountSubscribe(deviceId);
                    } else {
                        await this.commonUseUtil.minusChatAccountSubscribe(deviceId);
                    }
                }
            } else {
                // Has premium count below or equals 0
                if (isUseChatVision) {
                    return reject({
                        message: "No more token"
                    });
                }

                console.log("accountSubscribeDevice", accountSubscribeDevice);
                if (!accountSubscribeDevice || accountSubscribeDevice.freeChatCount <= 0) {
                    return reject({
                        message: "No more token"
                    });
                } else {
                    await this.commonUseUtil.minusFreeChatAccountSubscribe(deviceId);
                }
            }

            resolve(accountSubscribeDevice);
        })
    }
}