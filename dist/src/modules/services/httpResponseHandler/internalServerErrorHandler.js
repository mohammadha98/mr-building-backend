"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalServerErrorHandler = void 0;
const common_1 = require("@nestjs/common");
class InternalServerErrorHandler extends common_1.HttpException {
    constructor() {
        super({
            statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
            message: "خطا. سرور قادر به پردازش درخواست شما نمیباشد.",
            error: "INTERNAL_SERVER_ERROR",
            data: {},
        }, common_1.HttpStatus.UNAUTHORIZED);
    }
}
exports.InternalServerErrorHandler = InternalServerErrorHandler;
//# sourceMappingURL=internalServerErrorHandler.js.map