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
let ReferralCodeTransformer = class ReferralCodeTransformer {
    constructor() { }
    transform({ total, point }) {
        return {
            total: {
                client: total.clients,
                estate_agent: total.estate_agent,
                advisor: total.advisor,
                admin: total.admin,
                operator_estate_agent: total.operator_estate_agent,
            },
            point: point,
        };
    }
    collection(items) {
        return items.map((item) => this.transform(item));
    }
    userTransform(item, point) {
        return {
            client_id: item.client_id,
            client_name: item.client_name,
            client_phone: item.client_phone,
            client_roles: item.client_roles,
            referral_id: item.referral_id,
            referral_code: item.referral_code,
            number_of_sub_categories: item.number_of_sub_categories,
            point: point,
        };
    }
    userCollection(items, point) {
        return items.map((item) => this.userTransform(item, point));
    }
};
ReferralCodeTransformer = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ReferralCodeTransformer);
exports.default = ReferralCodeTransformer;
//# sourceMappingURL=transformer.js.map