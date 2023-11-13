import { Injectable } from "@nestjs/common";
import * as dotenv from 'dotenv';

@Injectable()
export class AppConfig {
    private readonly envConfig: { [key: string]: string };

    constructor() {
      this.envConfig = dotenv.config().parsed;
    }
  
    getEnvironment(): string {
      return this.envConfig['environment'];
    }
}