"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
let ServicesModuleAdminTransformer = class ServicesModuleAdminTransformer {
    transformerMedia(service) {
        return {
            id: service.id,
            type: service.type,
            file_type: service.fileType,
            file: service.file
                ? `${process.env.APP_CONTENT_PATH}/services/${service.type}/${service.file}`
                : "",
        };
    }
    collectionMedia(services) {
        return services.map((item) => this.transformerMedia(item));
    }
    transformerService(item) {
        return {
            id: item.id,
            description: item.description,
        };
    }
};
ServicesModuleAdminTransformer = __decorate([
    (0, common_1.Injectable)()
], ServicesModuleAdminTransformer);
exports.default = ServicesModuleAdminTransformer;
//# sourceMappingURL=Transformer.js.map