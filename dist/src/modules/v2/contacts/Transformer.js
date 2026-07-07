"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
let ClientContactsTransformer = class ClientContactsTransformer {
    transform(contact) {
        return {
            client_id: contact.client_id,
            user_id: contact.user_id,
            display_name: contact.display_name,
            phone: contact.phone,
            user_key: contact.user_key,
            is_exist: contact.is_exist,
        };
    }
    collection(contacts) {
        return contacts.map((contact) => this.transform(contact));
    }
};
ClientContactsTransformer = __decorate([
    (0, common_1.Injectable)()
], ClientContactsTransformer);
exports.default = ClientContactsTransformer;
//# sourceMappingURL=Transformer.js.map