"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnProcessableEntity = void 0;
const common_1 = require("@nestjs/common");
class UnProcessableEntity extends common_1.HttpException {
    constructor(message) {
        super({
            statusCode: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
            message,
            error: "UnProcessable Entity",
            data: {},
        }, common_1.HttpStatus.UNPROCESSABLE_ENTITY);
    }
}
exports.UnProcessableEntity = UnProcessableEntity;
//# sourceMappingURL=unProcessableEntity.js.map