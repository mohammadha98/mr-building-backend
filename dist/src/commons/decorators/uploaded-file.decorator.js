"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomUploadedFileDecorator = void 0;
const common_1 = require("@nestjs/common");
function CustomUploadedFileDecorator(required = false) {
    return (0, common_1.UploadedFile)(new common_1.ParseFilePipe({
        fileIsRequired: required,
    }));
}
exports.CustomUploadedFileDecorator = CustomUploadedFileDecorator;
//# sourceMappingURL=uploaded-file.decorator.js.map