"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnAuthorizationErrorHandler = void 0;
const common_1 = require("@nestjs/common");
class UnAuthorizationErrorHandler extends common_1.HttpException {
    constructor() {
        super({
            statusCode: common_1.HttpStatus.UNAUTHORIZED,
            message: "خطا. احراز هویت انجام نشده است.",
            error: "Unauthorized",
            data: {},
        }, common_1.HttpStatus.UNAUTHORIZED);
    }
}
exports.UnAuthorizationErrorHandler = UnAuthorizationErrorHandler;
//# sourceMappingURL=unAuthorizationErrorHandler.js.map