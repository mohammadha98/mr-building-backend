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
exports.BinstaService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../prisma/prisma.service");
const client_service_1 = require("../client/app/client.service");
let BinstaService = class BinstaService {
    constructor(prismaService, clientService) {
        this.prismaService = prismaService;
        this.clientService = clientService;
    }
    async validateUsername(body) {
        try {
            const validateClient = await this.clientService.validateWithID(body.client_id);
            if (!validateClient) {
                return { status: 403 };
            }
            const validateBinstaUsername = await this.prismaService.binstaAccounts.findFirst({
                where: { username: body.username },
            });
            if (!validateBinstaUsername) {
                return { status: 200 };
            }
            return { status: 409 };
        }
        catch (error) {
            return { status: 500 };
        }
    }
    create(createBinstaDto) {
        return "This action adds a new binsta";
    }
    findAll() {
        return `This action returns all binsta`;
    }
    findOne(id) {
        return `This action returns a #${id} binsta`;
    }
    update(id, updateBinstaDto) {
        return `This action updates a #${id} binsta`;
    }
    remove(id) {
        return `This action removes a #${id} binsta`;
    }
};
BinstaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        client_service_1.ClientService])
], BinstaService);
exports.BinstaService = BinstaService;
//# sourceMappingURL=binsta.service.js.map