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
exports.StorefrontService = void 0;
const common_1 = require("@nestjs/common");
const client_service_1 = require("../../client/admin/client.service");
const Statuses_1 = require("../../../../commons/contracts/Statuses");
const SmsService_1 = require("../../../services/notifications/sms/SmsService");
const Templates_1 = require("../../../../commons/contracts/Templates");
const StorefrontPostgresqlRepository_1 = require("../repositories/StorefrontPostgresqlRepository");
const RealEstateAgentsCommentsPostgresqlRepository_1 = require("../../real-estate-agents-comments/repositories/RealEstateAgentsCommentsPostgresqlRepository");
const prisma_service_1 = require("../../../../../prisma/prisma.service");
const list_storefront_dto_1 = require("../app/dto/list-storefront.dto");
const client_list_dto_1 = require("../../client/admin/dto/client-list.dto");
const get_product_dto_1 = require("../app/dto/get-product.dto");
const SortingTypes_1 = require("../../../../commons/contracts/SortingTypes");
const RealEstateAdMediaType_1 = require("../../../../commons/contracts/RealEstateAdMediaType");
const RealEstateAdMediaTypePriorities_1 = require("../../../../commons/contracts/RealEstateAdMediaTypePriorities");
let StorefrontService = class StorefrontService {
    constructor(prismaService, storefrontsPostgresRepository, commentsPostgresqlRepository, clientService) {
        this.prismaService = prismaService;
        this.storefrontsPostgresRepository = storefrontsPostgresRepository;
        this.commentsPostgresqlRepository = commentsPostgresqlRepository;
        this.clientService = clientService;
        this.smsService = new SmsService_1.default();
    }
    async listOfStorefronts(query) {
        try {
            let condition = {};
            if (query.status === Statuses_1.default.pending) {
                condition = {
                    status: Statuses_1.default.inactive,
                    OR: [
                        { license_status: Statuses_1.default.pending },
                        { license_status: Statuses_1.default.rejected },
                    ],
                };
            }
            else if (query.status === Statuses_1.default.active) {
                condition = {
                    status: Statuses_1.default.active,
                    license_status: Statuses_1.default.approved,
                };
            }
            else if (query.status === Statuses_1.default.inactive) {
                condition = {
                    status: Statuses_1.default.inactive,
                };
            }
            else if (query.status === Statuses_1.default.rejected) {
                condition = {
                    status: Statuses_1.default.inactive,
                    license_status: Statuses_1.default.rejected,
                };
            }
            else if (query.status === Statuses_1.default.approved) {
                condition = {
                    status: Statuses_1.default.active,
                    license_status: Statuses_1.default.approved,
                };
            }
            else {
                condition = {};
            }
            let orderBy = {};
            if (query.sort == list_storefront_dto_1.MarketplaceStorefrontSort.newest) {
                orderBy = {
                    created_at: "desc",
                };
            }
            else if (query.sort == list_storefront_dto_1.MarketplaceStorefrontSort.oldest) {
                orderBy = {
                    created_at: "asc",
                };
            }
            else if (query.sort == list_storefront_dto_1.MarketplaceStorefrontSort.best_selling) {
                orderBy = {
                    number_of_sales: "desc",
                };
            }
            else if (query.sort == list_storefront_dto_1.MarketplaceStorefrontSort.most_chosen) {
                orderBy = {
                    number_of_sales: "desc",
                };
            }
            if (query.type === client_list_dto_1.GetTypes.search) {
                condition = {
                    OR: [
                        {
                            name: {
                                contains: query.keyword,
                                mode: "insensitive",
                            },
                        },
                        {
                            phone: {
                                contains: query.keyword,
                                mode: "insensitive",
                            },
                        },
                        {
                            client: {
                                phone: {
                                    contains: query.keyword,
                                    mode: "insensitive",
                                },
                            },
                        },
                    ],
                };
            }
            const count = await this.storefrontsPostgresRepository.count(condition);
            const total = this.getTotalPageNumber(Number(count), Number(query.per_page));
            const paginationValue = this.makePagination(Number(query.page), Number(query.per_page));
            const list = await this.prismaService.storefront.findMany({
                where: Object.assign({}, condition),
                select: {
                    id: true,
                    name: true,
                    description: true,
                    avatar: true,
                    license: true,
                    license_status: true,
                    status: true,
                    score: true,
                    number_of_sales: true,
                    number_of_products: true,
                    client_id: true,
                    created_at: true,
                    province: { select: { id: true, name: true } },
                    city: { select: { id: true, name: true } },
                    client: {
                        select: { id: true, name: true, surname: true, phone: true },
                    },
                },
                orderBy,
                skip: paginationValue.offset,
                take: paginationValue.per_page,
            });
            return {
                status: 200,
                list,
                metadata: this.makeMetadata(Number(query.page), Number(query.per_page), Number(total)),
            };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async findStorefrontProducts(body) {
        try {
            const storefrontInfo = await this.prismaService.storefront.findFirst({
                where: { id: body.storefront_id },
            });
            if (!storefrontInfo) {
                return { status: 400 };
            }
            let condition = { storefrontId: body.storefront_id };
            if (body.status !== Statuses_1.default.all) {
                condition = Object.assign(Object.assign({}, condition), { status: body.status });
            }
            if (body.type === get_product_dto_1.GetProductTypes.search) {
                condition = Object.assign(Object.assign({}, condition), { title: {
                        contains: body.keyword,
                        mode: "insensitive",
                    } });
            }
            const count = await this.storefrontsPostgresRepository.countProduct(condition);
            const total = this.getTotalPageNumber(Number(count), Number(body.per_page));
            const paginationValue = this.makePagination(Number(body.page), Number(body.per_page));
            let orderBy = { createdAt: "desc" };
            if (body.sort === SortingTypes_1.default.newest) {
                orderBy = { createdAt: "desc" };
            }
            else if (body.sort === SortingTypes_1.default.oldest) {
                orderBy = { createdAt: "asc" };
            }
            else if (body.sort === SortingTypes_1.default.most_expensive) {
                orderBy = { price: "desc" };
            }
            else if (body.sort === SortingTypes_1.default.cheapest) {
                orderBy = { price: "asc" };
            }
            console.log({ condition });
            console.log({ orderBy });
            const list = await this.storefrontsPostgresRepository.findManyProducts({
                where: Object.assign({}, condition),
                select: {
                    id: true,
                    category: { select: { id: true, title: true } },
                    subCategory: { select: { id: true, title: true } },
                    brand: { select: { id: true, title: true } },
                    trackingCode: true,
                    title: true,
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
                orderBy,
                skip: paginationValue.offset,
                take: paginationValue.per_page,
            });
            return {
                list,
                metadata: this.makeMetadata(Number(body.page), Number(body.per_page), Number(total)),
            };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async changeStatus(query) {
        try {
            let status = Statuses_1.default.inactive;
            let license_status = Statuses_1.default.rejected;
            const storefrontInfo = await this.storefrontsPostgresRepository.findOne({
                id: query.item_id,
            });
            const owner = await this.clientService.findOneByID(storefrontInfo.client_id);
            if (query.status === Statuses_1.default.approved) {
                await this.storefrontsPostgresRepository.updateOne({ id: query.item_id }, { status: Statuses_1.default.active, license_status: Statuses_1.default.approved });
                status = Statuses_1.default.active;
                license_status = Statuses_1.default.approved;
                await this.smsService.send({
                    recipient: owner.phone,
                    templateID: Number(Templates_1.default.change_status_storefront),
                    parameterKey: "STOREFRONT_NAME",
                    message: storefrontInfo.name + " تایید شد ",
                });
            }
            else {
                await this.smsService.send({
                    recipient: owner.phone,
                    templateID: Number(Templates_1.default.change_status_storefront),
                    parameterKey: "STOREFRONT_NAME",
                    message: storefrontInfo.name + " رد شد ",
                });
                await this.storefrontsPostgresRepository.updateOne({ id: query.item_id }, { status: Statuses_1.default.inactive, license_status: Statuses_1.default.rejected });
            }
            return { status: 200, client_status: status, license_status };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async findOneByID(item_id) {
        return await this.prismaService.realEstateAgents.findFirst({
            where: { id: item_id },
            select: { id: true, name: true },
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
StorefrontService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        StorefrontPostgresqlRepository_1.default,
        RealEstateAgentsCommentsPostgresqlRepository_1.default,
        client_service_1.ClientService])
], StorefrontService);
exports.StorefrontService = StorefrontService;
//# sourceMappingURL=storefront.service.js.map