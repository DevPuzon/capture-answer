import { Injectable } from '@nestjs/common';
import * as CryptoJS from 'crypto-js'; 
import { APPKEY } from 'src/environments/environment';

@Injectable()
export class CryptUtil {
   
  constructor() { }

  static encryptData(data:any):any {
    try {
      return CryptoJS.AES.encrypt(JSON.stringify(data), APPKEY).toString();
    } catch (e) {
      //console.log(e);
    }
  }

  static decryptData(data:any):any {
    try {
      const bytes = CryptoJS.AES.decrypt(data,APPKEY);
      if (bytes.toString()) {
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      }
      return data;
    } catch (e) {
      //console.log(e);
    }
  }
}
