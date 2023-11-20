import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AdminMiddlware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`Request ${req.method} ${req.path} at ${new Date()}`);

    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader.substring(7);
    if (token != 'msp') { 
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    
    next();
  }
}