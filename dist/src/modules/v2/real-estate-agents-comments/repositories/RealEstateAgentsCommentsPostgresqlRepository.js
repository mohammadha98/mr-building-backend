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
const prisma_service_1 = require("../../../../../prisma/prisma.service");
let RealEstateAgentsCommentsPostgresqlRepository = class RealEstateAgentsCommentsPostgresqlRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async count(params) {
        return await this.prisma.realEstateAgentComments.count(params);
    }
    async findByStatus(status) {
        return await this.prisma.realEstateAgentComments.findMany({
            where: { status },
        });
    }
    async create(params) {
        return await this.prisma.realEstateAgentComments.create(params);
    }
    async findOne(params) {
        return await this.prisma.realEstateAgentComments.findFirst(params);
    }
    async findOneByID(id) {
        return await this.prisma.realEstateAgentComments.findUnique({
            where: { id },
        });
    }
    async findMany(params, relations, pagination) {
        return await this.prisma.realEstateAgentComments.findMany(params);
    }
    async updateOne(where, updateData) {
        return await this.prisma.realEstateAgentComments.update({
            where,
            data: updateData,
        });
    }
    async updateMany(where, updateData) {
        return await this.prisma.realEstateAgentComments.updateMany({
            where,
            data: updateData,
        });
    }
    async deleteOne(where) {
        return await this.prisma.realEstateAgentComments.delete({ where });
    }
    async deleteMany(where) {
        return await this.prisma.realEstateAgentComments.deleteMany({ where });
    }
};
RealEstateAgentsCommentsPostgresqlRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RealEstateAgentsCommentsPostgresqlRepository);
exports.default = RealEstateAgentsCommentsPostgresqlRepository;
//# sourceMappingURL=RealEstateAgentsCommentsPostgresqlRepository.js.map