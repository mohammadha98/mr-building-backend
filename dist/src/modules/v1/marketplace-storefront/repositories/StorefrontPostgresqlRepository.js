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
const RealEstateAdMediaTypePriorities_1 = require("../../../../commons/contracts/RealEstateAdMediaTypePriorities");
const RealEstateAdMediaType_1 = require("../../../../commons/contracts/RealEstateAdMediaType");
let StorefrontPostgresqlRepository = class StorefrontPostgresqlRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async bookmarkStorefront(storefrontId, client_id) {
        const isBookmark = await this.prisma.storefrontBookmark.findFirst({
            where: { client_id, storefrontId },
        });
        if (isBookmark) {
            await this.deleteBookmarked(isBookmark.id);
        }
        else {
            await this.prisma.storefrontBookmark.create({
                data: {
                    client: { connect: { id: client_id } },
                    storefront: { connect: { id: storefrontId } },
                },
            });
        }
    }
    async deleteBookmarked(bookmarkId) {
        await this.prisma.storefrontBookmark.delete({ where: { id: bookmarkId } });
    }
    async getBookmarkList(client_id) {
        return this.prisma.storefrontBookmark.findMany({
            where: { client_id },
            include: { storefront: true, client: true },
        });
    }
    async getStorefrontIsBookmarked(client_id, storefrontId) {
        return this.prisma.storefrontBookmark.findFirst({
            where: { client_id, storefrontId },
        });
    }
    async saveProduct(params) {
        try {
            return await this.prisma.storefrontProducts.create({
                data: {
                    category: { connect: { id: params.category_id } },
                    subCategory: { connect: { id: params.sub_category_id } },
                    brand: { connect: { id: params.brand_id } },
                    storefront: { connect: { id: params.storefront_id } },
                    trackingCode: params.tracking_code,
                    title: params.title,
                    description: params.description,
                    unitOfSales: params.unit_of_sales,
                    price: params.price,
                    hasDiscount: params.has_discount,
                    discountedPrice: params.discounted_price,
                    colors: params.colors,
                },
                select: {
                    id: true,
                    category: { select: { id: true, title: true } },
                    subCategory: { select: { id: true, title: true } },
                    brand: { select: { id: true, title: true } },
                    trackingCode: true,
                    title: true,
                    score: true,
                    description: true,
                    status: true,
                    price: true,
                    unitOfSales: true,
                    hasDiscount: true,
                    discountedPrice: true,
                    colors: true,
                    files: {
                        where: {
                            file_type: RealEstateAdMediaType_1.default.image,
                            priority: RealEstateAdMediaTypePriorities_1.default.primary,
                        },
                        select: {
                            id: true,
                            file_name: true,
                            file_type: true,
                            sort_number: true,
                            priority: true,
                        },
                    },
                },
            });
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }
    async updateProductById(where, updateData) {
        try {
            return await this.prisma.storefrontProducts.update({
                where,
                data: {
                    category: { connect: { id: updateData.category_id } },
                    subCategory: { connect: { id: updateData.sub_category_id } },
                    brand: { connect: { id: updateData.brand_id } },
                    title: updateData.title,
                    description: updateData.description,
                    unitOfSales: updateData.unit_of_sales,
                    price: updateData.price,
                    hasDiscount: updateData.has_discount,
                    discountedPrice: updateData.discounted_price,
                    colors: updateData.colors,
                    updatedAt: new Date(Date.now()),
                },
            });
        }
        catch (error) {
            console.log(error);
        }
    }
    async getMedia(ad_id) {
        return await this.prisma.realEstateAdvertisements.findMany({
            where: { ad_id },
        });
    }
    async findMedia(id) {
        return await this.prisma.marketplaceMediaFiles.findFirst({
            where: { id },
        });
    }
    async getFileInfo(file_id) {
        return this.prisma.marketplaceMediaFiles.findFirst({
            where: { id: Number(file_id) },
        });
    }
    async deleteTempFile(id) {
        return await this.prisma.marketplaceMediaFiles.delete({
            where: { id },
        });
    }
    async removeItems(productId) {
        return await this.prisma.marketplaceProductFeatureValues.deleteMany({
            where: { productId },
        });
    }
    async createItem(params) {
        try {
            return await this.prisma.marketplaceProductFeatureValues.create(params);
        }
        catch (error) {
            console.log("* Error in Save ProductItems: createItem *");
            console.log(error);
            return false;
        }
    }
    async updateMedia(where, data) {
        return await this.prisma.marketplaceMediaFiles.update({ where, data });
    }
    async changeStatus(where, data) {
        try {
            return await this.prisma.storefrontProducts.update({ where, data });
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }
    async changeStatusProduct(where, data) {
        try {
            return await this.prisma.storefrontProducts.update({ where, data });
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }
    async findNewItems(params, select, pagination) {
        return await this.prisma.storefront.findMany({
            where: params,
            select,
            skip: pagination.offset,
            take: pagination.per_page,
        });
    }
    async count(params) {
        return await this.prisma.storefront.count({ where: params });
    }
    async countProduct(params) {
        return await this.prisma.storefrontProducts.count({ where: params });
    }
    async findByStatus(status) {
        return await this.prisma.storefront.findMany({ where: { status } });
    }
    async create(params) {
        try {
            return await this.prisma.storefront.create({
                data: params,
            });
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }
    async findOne(params) {
        return await this.prisma.storefront.findFirst({ where: params });
    }
    async removeMedia(item_id) {
        return await this.prisma.marketplaceMediaFiles.delete({
            where: { id: item_id },
        });
    }
    async findOneByID(id) {
        return await this.prisma.storefront.findUnique({ where: { id } });
    }
    async findProductById(id) {
        return await this.prisma.storefrontProducts.findUnique({ where: { id } });
    }
    async findMany(params, relations, pagination) {
        return await this.prisma.storefront.findMany({
            where: params,
            skip: pagination.offset,
            take: pagination.per_page,
        });
    }
    async findManyProducts(params) {
        return await this.prisma.storefrontProducts.findMany({
            where: params.where,
            select: params.select,
            orderBy: params.orderBy,
            skip: params.offset,
            take: params.per_page,
        });
    }
    async updateOne(where, updateData) {
        try {
            return await this.prisma.storefront.update({
                where,
                data: updateData,
            });
        }
        catch (error) {
            console.log(error);
        }
    }
    async updateMany(where, updateData) {
        return await this.prisma.storefront.updateMany({
            where,
            data: updateData,
        });
    }
    async deleteOne(where) {
        return await this.prisma.storefront.delete({ where });
    }
    async deleteMany(where) {
        return await this.prisma.storefront.deleteMany({ where });
    }
    async deleteProduct(where) {
        await this.removeItems(where.id);
        await this.prisma.marketplaceMediaFiles.deleteMany({
            where: { productId: where.id },
        });
        return await this.prisma.storefrontProducts.delete({ where });
    }
    async createFile(body) {
        try {
            if (body.type === "temp") {
                return await this.prisma.marketplaceMediaFiles.create({
                    data: {
                        thumbnail: body.thumbnail,
                        file_type: body.file_type,
                        file_name: body.file,
                        priority: body.priority,
                    },
                    select: {
                        id: true,
                        file_name: true,
                        file_type: true,
                        thumbnail: true,
                        sort_number: true,
                        priority: true,
                    },
                });
            }
            if (body.priority === RealEstateAdMediaTypePriorities_1.default.primary) {
                await this.prisma.marketplaceMediaFiles.updateMany({
                    where: {
                        productId: body.product_id,
                        priority: RealEstateAdMediaTypePriorities_1.default.primary,
                    },
                    data: { priority: RealEstateAdMediaTypePriorities_1.default.normal },
                });
            }
            return await this.prisma.marketplaceMediaFiles.create({
                data: {
                    thumbnail: body.thumbnail,
                    type: "normal",
                    file_type: body.file_type,
                    file_name: body.file,
                    product: { connect: { id: body.product_id } },
                    priority: body.priority,
                },
                select: {
                    id: true,
                    file_name: true,
                    file_type: true,
                    thumbnail: true,
                    sort_number: true,
                    priority: true,
                },
            });
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }
};
StorefrontPostgresqlRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StorefrontPostgresqlRepository);
exports.default = StorefrontPostgresqlRepository;
//# sourceMappingURL=StorefrontPostgresqlRepository.js.map