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
let MissionsTransformer = class MissionsTransformer {
    constructor() { }
    transform(client) {
        return {
            id: client.id,
            title: client.title,
            description: client.description,
            key: client.key,
            point: client.point,
            status: client.status,
            created_at: client.created_at,
            is_limited: client.is_limited,
            number_of_hours: client.number_of_hours,
            number_of_used: client.number_of_used,
        };
    }
    collection(items) {
        return items.map((item) => this.transform(item));
    }
};
MissionsTransformer = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], MissionsTransformer);
exports.default = MissionsTransformer;
//# sourceMappingURL=transformer.js.map