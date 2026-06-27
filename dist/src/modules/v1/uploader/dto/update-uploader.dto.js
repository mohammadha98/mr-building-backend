"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUploaderDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_uploader_dto_1 = require("./create-uploader.dto");
class UpdateUploaderDto extends (0, swagger_1.PartialType)(create_uploader_dto_1.CreateUploaderDto) {
}
exports.UpdateUploaderDto = UpdateUploaderDto;
//# sourceMappingURL=update-uploader.dto.js.map