import {
  Injectable
} from "@angular/core";
import {
  CryptUtil
} from "./crypt.util";

@Injectable({
  providedIn: 'root'
})
export class LStorage {

  static set(key: string, value: string) {
    value = CryptUtil.encryptData(value);
    localStorage.setItem(key, value);
    console.log("Lstorage set", key, value);
  }

  static get(key: string) {
    let data = localStorage.getItem(key);
    data = CryptUtil.decryptData(data);
    console.log("Lstorage get", key, data);
    return data;
  }
}



// constructor(
//   private platform: Platform) {}

// async set(key: string, value: string) {
//   value = CryptUtil.encryptData(value);
//   if (this.isNativeAndroid() || this.isNativeIos()) {
//     await this.nativeSetStorage(key, value);
//   } else {
//     this.webSetStorage(key, value);
//   }
//   console.log("LStorage set", key, value);
// }

// get(key: string) {
//   return new Promise < string > (async (resolve) => {
//     let data = '';

//     if (this.isNativeAndroid() || this.isNativeIos()) {
//       data = await this.nativeGetStorage(key);
//     } else {
//       data = this.webGetStorage(key);
//     }

//     console.log("LStorage get", key, data);
//     return resolve(data);
//   })
// }

// private async nativeSetStorage(key: string, value: string) {
//   await Preferences.set({
//     key: key,
//     value: value
//   });
// }

// private nativeGetStorage(key: string): Promise < string > {
//   return new Promise < string > (async (resolve) => {
//     const ret = await Preferences.get({
//       key: key
//     });
//     let value = '';
//     if (ret.value) {
//       value = CryptUtil.decryptData(ret.value);
//     }
//     return resolve(value);
//   })
// }

// private async webSetStorage(key: string, value: string) {
//   localStorage.setItem(key, value);
// }

// private webGetStorage(key: string) {
//   let data = localStorage.getItem(key);
//   data = CryptUtil.decryptData(data);
//   return data ? data : '';
// }


// isNativeAndroid(): boolean {
//   return this.platform.is('android') && this.platform.is('capacitor')
// }
// isNativeIos(): boolean {
//   return this.platform.is('ios') && this.platform.is('capacitor')
// }
// }
