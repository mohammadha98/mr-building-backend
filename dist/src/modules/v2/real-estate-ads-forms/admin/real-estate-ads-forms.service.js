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
exports.RealEstateAdsFormsService = void 0;
const common_1 = require("@nestjs/common");
const RealEstateAdsFormsPostgresqlRepository_1 = require("../repositories/RealEstateAdsFormsPostgresqlRepository");
const prisma_service_1 = require("../../../../../prisma/prisma.service");
const fs_1 = require("fs");
const path_1 = require("path");
let RealEstateAdsFormsService = class RealEstateAdsFormsService {
    constructor(realEstateAdsFormsPostgresqlRepository, prismaService) {
        this.realEstateAdsFormsPostgresqlRepository = realEstateAdsFormsPostgresqlRepository;
        this.prismaService = prismaService;
    }
    async createNewForm(body) {
        try {
            const result = await this.prismaService.realEstateAdForm.create({
                data: {
                    title: body.title,
                    description: body.description,
                },
                select: { id: true, title: true, description: true },
            });
            return { status: 201, result };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async saveItem(body) {
        try {
            if (body.values) {
                const valuesList = body.values;
                const values = valuesList.split(",");
                body.values = values;
            }
            else {
                body.values = [];
            }
            const result = await this.realEstateAdsFormsPostgresqlRepository.saveItem(body);
            return { status: 201, result };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async findForms(query) {
        try {
            const count = await this.realEstateAdsFormsPostgresqlRepository.count({
                where: {},
            });
            const total = this.getTotalPageNumber(Number(count), Number(query.per_page));
            const paginationValue = this.makePagination(Number(query.page), Number(query.per_page));
            const result = await this.realEstateAdsFormsPostgresqlRepository.findMany({
                where: {},
                orderBy: { id: "asc" },
                skip: paginationValue.offset,
                take: paginationValue.per_page,
            });
            return {
                status: 200,
                result,
                metadata: this.makeMetadata(Number(query.page), Number(query.per_page), Number(total)),
            };
        }
        catch (error) {
            return { status: 500 };
        }
    }
    async findItems(query) {
        try {
            const result = await this.realEstateAdsFormsPostgresqlRepository.findManyItems({
                where: { form_id: query.form_id },
                orderBy: { sort_number: "asc" },
            });
            return { status: 200, result };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async findItemsForApp(query) {
        return await this.realEstateAdsFormsPostgresqlRepository.findMany({
            where: { type: query.form_id },
            orderBy: { sort_number: "asc" },
        });
    }
    async findOne(id) {
        return `This action returns a #${id} realEstateAdsSetting`;
    }
    async updateForm(body) {
        try {
            const item = (await this.realEstateAdsFormsPostgresqlRepository.findOne({
                id: body.form_id,
            }));
            if (!item) {
                return { status: 400 };
            }
            await this.realEstateAdsFormsPostgresqlRepository.updateOne({
                id: body.form_id,
            }, {
                title: body.title,
                description: body.description,
            });
            return {
                status: 200,
            };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async updateItem(body) {
        try {
            const item = (await this.realEstateAdsFormsPostgresqlRepository.findOneItem({
                id: body.item_id,
            }));
            if (!item) {
                return { status: 400 };
            }
            if (body.icon) {
                await this.removeFileFromStorage(item.icon, "./../../../../public/contents/real_estate_ad_forms/icons/");
            }
            else {
                body.icon = item.icon;
            }
            const valuesData = body.values;
            const values = body.values ? valuesData.split(",") : item.values;
            console.log(values);
            await this.realEstateAdsFormsPostgresqlRepository.updateOneItem({
                id: body.item_id,
            }, {
                field_name: body.field_name,
                field_type: body.field_type,
                values: values,
                icon: body.icon,
            });
            return {
                status: 200,
                result: {
                    id: body.item_id,
                    field_name: body.field_name,
                    field_type: body.field_type,
                    values: values,
                    icon: body.icon,
                    is_active: item.is_active,
                    required: item.required,
                    sort_number: item.sort_number,
                    status: item.status,
                    key: item.key,
                },
            };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async removeItem(item_id) {
        try {
            const item = await this.realEstateAdsFormsPostgresqlRepository.findOneItem({
                id: item_id,
            });
            console.log({ item });
            if (!item) {
                return { status: 400 };
            }
            await this.removeFileFromStorage(item.icon, "./../../../../public/contents/real_estate_ad_forms/icons/");
            await this.realEstateAdsFormsPostgresqlRepository.deleteOneItem({
                id: item_id,
                form_id: item.form_id,
            });
            return { status: 200 };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async removeForm(form_id) {
        try {
            const item = await this.realEstateAdsFormsPostgresqlRepository.findOne({
                id: form_id,
            });
            if (!item) {
                return { status: 400 };
            }
            await this.realEstateAdsFormsPostgresqlRepository.deleteManyItem({
                form_id,
            });
            await this.realEstateAdsFormsPostgresqlRepository.deleteOne({
                id: form_id,
            });
            return { status: 200 };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async updateDraggableItems(body) {
        try {
            body.items.map(async (item) => await this.realEstateAdsFormsPostgresqlRepository.updateOneItem({ id: item.id }, { sort_number: item.sort_number }));
            return { status: 200 };
        }
        catch (error) {
            return { status: 500 };
        }
    }
    async removeFileFromStorage(file_name, destination) {
        try {
            if ((0, fs_1.existsSync)((0, path_1.join)(__dirname, destination, file_name))) {
                (0, fs_1.unlinkSync)((0, path_1.join)(__dirname, destination, file_name));
                return true;
            }
            return false;
        }
        catch (error) {
            return false;
        }
    }
    makeMetadata(page, per_page, total_page) {
        return {
            page,
            total_page,
            per_page: per_page,
            next: page < total_page,
            back: page > 1,
        };
    }
    makePagination(page, per_page) {
        return {
            offset: (page - 1) * per_page,
            per_page,
        };
    }
    getTotalPageNumber(total_number, per_page) {
        return Math.ceil(total_number / per_page);
    }
};
RealEstateAdsFormsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [RealEstateAdsFormsPostgresqlRepository_1.default,
        prisma_service_1.PrismaService])
], RealEstateAdsFormsService);
exports.RealEstateAdsFormsService = RealEstateAdsFormsService;
//# sourceMappingURL=real-estate-ads-forms.service.js.map