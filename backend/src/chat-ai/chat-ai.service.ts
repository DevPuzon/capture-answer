import { Injectable } from '@nestjs/common'; 
import { v4 as uuidv4 } from 'uuid'; 
import { OCR_CHAT_AI_USER_ID, OCR_CHAT_PROMPT, READ_HISTORY_COUNT, TABLE_CHAT_AI } from 'src/core/global-constant';
import { Chat } from 'src/chat-ai/interfaces/chat.model';
import * as admin from 'firebase-admin';  
import { CommonUseUtil } from 'src/core/common-use-util';

@Injectable()
export class ChatAiService {
    
    constructor(private commonUseUtil:CommonUseUtil){}

    public chatAi(deviceId:string,message : string){
        return new Promise(async (resolve,reject)=>{
            const isPremiumUser = await this.commonUseUtil.isPremiumUser();
            const freePremiumDevice = await this.commonUseUtil.findFreePremiumDevice(deviceId);
            if(!isPremiumUser){
                console.log("freePremiumDevice",freePremiumDevice);
                if(!freePremiumDevice || freePremiumDevice.premiumCount <= 0){
                    return reject({message:"No premium access"});
                }else{
                    this.commonUseUtil.minusFreePremium(deviceId);
                }
            }

            const roomId = deviceId;
            await this.saveMessage(TABLE_CHAT_AI,roomId,deviceId,message);
            const convoData = await this.getConvoHistory(roomId);
            const botResponse = await this.requestChatGPT(message ,OCR_CHAT_PROMPT, convoData);
            const botMessage = botResponse;
            await this.saveMessage(TABLE_CHAT_AI,roomId,OCR_CHAT_AI_USER_ID,botMessage);
            

            resolve({message:botMessage,freePremiumDevice:freePremiumDevice});

            // resolve({});
        })
    }












    
    private requestChatGPT(message: string,prompt : string, convoData? : any) : Promise<string> {
        return new Promise<string>(async(resolve) => {  
            // message += prompt;
            // const openai = new OpenAI({
            //     apiKey: process.env.OPENAI_API_KEY,
            // });  
            // let messages : any= [
            //     {
            //         "role": "system",
            //         "content": message
            //     } 
            // ];
            // if(convoData){ 
            //     messages = messages.concat(convoData);
            // }
            
            // const response = await openai.chat.completions.create({
            //     model: "gpt-3.5-turbo",
            //     messages: messages,
            //     temperature: 1,
            //     max_tokens: 256,
            //     top_p: 1,
            //     frequency_penalty: 0,
            //     presence_penalty: 0,
            // });
            // console.log(response);
            // resolve(response.choices[0].message.content); 
            resolve("test from- ai");
        })
    }

    private getConvoHistory(roomId : string){
        return new Promise(async (resolve)=>{ 

            const db = admin.firestore();
            const collectionRef  = db.collection(TABLE_CHAT_AI).doc(roomId)
            .collection(TABLE_CHAT_AI);
            const querySnapshot = await collectionRef.orderBy('created_at', 'desc').limit(READ_HISTORY_COUNT).get();

            const convoHistory: any[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data() as Chat;
                convoHistory.push(
                    {
                        role : OCR_CHAT_AI_USER_ID != data.user_id ? "user" : "assistant",
                        content : data.message
                    }
                );
            }); 
            console.log(convoHistory);

            resolve(convoHistory);
        })
    }

    private saveMessage(tableName : string , roomId : string ,user_id : string ,message : string, metadata? : any){
        return new Promise(async (resolve)=>{
            const chat_id = uuidv4();
            const chat : Chat = {
                id : chat_id,
                user_id : user_id,
                message : message,
                meta_data : metadata ? metadata : false,
                created_at : admin.firestore.FieldValue.serverTimestamp(),
                updated_at : admin.firestore.FieldValue.serverTimestamp(),
            }

            console.log('saveMessage',chat);
            const db = admin.firestore();
            const saveChat = await db.collection(tableName).doc(roomId)
            .collection(tableName).doc(chat_id)
            .set(chat);

            resolve(saveChat);
        })
    }
}
