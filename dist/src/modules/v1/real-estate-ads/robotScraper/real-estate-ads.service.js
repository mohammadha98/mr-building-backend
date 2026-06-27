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
exports.RealEstateAdsService_robotScraper = void 0;
const Statuses_1 = require("../../../../commons/contracts/Statuses");
const RealEstateAdMediaType_1 = require("../../../../commons/contracts/RealEstateAdMediaType");
const RealEstateAdMediaTypePriorities_1 = require("../../../../commons/contracts/RealEstateAdMediaTypePriorities");
const common_1 = require("@nestjs/common");
const UploadService_1 = require("../../../services/UploadService");
const prisma_service_1 = require("../../../../../prisma/prisma.service");
let RealEstateAdsService_robotScraper = class RealEstateAdsService_robotScraper {
    constructor(prismaService) {
        this.prismaService = prismaService;
        this.uploadService = new UploadService_1.default();
    }
    async storeAd(body) {
        try {
            body.tracking_code = await this.generateTrackingCode();
            const newItem = await this.prismaService.realEstateAds.create({
                data: {
                    category: { connect: { id: body.category } },
                    subCategory: { connect: { id: body.sub_category } },
                    province: { connect: { id: body.province } },
                    city: { connect: { id: body.city } },
                    tag: body.tag,
                    owner_name: body.owner_name,
                    owner_phone: body.owner_phone,
                    seller_type: body.seller_type,
                    tracking_code: body.tracking_code,
                    title: body.title,
                    description: body.description,
                    is_applicant: body.is_applicant,
                    year_built: body.year_built,
                    size: body.size,
                    sale_price: body.sale_price,
                    deposit_price: body.deposit_price,
                    rent_price: body.rent_price,
                    number_of_rooms: body.number_of_rooms,
                    max_capicity: body.max_capicity,
                    normal_days_price: body.normal_days_price,
                    weekend_price: body.weekend_price,
                    special_days_price: body.special_days_price,
                    cost_per_additional_person: body.cost_per_additional_person,
                    extra_people: body.extra_people,
                    lat_item: body.latitude,
                    long_item: body.longitude,
                    area: body.area,
                    status: Statuses_1.default.inactive,
                },
                select: {
                    id: true,
                    category: true,
                    subCategory: true,
                    title: true,
                    status: true,
                    province: true,
                    city: true,
                    area: true,
                    media: {
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
                            thumbnail: true,
                        },
                    },
                },
            });
            if (body.items.length) {
                body.items.map(async (item, index) => {
                    console.log({ item });
                    await this.prismaService.realEstateAdItems_sample_robotScraper.create({
                        data: {
                            RealEstateAds: { connect: { id: Number(newItem.id) } },
                            field_name: item.field_name,
                            value: item.value,
                        },
                    });
                });
            }
            const dest = "/real_estate_ads/scraper/";
            if (body.media.length) {
                body.media.map(async (item) => {
                    const downloadedFile = await this.uploadService.downloadFile(item.file_name, "GET", dest);
                    if (downloadedFile) {
                        await this.prismaService.realEstateAdvertisements.create({
                            data: {
                                advertisement: { connect: { id: newItem.id } },
                                file_name: downloadedFile.fileUrl,
                                thumbnail: downloadedFile.fileUrl,
                                file_type: item.file_type,
                                sort_number: item.sort_number,
                                priority: item.priority,
                            },
                        });
                    }
                });
            }
            return { status: 201, result: { id: newItem.id } };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async getCategories() {
        try {
            const result = await this.prismaService.realEstateAdMainCategory.findMany({
                where: {
                    status: Statuses_1.default.active,
                },
                select: {
                    id: true,
                    title: true,
                    status: true,
                    type: true,
                    RealEstateAdSubCategory: {
                        select: {
                            id: true,
                            title: true,
                        },
                    },
                },
                orderBy: { id: "asc" },
            });
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
    async downloadFile(body) {
        return await this.uploadService.downloadFile(body.url, "GET", body.dest);
    }
    async generateTrackingCode() {
        const uniqueCode = "SC_" + (Math.random() * (100000000 - 1000000) + 1000000).toFixed(0);
        const isCodeUnique = await this.prismaService.realEstateAds.findFirst({
            where: { tracking_code: uniqueCode },
        });
        if (isCodeUnique) {
            return this.generateTrackingCode();
        }
        return uniqueCode;
    }
};
RealEstateAdsService_robotScraper = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RealEstateAdsService_robotScraper);
exports.RealEstateAdsService_robotScraper = RealEstateAdsService_robotScraper;
//# sourceMappingURL=real-estate-ads.service.js.map