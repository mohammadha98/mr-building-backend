"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tooManyRequestErrorHandler = void 0;
const common_1 = require("@nestjs/common");
class tooManyRequestErrorHandler extends common_1.HttpException {
    constructor() {
        super({
            statusCode: common_1.HttpStatus.TOO_MANY_REQUESTS,
            message: "خطا. تعداد درخواست غیر مجاز. لطفا کمی صبر کنید و مجدد تلاش کنید.",
            error: "TOO_MANY_REQUESTS",
            data: {},
        }, common_1.HttpStatus.TOO_MANY_REQUESTS);
    }
}
exports.tooManyRequestErrorHandler = tooManyRequestErrorHandler;
//# sourceMappingURL=tooManyRequestErrorHandler.js.map