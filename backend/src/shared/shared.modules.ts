import { AppConfig } from "src/core/app-config";
import { CommonUseUtil } from "src/core/common-use-util";
import { CryptUtil } from "src/core/crypt-util";
import { ApiRequestMiddleware } from "src/middlewares/api-request.middleware";

export const SharedProvider = [
    AppConfig,
    CommonUseUtil,
    CryptUtil,
    ApiRequestMiddleware
];
