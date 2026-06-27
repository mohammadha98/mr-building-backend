"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadRequestErrorHandler = void 0;
const common_1 = require("@nestjs/common");
class BadRequestErrorHandler extends common_1.HttpException {
    constructor(message) {
        super({
            statusCode: common_1.HttpStatus.BAD_REQUEST,
            message,
            error: "Bad Request",
            data: {},
        }, common_1.HttpStatus.BAD_REQUEST);
    }
}
exports.BadRequestErrorHandler = BadRequestErrorHandler;
//# sourceMappingURL=badRequestErrorHandler.js.map