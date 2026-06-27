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
let RealEstateAgentsPostgresqlRepository = class RealEstateAgentsPostgresqlRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findNewItems(params, select, pagination) {
        return await this.prisma.realEstateAgents.findMany({
            where: params,
            select,
            skip: pagination.offset,
            take: pagination.per_page,
        });
    }
    async count(params) {
        return await this.prisma.realEstateAgents.count({ where: params });
    }
    async findByStatus(status) {
        return await this.prisma.realEstateAgents.findMany({ where: { status } });
    }
    async create(params) {
        try {
            return await this.prisma.realEstateAgents.create({
                data: params,
            });
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }
    async findOne(params) {
        return await this.prisma.realEstateAgents.findFirst({ where: params });
    }
    async findOneByID(id) {
        return await this.prisma.realEstateAgents.findUnique({ where: { id } });
    }
    async findMany(params, relations, pagination) {
        return await this.prisma.realEstateAgents.findMany({
            where: params,
            skip: pagination.offset,
            take: pagination.per_page,
        });
    }
    async updateOne(where, updateData) {
        try {
            return await this.prisma.realEstateAgents.update({
                where,
                data: updateData,
            });
        }
        catch (error) {
            console.log(error);
        }
    }
    async updateMany(where, updateData) {
        return await this.prisma.realEstateAgents.updateMany({
            where,
            data: updateData,
        });
    }
    async deleteOne(where) {
        return await this.prisma.realEstateAgents.delete({ where });
    }
    async deleteMany(where) {
        return await this.prisma.realEstateAgents.deleteMany({ where });
    }
};
RealEstateAgentsPostgresqlRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RealEstateAgentsPostgresqlRepository);
exports.default = RealEstateAgentsPostgresqlRepository;
//# sourceMappingURL=RealEstateAgentsPostgresqlRepository.js.map