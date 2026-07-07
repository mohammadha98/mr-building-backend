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
const jmoment = require("jalali-moment");
const Transformer_1 = require("../force-update/admin/Transformer");
const Transformer_2 = require("../real-estate-agents/app/Transformer");
const Transformer_3 = require("../real-estate-agents-advisors/app/Transformer");
const Transformer_4 = require("../real-estate-agents-admins/app/Transformer");
jmoment().locale("fa").format("YYYY/M/D");
let HomePageTransformer = class HomePageTransformer {
    constructor(forceUpdateTransformer, realEstateAgentsTransformer, realEstateAdvisorTransformer, realEstateAdminsTransformer) {
        this.forceUpdateTransformer = forceUpdateTransformer;
        this.realEstateAgentsTransformer = realEstateAgentsTransformer;
        this.realEstateAdvisorTransformer = realEstateAdvisorTransformer;
        this.realEstateAdminsTransformer = realEstateAdminsTransformer;
    }
    transform(item) {
        console.log("has_update ", item.has_update);
        return {
            token: item.token,
            total_score: item.total_score,
            user_key: item.user_key,
            number_of_unread_messages: item.number_of_unread_messages,
            blocked_account_ids: item.blocked_account_ids,
            blocked_participant_ids: item.blocked_participant_ids,
            has_update: item.has_update,
            force_update: this.forceUpdateTransformer.transform(item.force_update),
            roles: item.roles,
            estate_agent_info: item.estate_agent_info
                ? this.realEstateAgentsTransformer.transform(item.estate_agent_info)
                : null,
            advisor_info: item.advisor_info
                ? this.realEstateAdvisorTransformer.transform(item.advisor_info)
                : null,
            operator: item.operator,
            slider: item.slider,
            slider_services: item.slider_services,
            banner_home: item.banner_home,
            banner_services: item.banner_services,
        };
    }
    collection(items) {
        return items.map((item) => this.transform(item));
    }
};
HomePageTransformer = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Transformer_1.default,
        Transformer_2.default,
        Transformer_3.default,
        Transformer_4.default])
], HomePageTransformer);
exports.default = HomePageTransformer;
//# sourceMappingURL=Transformer.js.map