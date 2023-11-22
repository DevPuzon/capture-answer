import { CryptUtil } from "src/core/crypt-util";

export const IS_PROD = false;
export const ENVIRONMENT = 'local';
export const PORT = 3000;
export const APPKEY = "QyB-Rea-90I";
export const OPEN_AI_KEY = CryptUtil.decryptData('U2FsdGVkX193IS7eKGCJF48mepn1/D8WIc8LL95dp1wOIOCSB0zt8opUcEEeNvZ09eHLkdF5wLDlP7+KpOF/gkbzjzgL+8zrtEFfZy+A5V4=');