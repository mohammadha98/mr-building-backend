"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
let ClientTransformer = class ClientTransformer {
    transform(client) {
        return {
            id: client.id,
            name: client.name,
            surname: client.surname,
            phone: client.phone,
            roles: client.roles,
            user_name: client.username,
            email: client.email,
            status: client.status,
            avatar: client.avatar
                ? `${process.env.APP_CONTENT_PATH}/clients/avatars/${client.avatar}`
                : null,
            createdAt: client.createdAt,
            installed_version: client.installed_version,
            created_at: client.created_at,
        };
    }
    collection(clients) {
        return clients.map((client) => this.transform(client));
    }
};
ClientTransformer = __decorate([
    (0, common_1.Injectable)()
], ClientTransformer);
exports.default = ClientTransformer;
//# sourceMappingURL=Transformer.js.map