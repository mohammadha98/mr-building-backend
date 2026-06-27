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
exports.MarketplaceBrandsService = void 0;
const common_1 = require("@nestjs/common");
const Statuses_1 = require("../../../commons/contracts/Statuses");
const prisma_service_1 = require("../../../../prisma/prisma.service");
const UploadService_1 = require("../../services/UploadService");
const Transformer_1 = require("./Transformer");
const pagination_util_1 = require("../../../commons/utils/pagination.util");
let MarketplaceBrandsService = class MarketplaceBrandsService {
    constructor(prismaService, uploadService, bandsTransformer) {
        this.prismaService = prismaService;
        this.uploadService = uploadService;
        this.bandsTransformer = bandsTransformer;
    }
    async saveBrand(body) {
        try {
            if (body.item_id) {
                const result = await this.prismaService.marketPlaceBrands.findFirst({
                    where: { id: body.item_id },
                });
                if (!body.thumbnail) {
                    body.thumbnail = result.thumbnail;
                }
                await this.prismaService.marketPlaceBrands.update({
                    where: { id: body.item_id },
                    data: {
                        title: body.title,
                        secondTitle: body.second_title,
                        description: body.description,
                        thumbnail: body.thumbnail,
                        color: body.color,
                        userID: body.user_id,
                    },
                });
            }
            else {
                await this.prismaService.marketPlaceBrands.create({
                    data: {
                        title: body.title,
                        secondTitle: body.second_title,
                        description: body.description,
                        thumbnail: body.thumbnail,
                        color: body.color,
                        userID: body.user_id,
                    },
                });
            }
            return {
                status: 201,
            };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async getBrands(body) {
        try {
            let where = {};
            if (body.status === Statuses_1.default.all) {
                where = {};
            }
            else {
                where = { status: body.status };
            }
            const count = await this.prismaService.marketPlaceBrands.count({
                where: Object.assign({}, where),
            });
            const total = this.getTotalPageNumber(Number(count), Number(body.per_page));
            const paginationValue = this.makePagination(Number(body.page), Number(body.per_page));
            const result = await this.prismaService.marketPlaceBrands.findMany({
                where: Object.assign({}, where),
                select: {
                    id: true,
                    title: true,
                    secondTitle: true,
                    description: true,
                    thumbnail: true,
                    color: true,
                    score: true,
                    total_score: true,
                    status: true,
                },
                orderBy: { id: "desc" },
                skip: paginationValue.offset,
                take: paginationValue.per_page,
            });
            return {
                status: 200,
                result,
                metadata: this.makeMetadata(Number(body.page), Number(body.per_page), Number(total)),
            };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async findActives(pagination, params, orderBy) {
        const { page, per_page, skip } = (0, pagination_util_1.PaginationSolver)(pagination);
        const count = await this.prismaService.marketPlaceBrands.count({
            where: Object.assign({}, params),
        });
        const result = await this.prismaService.marketPlaceBrands.findMany({
            where: Object.assign({}, params),
            select: {
                id: true,
                title: true,
                secondTitle: true,
                description: true,
                thumbnail: true,
                status: true,
                color: true,
                score: true,
                total_score: true,
            },
            orderBy,
            skip,
            take: per_page,
        });
        const transformer = this.bandsTransformer.collection(result);
        return {
            brands: transformer,
            metadata: (0, pagination_util_1.PaginationGenerator)(page, per_page, count),
        };
    }
    async getDetails(brandId) {
        const result = await this.prismaService.marketPlaceBrands.findFirst({
            where: {
                id: brandId,
            },
            select: {
                id: true,
                title: true,
                secondTitle: true,
                description: true,
                thumbnail: true,
                color: true,
                score: true,
                total_score: true,
                status: true,
            },
        });
        if (!result) {
            throw new common_1.BadRequestException();
        }
        return this.bandsTransformer.transform(result);
    }
    async deleteBrand(item_id) {
        try {
            const result = await this.prismaService.marketPlaceBrands.findFirst({
                where: {
                    id: item_id,
                },
            });
            if (!result) {
                return { status: 400 };
            }
            await this.prismaService.marketPlaceBrands.delete({
                where: { id: item_id },
            });
            this.uploadService.removeFile(result.thumbnail, "marketplace/brands/");
            return {
                status: 200,
                result,
            };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async getBrandsForApp() {
        return await this.prismaService.marketPlaceBrands.findMany({
            select: {
                id: true,
                title: true,
                thumbnail: true,
                color: true,
                score: true,
                total_score: true,
            },
            orderBy: { id: "desc" },
        });
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
MarketplaceBrandsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        UploadService_1.default,
        Transformer_1.default])
], MarketplaceBrandsService);
exports.MarketplaceBrandsService = MarketplaceBrandsService;
//# sourceMappingURL=marketplace-brands.service.js.map