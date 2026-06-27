"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
let ForceUpdateTransformer = class ForceUpdateTransformer {
    transform(item) {
        if (!item) {
            return {
                id: -1,
                installed_version_type: "",
                version: "",
                required: false,
                file_name: "",
                indirect_link: "",
                file_url: "",
                status: "",
                content: "",
                items: [],
                created_at: "",
            };
        }
        return {
            id: item.id,
            installed_version_type: item.installed_version_type,
            version: item.version,
            required: item.required,
            total_installs: item.total_installs,
            file_name: item.file_name,
            indirect_link: item.indirect_link,
            file_url: item.file_name
                ? process.env.APP_CONTENT_PATH + "/force_updates/" + item.file_name
                : null,
            status: item.status,
            content: item.content,
            items: item.items[0].split(","),
            created_at: item.created_at,
        };
    }
    collection(items) {
        return items.map((item) => this.transform(item));
    }
};
ForceUpdateTransformer = __decorate([
    (0, common_1.Injectable)()
], ForceUpdateTransformer);
exports.default = ForceUpdateTransformer;
//# sourceMappingURL=Transformer.js.map