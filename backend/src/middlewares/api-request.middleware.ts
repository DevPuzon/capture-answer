import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware
} from '@nestjs/common';
import {
  Request,
  Response,
  NextFunction
} from 'express';
import {
  CryptUtil
} from 'src/core/crypt-util'; 
import { CommonUseUtil } from 'src/core/common-use-util';
@Injectable()
export class ApiRequestMiddleware implements NestMiddleware {
  constructor(private commonUseUtil:CommonUseUtil){}
  async use(req: Request, res: Response, next: NextFunction) {
    const {
      transactionid,
      encryptransactionid
    } = req.headers;
    console.log("req.headers",req.headers);
    const body = req.body;

    const decryptTransactionId = CryptUtil.decryptData(encryptransactionid);
    console.log("decryptTransactionId",decryptTransactionId,transactionid);
    if (decryptTransactionId != transactionid) {
      throw new HttpException('Unauthorized 1', HttpStatus.UNAUTHORIZED);
    }
 
    const exist = await this.commonUseUtil.isApiRequestIdExist(transactionid.toString());
    if(exist){ 
      throw new HttpException('Unauthorized 2', HttpStatus.UNAUTHORIZED);
    }

    await this.commonUseUtil.saveApiRequestLogs(transactionid.toString(),body);

    next();
  }
}