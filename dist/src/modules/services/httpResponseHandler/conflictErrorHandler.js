"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConflictErrorHandler = void 0;
const common_1 = require("@nestjs/common");
class ConflictErrorHandler extends common_1.HttpException {
    constructor(message) {
        super({
            statusCode: common_1.HttpStatus.CONFLICT,
            message,
            error: "CONFLICT",
            data: {},
        }, common_1.HttpStatus.CONFLICT);
    }
}
exports.ConflictErrorHandler = ConflictErrorHandler;
//# sourceMappingURL=conflictErrorHandler.js.map