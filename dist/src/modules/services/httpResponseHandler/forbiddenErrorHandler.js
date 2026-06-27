"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForbiddenErrorHandler = void 0;
const common_1 = require("@nestjs/common");
class ForbiddenErrorHandler extends common_1.HttpException {
    constructor() {
        super({
            statusCode: common_1.HttpStatus.FORBIDDEN,
            message: "خطا. اجازه ادامه کار را ندارید.",
            error: "Forbidden",
            data: {},
        }, common_1.HttpStatus.FORBIDDEN);
    }
}
exports.ForbiddenErrorHandler = ForbiddenErrorHandler;
//# sourceMappingURL=forbiddenErrorHandler.js.map