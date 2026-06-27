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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactsController = void 0;
const common_1 = require("@nestjs/common");
const contacts_service_1 = require("./contacts.service");
const CreateContactDto_1 = require("./dto/CreateContactDto");
const swagger_1 = require("@nestjs/swagger");
const httpResponsehandler_1 = require("../../services/httpResponseHandler/httpResponsehandler");
const Transformer_1 = require("./Transformer");
const TokenAuthGuardClient_1 = require("../jwt-auth/TokenAuthGuardClient");
let ContactsController = class ContactsController {
    constructor(clientContactsService) {
        this.clientContactsService = clientContactsService;
        this.responseHandler = new httpResponsehandler_1.HttpResponsehandler();
        this.contactTransformer = new Transformer_1.default();
    }
    async create(contactDto, req, res) {
        contactDto.client_id = req.client.id;
        const contacts = contactDto.contacts;
        console.log("*** Sync Contacts ***");
        console.log({ contactDto });
        console.log("contacts.length ", contactDto.contacts.length);
        const result = await this.clientContactsService.saveContacts(contactDto, contacts);
        res.status(result.statusCode);
        return res.json(result);
    }
    async findAll(req, res) {
        console.log("*** Get Contacts ***");
        console.log("clientId ", req.client.id);
        const result = await this.clientContactsService.getContacts(req.client.id);
        res.status(result.statusCode);
        return res.json(result);
    }
    async checkContact(contactDto, req, res) {
        contactDto.client_id = req.client.id;
        const contacts = contactDto.contacts;
        console.log("*** Check Contact ***");
        console.log({ contactDto });
        const result = await this.clientContactsService.saveContacts(contactDto, contacts);
        res.status(result.statusCode);
        return res.json(result);
    }
};
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "بررسی مخاطبین با موفقیت انجام شد.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "بررسی مخاطبین با موفقیت انجام شد.",
                },
                error: { type: "string" },
                data: {
                    type: "array",
                    items: {
                        properties: {
                            client_id: {
                                type: "integer",
                                example: "type: integer => 12 || -1",
                            },
                            user_id: {
                                type: "integer",
                                example: "type: integer => 32124 || -1",
                            },
                            display_name: { type: "string" },
                            phone: { type: "string" },
                            user_key: { type: "string" },
                            is_exist: { type: "boolean", example: "true || false" },
                        },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({
        summary: "بررسی مخاطبین",
    }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateContactDto_1.CreateContactDto, Object, Object]),
    __metadata("design:returntype", Promise)
], ContactsController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "لیست مخاطبین من در دسترس است.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "لیست مخاطبین من در دسترس است.",
                },
                error: { type: "string" },
                data: {
                    type: "array",
                    items: {
                        properties: {
                            client_id: {
                                type: "integer",
                                example: "type: integer => 12 || -1",
                            },
                            user_id: {
                                type: "integer",
                                example: "type: integer => 32124 || -1",
                            },
                            display_name: { type: "string" },
                            phone: { type: "string" },
                            user_key: { type: "string" },
                            is_exist: { type: "boolean", example: "true || false" },
                        },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "دریافت مخاطبین من " }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ContactsController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "بررسی مخاطبین با موفقیت انجام شد.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "بررسی مخاطبین با موفقیت انجام شد.",
                },
                error: { type: "string" },
                data: {
                    type: "array",
                    items: {
                        properties: {
                            client_id: {
                                type: "integer",
                                example: "type: integer => 12 || -1",
                            },
                            user_id: {
                                type: "integer",
                                example: "type: integer => 32124 || -1",
                            },
                            display_name: { type: "string" },
                            phone: { type: "string" },
                            user_key: { type: "string" },
                            is_exist: { type: "boolean", example: "true || false" },
                        },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({
        summary: "بررسی مخاطبین",
        description: "در لیست ارسالی فقط شماره وارد شده کاربر قرار بگیرد و نام یک امپتی استرینگ باشد.",
    }),
    (0, common_1.Post)("sync"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateContactDto_1.CreateContactDto, Object, Object]),
    __metadata("design:returntype", Promise)
], ContactsController.prototype, "checkContact", null);
ContactsController = __decorate([
    (0, common_1.UseGuards)(TokenAuthGuardClient_1.default),
    (0, swagger_1.ApiSecurity)("JWT-auth"),
    (0, swagger_1.ApiTags)("v1/app-client-contacts"),
    (0, common_1.Controller)("v1/app/contacts"),
    __metadata("design:paramtypes", [contacts_service_1.ContactsService])
], ContactsController);
exports.ContactsController = ContactsController;
//# sourceMappingURL=contacts.controller.js.map