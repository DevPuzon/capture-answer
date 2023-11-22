import {
  Injectable,
  Query,
  inject
} from '@angular/core';
import {
  CollectionReference,
  DocumentData,
  Firestore, collection, collectionData, doc, getDocs, limit, orderBy, query, startAfter
} from '@angular/fire/firestore';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from '@angular/common/http';
import {
  environment
} from 'src/environments/environment';
import { UserAccount } from '../models/user-account.model';
import { CommonUseUtil } from "../core/utils/common-use.util";
import { Observable } from 'rxjs';
import { AppStates } from '../core/app-states';
import { ToastService } from './toast.service';
@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private firestore: Firestore = inject(Firestore);
  private countPerPage = 10;

  constructor(
    private toastService:ToastService,
    private appStates : AppStates,
    private http: HttpClient ) {}

  public sendMessage(message: string, uid: string): Promise < any > {
    return new Promise < any > ((resolve, reject) => {

      const body = {
        message: message
      }

      this.http.post(`${environment.apiBaseURL}chat-ai/convo/${uid}`, body, {
      })
      .subscribe((res: any) => {
        if(res.success){
          const data = res.data;
          this.appStates.setRemainingTokens(data.accountSubscribeDevice.premiumCount);
          this.appStates.setFreeUserChat(data.accountSubscribeDevice.freeChatCount);
        }
        resolve({});
      },
      (error: HttpErrorResponse) => {
        if(error.error){
          this.toastService.presentToast(error.error.message);
        }else{
          this.toastService.presentToast('Something went wrong');
        }
        reject(error);
      })
    })
  }

  public sendMessageVision(roomId : string, message : string, imageUrl:string): Promise < any > {
    return new Promise < any > (async (resolve, reject) => {
      const deviceId = await CommonUseUtil.getDeviceUID();

      const body = {
        message:message,
        imageUrl:imageUrl,
        deviceId:deviceId,
        roomId:roomId
      }
      console.log("sendMessageVision body",body,roomId,message,imageUrl);
      this.http.post(`${environment.apiBaseURL}chat-ai/convo-vision`, body, {
      })
      .subscribe((res: any) => {
        if(res.success){
          const data = res.data;
          this.appStates.setRemainingTokens(data.accountSubscribeDevice.premiumCount);
          this.appStates.setFreeUserChat(data.accountSubscribeDevice.freeChatCount);
        }
        resolve({});
      },
      (error: HttpErrorResponse) => {
        if(error.error){
          this.toastService.presentToast(error.error.message);
        }else{
          this.toastService.presentToast('Something went wrong');
        }
        reject(error);
      })
    })
  }

  public convoObservable(tableName : string, roomId : string) {
    return new Promise < any > (async (resolve) => {
      const convoRef = collection(doc(collection(this.firestore, tableName), roomId), tableName);
      const convoQuery = query(
        convoRef,
        orderBy('created_at', 'desc'),
        limit(this.countPerPage));

      const convoCollectionData = collectionData(convoQuery);
      resolve([convoRef, convoQuery, convoCollectionData]);
    })
  }

  public loadMoreConvo(firstQuery: any , convoRef: CollectionReference < DocumentData > ) {
    return new Promise < any > (async (resolve) => {
      const documentSnapshots = await getDocs(firstQuery);
      const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];
      console.log("last", lastVisible);
      const convoQuery = query(
        convoRef,
        orderBy('created_at', 'desc'),
        startAfter(lastVisible),
        limit(this.countPerPage));

      const convoCollectionData = collectionData(
        convoQuery
      );
      resolve([convoQuery, convoCollectionData]);
    })
  }
}
