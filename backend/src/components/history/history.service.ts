import { Injectable } from '@nestjs/common';
import { HistoryData } from 'src/intefaces/history.model';
import * as admin from 'firebase-admin';
import { TABLE_HISTORY } from 'src/core/global-constant';
@Injectable()
export class HistoryService {

    getHistoryListPerAccount(deviceId: string):Promise<HistoryData[]> {
        return new Promise<HistoryData[]>(async(resolve)=>{
            
            const db = admin.firestore();
            const ref = await db.collection(TABLE_HISTORY).doc(deviceId).collection(TABLE_HISTORY).get();
            let list:HistoryData[] = [];
            for(let data of ref.docs){ 
                list.push(data.data() as HistoryData);
            }

            return resolve(list)
        })
    }

    saveHistoryItem(deviceId: string, history: HistoryData):Promise<{deviceId:string,history: HistoryData}> {
        return new Promise<{deviceId:string,history: HistoryData}>(async(resolve)=>{
            
            const db = admin.firestore();
            await db.collection(TABLE_HISTORY)
            .doc(deviceId)
            .collection(TABLE_HISTORY)
            .doc(history.captureId)
            .set(history);
            
            return resolve({deviceId,history})
        })
    }

    deleteHistoryItem(deviceId: string, captureId: string): Promise<{deviceId:string,captureId: string}> {
        return new Promise<{deviceId:string,captureId: string}>(async(resolve)=>{
            
            const db = admin.firestore();
            await db.collection(TABLE_HISTORY)
            .doc(deviceId)
            .collection(TABLE_HISTORY)
            .doc(captureId)
            .delete();
            
            return resolve({deviceId,captureId})
        })
    }

}
