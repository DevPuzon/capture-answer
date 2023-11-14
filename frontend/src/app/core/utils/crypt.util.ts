import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CryptUtil {

  constructor() { }

  static encryptData(data:any):any {
    try {
      return CryptoJS.AES.encrypt(JSON.stringify(data), environment.appKey).toString();
    } catch (e) {
      //console.log(e);
    }
  }

  static decryptData(data:any):any {
    try {
      const bytes = CryptoJS.AES.decrypt(data,environment.appKey);
      if (bytes.toString()) {
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      }
      return data;
    } catch (e) {
      //console.log(e);
    }
  }
}
