import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  Injectable
} from '@angular/core';
import { environment } from 'src/environments/environment';
import { AppStates } from '../core/app-states';
import { ALREADY_CLAIMED_GIFT } from '../core/global-variable';
import { CommonUseUtil } from '../core/utils/common-use.util';
import { LStorage } from '../core/utils/lstorage.util';
import { CryptUtil } from '../core/utils/crypt.util';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(
    private appStates: AppStates,
    private commonUseUtil: CommonUseUtil,
    private httpClient: HttpClient) {}

  onPurchase(productId:string,purchaseId:string,tokens:number,payload:any) {
    return new Promise(async (resolve, reject) => {
      const deviceUID = await CommonUseUtil.getDeviceUID();
      const body = {
        deviceId: deviceUID,
        purchaseId:purchaseId,
        productId:productId,
        tokens:tokens,
        payload:payload
      }

      const transactionId = this.commonUseUtil.getUID(20);
      const headers = new HttpHeaders({
        'transactionid': transactionId,
        'encrypTransactionid': CryptUtil.encryptData(transactionId)
      });

      const req = this.httpClient.post(environment.apiBaseURL + 'product/purchase',
      body,{headers}).subscribe(
        (res: any) => {
          req.unsubscribe();
          if(res.success){
            const data = res.data;
            this.appStates.setRemainingTokens(data.premiumCount);
          }
          console.log("onPurchase res",res)
          resolve({});
        }
      );
    })
  }


}
