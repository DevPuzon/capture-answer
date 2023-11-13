import * as CryptoJS from 'crypto-js'; 
export class CryptUtil {
    APP_CRYPT_1 = 'da240cc3-4ecd-b62e-5d6abdd2dee3';
    APP_CRYPT_2 = 'da240cc3-4ecd-b62e';
    APP_CRYPT_3 = '4ecd-b62e-5d6abdd2dee3';

    constructor() { }
   
    encrypt(data:any){
        const encrypt1 = this.encryptData(data,this.APP_CRYPT_1);
        const encrypt2 = this.encryptData(encrypt1,this.APP_CRYPT_2);
        const encrypt3 = this.encryptData(encrypt2,this.APP_CRYPT_3);
        return encrypt3;
    }

    
    decrypt(data:any){
        const encrypt1 = this.decryptData(data,this.APP_CRYPT_3);
        const encrypt2 = this.encryptData(encrypt1,this.APP_CRYPT_2);
        const encrypt3 = this.encryptData(encrypt2,this.APP_CRYPT_1);
        return encrypt3;
    }

    private encryptData(data:any,crypt:string) { 
      try {
        return CryptoJS.AES.encrypt(JSON.stringify(data), crypt).toString();
      } catch (e) {
        //console.log(e);
      } 
    }
  
    private decryptData(data:string,crypt:string):any { 
      try {
        const bytes = CryptoJS.AES.decrypt(data,crypt); 
        if (bytes.toString()) { 
          return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        }else{
          return null;
        }
      } catch (e) {
        console.log(e);
      } 
    }
  }
  