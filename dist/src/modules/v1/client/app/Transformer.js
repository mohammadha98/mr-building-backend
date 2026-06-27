"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
let ClientTransformer = class ClientTransformer {
    constructor() { }
    transform(client) {
        if (!client) {
            return {
                id: -1,
                provider_id: -1,
                name: "",
                surname: "",
                phone: "",
                user_name: "",
                email: "",
                has_update: false,
                avatar: "",
                token: "",
                user_key: "",
                referral_code: "",
                province: {},
                city: {},
            };
        }
        return {
            id: client.id,
            provider_id: client.webinar_provider_id ? client.webinar_provider_id : -1,
            name: client.name,
            surname: client.surname,
            phone: client.phone,
            user_name: client.username,
            email: client.email,
            has_update: client.has_update,
            avatar: client.avatar
                ? `${process.env.APP_CONTENT_PATH}/clients/avatars/${client.avatar}`
                : "",
            token: client === null || client === void 0 ? void 0 : client.token,
            user_key: client === null || client === void 0 ? void 0 : client.key,
            referral_code: client === null || client === void 0 ? void 0 : client.referralCode,
            province: client.province ? this.getProvinceInfo(client.province) : {},
            city: client.city ? this.getProvinceInfo(client.city) : {},
        };
    }
    clientProfileTransformer(result) {
        return {
            client_info: this.transform(result.client_info),
        };
    }
    gifTransformer(item) {
        return {
            id: item.id,
            file: `${process.env.APP_CONTENT_PATH}/clients/${item.key}/gif/${item.file}`,
        };
    }
    gifCollection(items) {
        return items.map((item) => this.gifTransformer(item));
    }
    getProvinceInfo(item) {
        return {
            id: item.id,
            name: item.name,
        };
    }
};
ClientTransformer = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ClientTransformer);
exports.default = ClientTransformer;
//# sourceMappingURL=Transformer.js.map