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
jmoment().locale("fa").format("YYYY/M/D");
let RealEstateAgentsCommentsTransformer = class RealEstateAgentsCommentsTransformer {
    transform(item) {
        if (!item) {
            return {
                id: -1,
                agent_id: -1,
                comment: "",
                score: -1,
                client: {},
                created_at: "",
            };
        }
        return {
            id: item.id,
            agent_id: item.agent_id,
            comment: item.comment,
            score: item.score,
            status: item.status,
            client: this.clientInfo(item.client),
            real_estate_agent: this.realEstateAgentInfo(item.real_estate_agent),
            created_at: this.calculCreatedAt(item.created_at),
        };
    }
    collection(items) {
        return items.map((item) => this.transform(item));
    }
    clientInfo(client) {
        return {
            id: client.id,
            name: client.name + " " + client.surname,
        };
    }
    realEstateAgentInfo(item) {
        return {
            id: item.id,
            name: item.name,
            avatar: item.avatar
                ? `${process.env.APP_CONTENT_PATH}/estate-agents/avatars/${item.avatar}`
                : null,
        };
    }
    calculCreatedAt(created_at) {
        const currentYear = Number(jmoment(new Date(Date.now())).locale("fa").format("YYYY"));
        const day = Number(jmoment(created_at).locale("fa").format("DD"));
        const month = jmoment(created_at).locale("fa").format("MMMM");
        const year = Number(jmoment(created_at).locale("fa").format("YYYY"));
        let info = "";
        if (Number(currentYear) === Number(year)) {
            info = month + " " + day.toString();
        }
        else {
            info = ` ${year} ${month} ${day} `;
        }
        return info;
    }
};
RealEstateAgentsCommentsTransformer = __decorate([
    (0, common_1.Injectable)()
], RealEstateAgentsCommentsTransformer);
exports.default = RealEstateAgentsCommentsTransformer;
//# sourceMappingURL=Transformer.js.map