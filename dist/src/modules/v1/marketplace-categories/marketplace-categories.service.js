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
exports.MarketplaceCategoriesService = void 0;
const common_1 = require("@nestjs/common");
const Statuses_1 = require("../../../commons/contracts/Statuses");
const prisma_service_1 = require("../../../../prisma/prisma.service");
const UploadService_1 = require("../../services/UploadService");
const pagination_util_1 = require("../../../commons/utils/pagination.util");
const Transformer_1 = require("./Transformer");
let MarketplaceCategoriesService = class MarketplaceCategoriesService {
    constructor(prismaService, uploadService, categoriesTransformer) {
        this.prismaService = prismaService;
        this.uploadService = uploadService;
        this.categoriesTransformer = categoriesTransformer;
    }
    async saveCategory(body) {
        try {
            let result;
            if (body.item_id) {
                result = await this.prismaService.marketPlaceMainCategory.findFirst({
                    where: { id: body.item_id }
                });
                if (!body.thumbnail) {
                    body.thumbnail = result.thumbnail;
                }
                await this.prismaService.marketPlaceMainCategory.update({
                    where: { id: body.item_id },
                    data: {
                        title: body.title,
                        thumbnail: body.thumbnail,
                        userID: body.user_id
                    }
                });
            }
            else {
                result = await this.prismaService.marketPlaceMainCategory.create({
                    data: {
                        title: body.title,
                        thumbnail: body.thumbnail ? body.thumbnail : "",
                        userID: body.user_id
                    }
                });
            }
            console.log('body.items');
            console.log(body.items);
            if (body.items.length) {
                await body.items.map(async (item) => {
                    console.log({ item });
                    let data = {
                        title: item.title,
                        categoryId: result.id
                    };
                    if (item.form_id) {
                        data.formId = item.form_id;
                    }
                    await this.prismaService.marketPlaceSubCategory.create({
                        data
                    });
                });
            }
            return {
                status: 201
            };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async getCategories(body) {
        try {
            let where = {};
            if (body.status === Statuses_1.default.all) {
                where = {};
            }
            else {
                where = { status: body.status };
            }
            const count = await this.prismaService.marketPlaceMainCategory.count({
                where: Object.assign({}, where)
            });
            const total = this.getTotalPageNumber(Number(count), Number(body.per_page));
            const paginationValue = this.makePagination(Number(body.page), Number(body.per_page));
            const result = await this.prismaService.marketPlaceMainCategory.findMany({
                where: Object.assign({}, where),
                select: {
                    id: true,
                    title: true,
                    thumbnail: true,
                    items: {
                        select: {
                            id: true,
                            title: true,
                            form: { select: { items: true } }
                        }
                    }
                },
                orderBy: { id: "desc" },
                skip: paginationValue.offset,
                take: paginationValue.per_page
            });
            return {
                status: 200,
                result,
                metadata: this.makeMetadata(Number(body.page), Number(body.per_page), Number(total))
            };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async findActives(pagination, params) {
        const { page, per_page, skip } = (0, pagination_util_1.PaginationSolver)(pagination);
        const count = await this.prismaService.marketPlaceMainCategory.count({
            where: Object.assign({}, params)
        });
        const result = await this.prismaService.marketPlaceMainCategory.findMany({
            where: Object.assign({}, params),
            select: {
                id: true,
                title: true,
                thumbnail: true,
                items: {
                    select: {
                        id: true,
                        title: true
                    }
                }
            },
            orderBy: { number_of_sales: "desc" },
            skip,
            take: per_page
        });
        const transformer = this.categoriesTransformer.collection(result);
        return {
            categories: transformer,
            metadata: (0, pagination_util_1.PaginationGenerator)(page, per_page, count)
        };
    }
    async deleteMainCategory(item_id) {
        try {
            const result = await this.prismaService.marketPlaceMainCategory.findFirst({
                where: {
                    id: item_id
                }
            });
            if (!result) {
                return { status: 400 };
            }
            await this.prismaService.marketPlaceSubCategory.deleteMany({
                where: { categoryId: item_id }
            });
            await this.prismaService.marketPlaceMainCategory.delete({
                where: { id: item_id }
            });
            this.uploadService.removeFile(result.thumbnail, "marketplace/categories/");
            return {
                status: 200,
                result
            };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async deleteSubCategory(item_id) {
        try {
            const result = await this.prismaService.marketPlaceSubCategory.findFirst({
                where: {
                    id: item_id
                }
            });
            if (!result) {
                return { status: 400 };
            }
            await this.prismaService.marketPlaceSubCategory.delete({
                where: { id: item_id }
            });
            return {
                status: 200,
                result
            };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async updateSubCategory(body) {
        try {
            const result = await this.prismaService.marketPlaceSubCategory.findFirst({
                where: {
                    id: body.item_id
                }
            });
            if (!result) {
                return { status: 400 };
            }
            await this.prismaService.marketPlaceSubCategory.update({
                where: { id: body.item_id },
                data: { title: body.title, formId: body.form_id }
            });
            return {
                status: 200,
                result
            };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async getCategoriesForApp() {
        return await this.prismaService.marketPlaceMainCategory.findMany({
            where: { status: Statuses_1.default.active },
            select: {
                id: true,
                title: true,
                thumbnail: true,
                items: {
                    select: {
                        id: true,
                        title: true,
                        form: { select: { id: true, title: true, items: true } }
                    }
                }
            },
            orderBy: { id: "desc" }
        });
    }
    makeMetadata(page, per_page, total_page) {
        return {
            page,
            total_page,
            per_page: per_page,
            next: page < total_page,
            back: page > 1
        };
    }
    makePagination(page, per_page) {
        return {
            offset: (page - 1) * per_page,
            per_page
        };
    }
    getTotalPageNumber(total_number, per_page) {
        return Math.ceil(total_number / per_page);
    }
};
MarketplaceCategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        UploadService_1.default,
        Transformer_1.default])
], MarketplaceCategoriesService);
exports.MarketplaceCategoriesService = MarketplaceCategoriesService;
//# sourceMappingURL=marketplace-categories.service.js.map