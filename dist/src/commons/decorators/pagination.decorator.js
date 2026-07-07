"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pagination = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
function Pagination() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiQuery)({ name: "page", type: "integer" }), (0, swagger_1.ApiQuery)({ name: "per_page", type: "integer" }));
}
exports.Pagination = Pagination;
//# sourceMappingURL=pagination.decorator.js.map