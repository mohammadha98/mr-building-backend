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
let MarketplaceProductFeatureFormsPostgresqlRepository = class MarketplaceProductFeatureFormsPostgresqlRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async saveItem(body) {
        return await this.prisma.marketplaceProductFeatures.create({
            data: {
                form: { connect: { id: body.form_id } },
                field_name: body.field_name,
                field_type: body.field_type,
                values: body.values,
            },
            select: {
                id: true,
                field_name: true,
                field_type: true,
                values: true,
                key: true,
            },
        });
    }
    async count(params) {
        return await this.prisma.marketplaceProductFeaturesForm.count(params);
    }
    async create(params) {
        return await this.prisma.marketplaceProductFeaturesForm.create(params);
    }
    async findOne(params) {
        return await this.prisma.marketplaceProductFeaturesForm.findFirst({
            where: params,
        });
    }
    async findOneByID(id) {
        return await this.prisma.marketplaceProductFeaturesForm.findUnique({
            where: { id },
        });
    }
    async findMany(params, relations, pagination) {
        return await this.prisma.marketplaceProductFeaturesForm.findMany(params);
    }
    async updateOne(where, updateData) {
        return await this.prisma.marketplaceProductFeaturesForm.update({
            where,
            data: updateData,
        });
    }
    async updateMany(where, updateData) {
        return await this.prisma.marketplaceProductFeaturesForm.updateMany({
            where,
            data: updateData,
        });
    }
    async deleteOne(where) {
        return await this.prisma.marketplaceProductFeaturesForm.delete({ where });
    }
    async deleteMany(where) {
        return await this.prisma.marketplaceProductFeaturesForm.deleteMany({
            where,
        });
    }
    async findOneItem(params) {
        return await this.prisma.marketplaceProductFeatures.findFirst({
            where: params,
        });
    }
    async findManyItems(params) {
        return await this.prisma.marketplaceProductFeatures.findMany(params);
    }
    async updateOneItem(where, updateData) {
        return await this.prisma.marketplaceProductFeatures.update({
            where,
            data: updateData,
        });
    }
    async deleteOneItem(where) {
        await this.prisma.marketplaceProductFeatureValues.deleteMany({
            where: { featureId: where.id },
        });
        await this.prisma.marketplaceProductFeatures.delete({
            where: { id: where.id },
        });
        return;
    }
    async deleteManyItem(where) {
        const items = await this.prisma.marketplaceProductFeatures.findMany({
            where: { formId: where.form_id },
        });
        await items.map(async (item) => {
            await this.prisma.marketplaceProductFeatureValues.deleteMany({
                where: { featureId: item.id },
            });
        });
        await this.prisma.marketPlaceSubCategory.deleteMany({
            where: { formId: where.form_id },
        });
        await this.prisma.marketplaceProductFeatures.deleteMany({
            where: { formId: where.form_id },
        });
        return;
    }
};
MarketplaceProductFeatureFormsPostgresqlRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MarketplaceProductFeatureFormsPostgresqlRepository);
exports.default = MarketplaceProductFeatureFormsPostgresqlRepository;
//# sourceMappingURL=MarketplaceProductFeatureFormsPostgresqlRepository.js.map