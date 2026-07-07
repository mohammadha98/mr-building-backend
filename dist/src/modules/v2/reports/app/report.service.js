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
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../../prisma/prisma.service");
const client_service_1 = require("../../client/app/client.service");
let ReportsService = class ReportsService {
    constructor(prismaService, clientService) {
        this.prismaService = prismaService;
        this.clientService = clientService;
    }
    async storeBug(body) {
        try {
            const client = await this.prismaService.client.findUnique({
                where: { id: Number(body.client_id) },
            });
            if (!client) {
                return { status: 403 };
            }
            await this.prismaService.reportBugs.create({
                data: {
                    client: { connect: { id: Number(body.client_id) } },
                    content: body.content,
                    type: body.type,
                    source: body.source,
                    image: body.image,
                    voice: body.voice,
                },
            });
            const mission = await this.prismaService.missions.findFirst({
                where: { key: body.type },
            });
            if (mission) {
                await this.clientService.saveMission(mission, client);
            }
            return { status: 201 };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async storeViolation(body) {
        try {
            const client = await this.prismaService.client.findUnique({
                where: { id: Number(body.client_id) },
            });
            if (!client) {
                return { status: 403 };
            }
            await this.prismaService.reportViolations.create({
                data: {
                    client: { connect: { id: Number(body.client_id) } },
                    description: body.description,
                    item_id: body.item_id,
                    type: body.type,
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
ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        client_service_1.ClientService])
], ReportsService);
exports.ReportsService = ReportsService;
//# sourceMappingURL=report.service.js.map