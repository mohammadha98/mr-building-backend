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
exports.ValidateClientsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../prisma/prisma.service");
const UserTypes_1 = require("../../../commons/contracts/UserTypes");
const SmsService_1 = require("../../services/notifications/sms/SmsService");
const Templates_1 = require("../../../commons/contracts/Templates");
let ValidateClientsService = class ValidateClientsService {
    constructor(prismaService, smsService) {
        this.prismaService = prismaService;
        this.smsService = smsService;
    }
    async create(body) {
        try {
            const client = await this.prismaService.client.findFirst({
                where: { id: Number(body.client_id) },
            });
            if (!client) {
                return { status: 403 };
            }
            await this.prismaService.validateClient.deleteMany({
                where: {
                    type: body.type,
                    phone: body.phone,
                    owner_id: Number(body.client_id),
                },
            });
            await this.prismaService.validateClient.create({
                data: {
                    code: body.code,
                    type: body.type,
                    phone: body.phone,
                    owner_id: Number(body.client_id),
                },
            });
            await this.smsService.send({
                message: String(body.code),
                templateID: Number(Templates_1.default.validate_client_phone),
                recipient: body.phone,
                parameterKey: "code",
            });
            return { status: 200 };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async VerifyValidatePhone(body) {
        try {
            const client = await this.prismaService.client.findFirst({
                where: { id: Number(body.client_id) },
            });
            if (!client) {
                return { status: 403 };
            }
            const result = await this.prismaService.validateClient.findFirst({
                where: {
                    type: body.type,
                    phone: body.phone,
                    code: Number(body.code),
                },
            });
            if (!result) {
                return { status: 400 };
            }
            if (result.type === UserTypes_1.default.estate_agent) {
                await this.prismaService.realEstateAgents.updateMany({
                    where: { client_id: Number(result.owner_id) },
                    data: { phone: result.phone, validate_phone: true },
                });
            }
            else if (result.type === UserTypes_1.default.advisor) {
                await this.prismaService.realEstateAdvisors.updateMany({
                    where: { client_id: Number(result.owner_id) },
                    data: { phone: result.phone, validate_phone: true },
                });
            }
            await this.prismaService.validateClient.deleteMany({
                where: {
                    type: result.type,
                    phone: result.phone,
                    owner_id: Number(result.owner_id),
                },
            });
            return { status: 201 };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
};
ValidateClientsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        SmsService_1.default])
], ValidateClientsService);
exports.ValidateClientsService = ValidateClientsService;
//# sourceMappingURL=validate-clients.service.js.map