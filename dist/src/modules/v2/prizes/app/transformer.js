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
let PrizesTransformer = class PrizesTransformer {
    constructor() { }
    transform(item) {
        return {
            id: item.id,
            title: item.title,
            description: item.description,
            point: item.point,
            coupon: item.coupon,
            url: item.url,
            thumbnail: item.thumbnail
                ? process.env.APP_CONTENT_PATH + "/prizes/" + item.thumbnail
                : "",
        };
    }
    collection(items) {
        return items.map((item) => this.transform(item));
    }
    missionTransform(item) {
        return {
            id: item.id,
            key: item.key,
            title: item.title,
            description: item.description,
            point: item.point,
            mission_done: item.mission_done,
            is_limited: item.is_limited,
            number_of_hours: item.number_of_hours,
            is_permitted: item.is_permitted,
            last_used_at: item.usedAt,
        };
    }
    missionCollection(items) {
        return items.map((item) => this.missionTransform(item));
    }
    historyOfScorTransform(item) {
        return {
            id: item.id,
            title: item.title,
            score: item.score,
            action: item.action,
        };
    }
    historyOfScorCollection(items) {
        return items.map((item) => this.historyOfScorTransform(item));
    }
};
PrizesTransformer = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PrizesTransformer);
exports.default = PrizesTransformer;
//# sourceMappingURL=transformer.js.map