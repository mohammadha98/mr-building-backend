"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const jmoment = require("jalali-moment");
const Statuses_1 = require("../../../../commons/contracts/Statuses");
jmoment().locale("fa").format("YYYY/M/D");
let RealEstateAdvisorTransformer = class RealEstateAdvisorTransformer {
    transform(item) {
        return {
            id: item.id,
            name: this.clientInfo(item.client).name,
            phone: item.phone,
            validate_phone: item.validate_phone,
            avatar: item.avatar
                ? `${process.env.APP_CONTENT_PATH}/estate-agents-advisors/avatars/${item.avatar}`
                : "",
            score: item.score,
            biography: item.biography,
            comment_visibility: item.comment_visibility,
            number_of_ads: item.number_of_ads || 0,
            total_customer: item.total_customers || 0,
            permissions: item.permissions,
            status: item.status,
            agent_info: this.getAgentInfo(item.real_estate_agent),
        };
    }
    collection(items) {
        return items.map((item) => this.transform(item));
    }
    transformActiveArea(item) {
        return {
            id: item.id,
            title: item.title,
        };
    }
    collectionActiveArea(items) {
        return items.map((item) => this.transformActiveArea(item));
    }
    collectionFilteredWord(items) {
        return items.map((item) => this.transformerFilteredWord(item));
    }
    transformerFilteredWord(item) {
        return {
            id: item.id,
            title: item.title,
        };
    }
    transformComments(item) {
        if (!item) {
            return {
                id: -1,
                agent_id: -1,
                comment: "",
                score: -1,
                status: Statuses_1.default.pending,
                client: {},
                created_at: { day: 0, month: "", year: 0 },
            };
        }
        return {
            id: item.id,
            agent_id: item.agent_id,
            comment: item.comment,
            score: item.score,
            status: item.status,
            client: this.clientInfo(item.client),
            created_at: this.calculCreatedAt(item.created_at),
        };
    }
    collectionComments(items) {
        return items.map((item) => this.transformComments(item));
    }
    clientInfo(client) {
        return {
            id: client.id,
            name: client.name + " " + client.surname,
            phone: client.phone,
        };
    }
    getAgentInfo(item) {
        return {
            id: item.id,
            name: item.name,
        };
    }
    calculCreatedAt(created_at) {
        const currentYear = Number(jmoment(new Date(Date.now())).locale("fa").format("YYYY"));
        const day = Number(jmoment(created_at).locale("fa").format("DD"));
        const month = jmoment(created_at).locale("fa").format("MMMM");
        const year = Number(jmoment(created_at).locale("fa").format("YYYY"));
        return {
            day,
            month,
            year,
        };
    }
};
RealEstateAdvisorTransformer = __decorate([
    (0, common_1.Injectable)()
], RealEstateAdvisorTransformer);
exports.default = RealEstateAdvisorTransformer;
//# sourceMappingURL=Transformer.js.map