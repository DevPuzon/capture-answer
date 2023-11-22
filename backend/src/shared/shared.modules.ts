import { AppConfig } from "src/core/app-config";
import { CacheUtil } from "src/core/cache-util";
import { CommonUseUtil } from "src/core/common-use-util";
import { CryptUtil } from "src/core/crypt-util";
import { ApiRequestMiddleware } from "src/middlewares/api-request.middleware";

export const SharedProvider = [
    AppConfig,
    CommonUseUtil,
    CryptUtil,
    CacheUtil,
    ApiRequestMiddleware
];
