

import * as dotenv from 'dotenv';
import { ENVIRONMENT } from 'src/environments/environment';

dotenv.config();
// export const TABLE_CHAT_AI = 'ocr-chat-ai-'+process.env.ENVIRONMENT;
// export const TABLE_CHAT_VISON_AI = 'ocr-chat-vision-ai-'+process.env.ENVIRONMENT;
export const TABLE_CHAT_AI = 'ocr-chat-ai-'+ENVIRONMENT;
export const TABLE_SUBSCRIBERS = 'subscribers-'+ENVIRONMENT;
export const TABLE_CHAT_VISON_AI = 'ocr-chat-vision-ai-'+ENVIRONMENT;


// export const LOCAL_SUBSCRIBE = 'LOCAL_SUBSCRIBE.json';
export const FREE_CHAT_COUNT = 10;
export const PREMIUM_COUNT = 2;
export const READ_HISTORY_COUNT = 2; 
export const OCR_CHAT_PROMPT = "";
export const OCR_CHAT_AI_USER_ID = 'OCR_CHAT_AI_USER_ID';
export const CHAT_PREMIUM_COST = 0.1;
export const CHAT_VISION_PREMIUM_COST = 1; 