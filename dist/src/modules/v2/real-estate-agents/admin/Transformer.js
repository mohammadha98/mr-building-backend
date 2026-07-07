"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
let RealEstateAgentsTransformer = class RealEstateAgentsTransformer {
    transform(item) {
        return {
            id: item.id,
            client_id: item.client_id,
            name: item.name,
            avatar: item.avatar
                ? `${process.env.APP_CONTENT_PATH}/estate-agents/avatars/${item.avatar}`
                : "",
            license: item.license
                ? `${process.env.APP_CONTENT_PATH}/estate-agents/licenses/${item.license}`
                : "",
            license_status: item.license_status,
            permissions: item.permissions,
            status: item.status,
            score: item.score,
            number_of_ads: item.published_count,
            province: item.province,
            city: item.city,
            client: this.clientInfo(item.client),
            created_at: item.created_at,
        };
    }
    collection(items) {
        return items.map((item) => this.transform(item));
    }
    clientInfo(item) {
        return {
            id: item.id,
            name: item.name + " " + item.surname,
            phone: item.phone,
        };
    }
};
RealEstateAgentsTransformer = __decorate([
    (0, common_1.Injectable)()
], RealEstateAgentsTransformer);
exports.default = RealEstateAgentsTransformer;
//# sourceMappingURL=Transformer.js.map