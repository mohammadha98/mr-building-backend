"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactsModule = void 0;
const common_1 = require("@nestjs/common");
const contacts_service_1 = require("./contacts.service");
const contacts_controller_1 = require("./contacts.controller");
const nestjs_form_data_1 = require("nestjs-form-data");
const client_service_1 = require("../client/app/client.service");
const MrBuildingMailerService_1 = require("../../services/notifications/mailer/providers/MrBuildingMailerService");
const mailerService_1 = require("../../services/notifications/mailer/mailerService");
const Transformer_1 = require("./Transformer");
let ContactsModule = class ContactsModule {
};
ContactsModule = __decorate([
    (0, common_1.Module)({
        imports: [nestjs_form_data_1.NestjsFormDataModule],
        exports: [contacts_service_1.ContactsService],
        controllers: [contacts_controller_1.ContactsController],
        providers: [
            contacts_service_1.ContactsService,
            client_service_1.ClientService,
            mailerService_1.default,
            MrBuildingMailerService_1.default,
            Transformer_1.default,
        ],
    })
], ContactsModule);
exports.ContactsModule = ContactsModule;
//# sourceMappingURL=contacts.module.js.map