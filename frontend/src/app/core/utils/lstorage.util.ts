import { Injectable } from "@angular/core";
import { CryptUtil } from "./crypt.util";

@Injectable({
  providedIn: 'root'
})
export class LStorage {

  static set(key:string,value:string){
    value = CryptUtil.encryptData(value);
    localStorage.setItem(key,value);
    console.log("Lstorage set",key,value);
  }

  static get(key:string){
    let data = localStorage.getItem(key);
    data = CryptUtil.decryptData(data);
    console.log("Lstorage get",key,data);
    return data;
  }
}
