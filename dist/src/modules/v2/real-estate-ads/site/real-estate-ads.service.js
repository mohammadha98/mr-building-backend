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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealEstateAdsService = void 0;
const RealEstateAdsPostgresqlRepository_1 = require("../repositories/RealEstateAdsPostgresqlRepository");
const client_service_1 = require("../../client/app/client.service");
const RealEstateAdTypes_1 = require("../../../../commons/contracts/RealEstateAdTypes");
const Statuses_1 = require("../../../../commons/contracts/Statuses");
const RealEstateAdMediaType_1 = require("../../../../commons/contracts/RealEstateAdMediaType");
const RealEstateAdMediaTypePriorities_1 = require("../../../../commons/contracts/RealEstateAdMediaTypePriorities");
const SortingTypes_1 = require("../../../../commons/contracts/SortingTypes");
const RealEstateAdSellerTypes_1 = require("../../../../commons/contracts/RealEstateAdSellerTypes");
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
const Transformer_1 = require("./Transformer");
const UploadService_1 = require("../../../services/UploadService");
const prisma_service_1 = require("../../../../../prisma/prisma.service");
const mailerService_1 = require("../../../services/notifications/mailer/mailerService");
const get_details_real_estate_ads_dto_1 = require("../app/dto/get-details-real-estate-ads.dto");
const get_real_estate_ads_dto_1 = require("../app/dto/get-real-estate-ads.dto");
const core_1 = require("@nestjs/core");
const messages_1 = require("../../../../commons/enums/messages");
let RealEstateAdsService = class RealEstateAdsService {
    constructor(cacheManager, request, realEstateAdsPostgresqlRepository, clientService, realEstateAdsTransformer, prismaService, mailerService) {
        this.cacheManager = cacheManager;
        this.request = request;
        this.realEstateAdsPostgresqlRepository = realEstateAdsPostgresqlRepository;
        this.clientService = clientService;
        this.realEstateAdsTransformer = realEstateAdsTransformer;
        this.prismaService = prismaService;
        this.mailerService = mailerService;
        this.uploadService = new UploadService_1.default();
    }
    async findDetails(query) {
        console.log("*** findDetails : SITE ***");
        let where = {};
        let resourceKey = `ad_details__${query.tracking_code}`;
        if (query.tracking_code) {
            where = { tracking_code: query.tracking_code };
        }
        else {
            resourceKey = `ad_details__${query.item_id}`;
            where = { id: Number(query.item_id) };
        }
        console.log({ resourceKey });
        let single = await this.cacheManager.get(resourceKey);
        if (!single) {
            const transformer = await this.adDetail(where);
            await this.cacheManager.set(resourceKey, Object.assign({}, transformer));
            single = transformer;
        }
        return {
            statusCode: common_1.HttpStatus.OK,
            message: messages_1.PublicMessage.OkResponse,
            data: single,
        };
    }
    async adDetail(where) {
        const result = await this.realEstateAdsPostgresqlRepository.findOne({
            where,
            select: {
                id: true,
                category: { select: { id: true, title: true, type: true } },
                subCategory: { select: { id: true, title: true } },
                tracking_code: true,
                tag: true,
                owner_name: true,
                owner_phone: true,
                robotAdItems: true,
                display_contact: true,
                seller_type: true,
                is_applicant: true,
                client_id: true,
                agent_id: true,
                advisor_id: true,
                title: true,
                description: true,
                lat_item: true,
                long_item: true,
                agent_valuation_request: true,
                price_status: true,
                price_rating: true,
                status: true,
                is_timed: true,
                expired_at: true,
                created_at: true,
                province: { select: { id: true, name: true } },
                city: { select: { id: true, name: true } },
                area: true,
                sale_price: true,
                deposit_price: true,
                rent_price: true,
                number_of_rooms: true,
                max_capicity: true,
                size: true,
                year_built: true,
                normal_days_price: true,
                weekend_price: true,
                special_days_price: true,
                cost_per_additional_person: true,
                extra_people: true,
                RealEstateAdForms: {
                    select: {
                        id: true,
                        value: true,
                        form: {
                            select: {
                                id: true,
                                icon: true,
                                field_name: true,
                                field_type: true,
                                values: true,
                                sort_number: true,
                            },
                        },
                    },
                    orderBy: {
                        form: {
                            sort_number: "asc",
                        },
                    },
                },
                media: {
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
        if (result.status === Statuses_1.default.inactive || !result) {
            throw new common_1.BadRequestException();
        }
        let adOwnerInfo;
        if (result.tag === get_details_real_estate_ads_dto_1.AdsDetailTags.mrbuilding) {
            if (result.seller_type === RealEstateAdSellerTypes_1.default.individual) {
                adOwnerInfo = await this.prismaService.client.findFirst({
                    where: { id: result.client_id },
                });
                result.owner_info = {
                    phone: adOwnerInfo.phone,
                    name: adOwnerInfo.name + " " + adOwnerInfo.surname,
                    avatar: adOwnerInfo.avatar
                        ? `${process.env.APP_CONTENT_PATH}/clients/avatars/${adOwnerInfo.avatar}`
                        : "",
                };
                adOwnerInfo = null;
            }
            else if (result.seller_type === RealEstateAdSellerTypes_1.default.real_estate_agent) {
                const adminInfo = await this.prismaService.realEstateAgentAdmins.findFirst({
                    where: {
                        agent_id: result.agent_id,
                        permissions: { hasSome: "answer_calls" },
                    },
                    select: {
                        client: { select: { phone: true, name: true, avatar: true } },
                    },
                    orderBy: { id: "desc" },
                });
                const agentInfo = await this.prismaService.realEstateAgents.findUnique({
                    where: { id: result.agent_id },
                    select: {
                        name: true,
                        avatar: true,
                        client: { select: { phone: true } },
                    },
                });
                if (!adminInfo) {
                    adOwnerInfo = {
                        phone: agentInfo.client.phone,
                        name: agentInfo.name,
                        agentInfo: agentInfo.avatar,
                    };
                    result.owner_info = {
                        phone: adOwnerInfo.phone,
                        name: adOwnerInfo.name,
                        avatar: adOwnerInfo.avatar
                            ? `${process.env.APP_CONTENT_PATH}/estate-agents/avatars/${adOwnerInfo.avatar}`
                            : "",
                    };
                }
                else {
                    adOwnerInfo = {
                        phone: adminInfo.client.phone,
                        name: agentInfo.name,
                        avatar: agentInfo.avatar,
                    };
                    result.owner_info = {
                        phone: adOwnerInfo.phone,
                        name: adOwnerInfo.name,
                        avatar: adOwnerInfo.avatar
                            ? `${process.env.APP_CONTENT_PATH}/estate-agents/avatars/${adOwnerInfo.avatar}`
                            : "",
                    };
                }
            }
            else if (result.seller_type === RealEstateAdSellerTypes_1.default.advisor) {
                adOwnerInfo = await this.prismaService.realEstateAdvisors.findFirst({
                    where: { client_id: result.client_id },
                    select: {
                        phone: true,
                        avatar: true,
                        client: { select: { name: true, avatar: true, phone: true } },
                        real_estate_agent: {
                            select: { id: true, phone: true, name: true, avatar: true },
                        },
                    },
                });
                result.owner_info = {
                    phone: adOwnerInfo.client.phone,
                    name: adOwnerInfo.real_estate_agent.name,
                    avatar: adOwnerInfo.real_estate_agent.avatar
                        ? `${process.env.APP_CONTENT_PATH}/estate-agents/avatars/${adOwnerInfo.real_estate_agent.avatar}`
                        : "",
                };
            }
        }
        return this.realEstateAdsTransformer.transformDetails(result);
    }
    async findAds(query) {
        try {
            query.ip_address = this.request.ip_address;
            console.log("*** find Ads: APP ***");
            console.log({ query });
            const resourceKey = this.generateRedisKey(query);
            const { condition, Reasons } = this.generateConditionFoFindAds(query);
            let result = await this.cacheManager.get(resourceKey);
            let total = result ? result.length : 0;
            if (!result) {
                const count = await this.realEstateAdsPostgresqlRepository.count(condition);
                total = this.getTotalPageNumber(Number(count), Number(query.per_page));
                const paginationValue = this.makePagination(Number(query.page), Number(query.per_page));
                console.log({ condition });
                result = await this.realEstateAdsPostgresqlRepository.findMany(Object.assign(Object.assign({}, condition), { skip: paginationValue.offset, take: paginationValue.per_page, select: {
                        id: true,
                        Reasons,
                        category: { select: { id: true, title: true, type: true } },
                        subCategory: { select: { id: true, title: true } },
                        tracking_code: true,
                        owner_name: true,
                        owner_phone: true,
                        tag: true,
                        title: true,
                        is_applicant: true,
                        status: true,
                        province: { select: { id: true, name: true } },
                        city: { select: { id: true, name: true } },
                        agent_id: true,
                        advisor_id: true,
                        seller_type: true,
                        area: true,
                        sale_price: true,
                        deposit_price: true,
                        rent_price: true,
                        number_of_rooms: true,
                        max_capicity: true,
                        normal_days_price: true,
                        created_at: true,
                        media: {
                            where: {
                                file_type: RealEstateAdMediaType_1.default.image,
                                priority: RealEstateAdMediaTypePriorities_1.default.primary,
                            },
                            take: 1,
                            orderBy: { id: "desc" },
                            select: {
                                id: true,
                                file_name: true,
                                file_type: true,
                                sort_number: true,
                                priority: true,
                                ad_id: true,
                                thumbnail: true,
                            },
                        },
                    } }));
                result = await Promise.all(result.map(async (item) => {
                    return await this.getAdOwnerInfo(item);
                }));
                const transformer = this.realEstateAdsTransformer.collectionAdList(result);
                result = transformer;
                console.log("*** Save Ads List Into Cache ***");
                await this.cacheManager.set(resourceKey, result);
            }
            else {
                console.log("*** Get Ads List From Cache ***");
            }
            console.log({ resourceKey });
            return {
                status: 200,
                result,
                metadata: this.makeMetadata(Number(query.page), Number(query.per_page), Number(total)),
            };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    generateRedisKey(query) {
        let resourceKey = null;
        if (query.tag === "all") {
            resourceKey = `tag_${query.tag}_sort_${query.sort}_ip_address_${query.ip_address}_provinceId_${query.province_id}_city_id_${query.city_id}_page_${query.page}`;
        }
        else if (query.tag === "individual") {
            resourceKey = `tag_${query.tag}_province_id_${query.province_id}_city_id_${query.city_id}_ip_address_${query.ip_address}_page_${query.page}`;
        }
        else if (query.tag === RealEstateAdSellerTypes_1.default.real_estate_agent) {
            resourceKey = `tag_${query.tag}_sort_${query.sort}_ip_address_${query.ip_address}_page_${query.page}_category_id_${query.category_id}_sub_category_id_${query.sub_category_id}_provinceId_${query.province_id}_city_id_${query.city_id}`;
        }
        else if (query.tag === RealEstateAdSellerTypes_1.default.advisor) {
            resourceKey = `tag_${query.tag}_ip_address_${query.ip_address}_sort_${query.sort}_page_${query.page}_category_id_${query.category_id}_sub_category_id_${query.sub_category_id}_provinceId_${query.province_id}_city_id_${query.city_id}`;
        }
        else if (query.tag === "search") {
            resourceKey = `tag_${query.tag}_ip_address_${query.ip_address}_sort_${query.sort}_provinceId_${query.province_id}_city_id_${query.city_id}_page_${query.page}`;
        }
        return resourceKey;
    }
    generateConditionFoFindAds(query) {
        let condition = {
            where: {},
            orderBy: {},
        };
        let Reasons = false;
        if (query.tag === get_real_estate_ads_dto_1.SelectedAdStatus.individual) {
            condition.where = {
                seller_type: query.tag,
                province_id: +query.province_id,
            };
            if (query.city_id) {
                condition.where = Object.assign(Object.assign({}, condition.where), { city_id: +query.city_id });
            }
        }
        else if (query.tag === "all") {
            condition.where = {
                status: Statuses_1.default.approved,
                province_id: +query.province_id,
            };
            if (query.city_id) {
                condition.where.city_id = +query.city_id;
            }
        }
        else if (query.tag === "real_estate_agent") {
            Reasons = true;
            condition.where = {
                province_id: +query.province_id,
                OR: [
                    { seller_type: RealEstateAdSellerTypes_1.default.real_estate_agent },
                    { seller_type: RealEstateAdSellerTypes_1.default.advisor },
                ],
                status: Statuses_1.default.approved,
            };
        }
        else if (query.tag === "advisor") {
            condition.where = {
                seller_type: RealEstateAdSellerTypes_1.default.advisor,
                province_id: +query.province_id,
                status: Statuses_1.default.approved,
            };
        }
        else if (query.tag === get_real_estate_ads_dto_1.SelectedAdStatus.search) {
            condition.where = {
                status: Statuses_1.default.approved,
                province_id: query.province_id ? Number(query.province_id) : undefined,
                title: {
                    contains: query.keyword,
                    mode: "insensitive",
                },
            };
        }
        if (query.category_id) {
            condition.where = Object.assign(Object.assign({}, condition.where), { categoryId: query.category_id });
        }
        if (query.sub_category_id) {
            condition.where = Object.assign(Object.assign({}, condition.where), { subCategoryId: query.sub_category_id });
        }
        if (query.status !== Statuses_1.default.all) {
            condition.where.status = query.status;
        }
        else {
            condition.where.status = {
                not: Statuses_1.default.deleted,
            };
        }
        condition = this.makeSortAds(condition, query.sort, query.type, query.tag);
        return { condition, Reasons };
    }
    makeSortAds(condition, sort, type, tag) {
        if (tag === get_real_estate_ads_dto_1.SelectedAdStatus.me) {
            return condition;
        }
        if (sort === SortingTypes_1.default.newest) {
            condition.orderBy = { created_at: "desc" };
        }
        else if (sort === SortingTypes_1.default.oldest) {
            condition.orderBy = { created_at: "asc" };
        }
        else if (sort === SortingTypes_1.default.most_expensive) {
            if (type === RealEstateAdTypes_1.default.sale) {
                condition.orderBy = { sale_price: "desc" };
            }
            else if (type === RealEstateAdTypes_1.default.rent) {
                condition.orderBy = [{ deposit_price: "desc" }, { rent_price: "desc" }];
            }
            else if (type === RealEstateAdTypes_1.default.participation) {
                condition.orderBy = [
                    { normal_days_price: "desc" },
                    { weekend_price: "desc" },
                    { special_days_price: "desc" },
                ];
            }
        }
        else if (sort === SortingTypes_1.default.cheapest) {
            if (type === RealEstateAdTypes_1.default.sale) {
                condition.orderBy = { sale_price: "asc" };
            }
            else if (type === RealEstateAdTypes_1.default.rent) {
                condition.orderBy = [{ deposit_price: "asc" }, { rent_price: "asc" }];
            }
            else if (type === RealEstateAdTypes_1.default.participation) {
                condition.orderBy = [
                    { normal_days_price: "asc" },
                    { weekend_price: "asc" },
                    { special_days_price: "asc" },
                ];
            }
        }
        return condition;
    }
    async getAdOwnerInfo(ad) {
        const adInfo = ad;
        adInfo.owner_info = null;
        if (ad.seller_type === RealEstateAdSellerTypes_1.default.real_estate_agent) {
            const agentInfo = await this.prismaService.realEstateAgents.findFirst({
                where: { id: ad.agent_id },
                select: { name: true, avatar: true },
            });
            adInfo.owner_info = {
                name: agentInfo.name,
                avatar: agentInfo.avatar
                    ? `${process.env.APP_CONTENT_PATH}/estate-agents/avatars/${agentInfo.avatar}`
                    : "",
            };
        }
        else if (ad.seller_type === RealEstateAdSellerTypes_1.default.advisor) {
            const advisorInfo = await this.prismaService.realEstateAdvisors.findFirst({
                where: { id: ad.advisor_id },
                select: {
                    real_estate_agent: { select: { name: true, avatar: true } },
                },
            });
            adInfo.owner_info = {
                name: advisorInfo.real_estate_agent.name,
                avatar: advisorInfo.real_estate_agent.avatar
                    ? `${process.env.APP_CONTENT_PATH}/estate-agents/avatars/${advisorInfo.real_estate_agent.avatar}`
                    : "",
            };
        }
        return adInfo;
    }
    async filteredAds(body) {
        try {
            const { type, sale_price, deposit_price, normal_days_price, number_of_rooms, max_capicity, rent_price, size, year_built, items, has_video, } = body;
            let orderBy;
            let where;
            if (body.category_id) {
                where = {
                    categoryId: body.category_id,
                };
            }
            if (body.sub_category_id.length > 0) {
                where = Object.assign(Object.assign({}, where), { subCategoryId: body.sub_category_id });
            }
            where = Object.assign(Object.assign({}, where), { status: "approved", province_id: body.province_id, is_applicant: body.is_applicant, has_video, AND: [
                    {
                        size: {
                            gte: size.from || 0,
                            lte: size.to || 99999999,
                        },
                    },
                    {
                        year_built: {
                            gte: year_built.from || 1300,
                            lte: year_built.to || 1600,
                        },
                    },
                    ...(items && items.length > 0
                        ? [
                            {
                                RealEstateAdForms: {
                                    some: {
                                        OR: items.map((item) => ({
                                            form_id: item.id,
                                            value: String(item.value),
                                        })),
                                    },
                                },
                            },
                        ]
                        : []),
                ] });
            if (body.sort === SortingTypes_1.default.newest) {
                orderBy = { id: "desc" };
            }
            else if (body.sort === SortingTypes_1.default.oldest) {
                orderBy = { id: "asc" };
            }
            else if (body.sort === SortingTypes_1.default.cheapest) {
                orderBy = { sale_price: "asc" };
            }
            else if (body.sort === SortingTypes_1.default.most_expensive) {
                orderBy = { sale_price: "desc" };
            }
            if (body.tag === "general_ads") {
                where = Object.assign(Object.assign({}, where), { seller_type: RealEstateAdSellerTypes_1.default.individual });
            }
            else if (body.tag === "general_real_estate_agent") {
                where = Object.assign(Object.assign({}, where), { OR: [
                        { seller_type: RealEstateAdSellerTypes_1.default.real_estate_agent },
                        { seller_type: RealEstateAdSellerTypes_1.default.advisor },
                    ] });
            }
            if (type === RealEstateAdTypes_1.default.sale) {
                where = Object.assign(Object.assign({}, where), { AND: [
                        ...where.AND,
                        {
                            sale_price: {
                                gte: sale_price.from || 0,
                                lte: sale_price.to || 999999999999999,
                            },
                        },
                    ] });
            }
            else if (type === RealEstateAdTypes_1.default.rent) {
                where = Object.assign(Object.assign({}, where), { AND: [
                        ...where.AND,
                        {
                            deposit_price: {
                                gte: deposit_price.from || 0,
                                lte: deposit_price.to || 999999999999999,
                            },
                        },
                        {
                            rent_price: {
                                gte: rent_price.from || 0,
                                lte: rent_price.to || 999999999999999,
                            },
                        },
                    ] });
            }
            else if (type === RealEstateAdTypes_1.default.short_rent) {
                where = Object.assign(Object.assign({}, where), { AND: [
                        ...where.AND,
                        {
                            normal_days_price: {
                                gte: normal_days_price.from || 0,
                                lte: normal_days_price.to || 999999999999999,
                            },
                        },
                        {
                            number_of_rooms: {
                                gte: number_of_rooms.from || 0,
                                lte: number_of_rooms.to || 1000,
                            },
                        },
                        {
                            max_capicity: {
                                gte: max_capicity.from || 0,
                                lte: max_capicity.to || 1000,
                            },
                        },
                    ] });
            }
            console.log("where");
            console.log(where);
            where.AND.map((item) => {
                console.log(item);
            });
            const count = await this.realEstateAdsPostgresqlRepository.count({
                where,
            });
            const total = this.getTotalPageNumber(Number(count), Number(body.per_page));
            const paginationValue = this.makePagination(Number(body.page), Number(body.per_page));
            let result = await this.realEstateAdsPostgresqlRepository.findMany({
                where: Object.assign({}, where),
                skip: paginationValue.offset,
                take: paginationValue.per_page,
                select: {
                    id: true,
                    category: { select: { id: true, title: true, type: true } },
                    subCategory: { select: { id: true, title: true } },
                    tracking_code: true,
                    title: true,
                    is_applicant: true,
                    status: true,
                    size: true,
                    year_built: true,
                    province: { select: { id: true, name: true } },
                    city: { select: { id: true, name: true } },
                    agent_id: true,
                    advisor_id: true,
                    seller_type: true,
                    area: true,
                    sale_price: true,
                    deposit_price: true,
                    rent_price: true,
                    number_of_rooms: true,
                    max_capicity: true,
                    normal_days_price: true,
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
                        },
                    },
                },
                orderBy,
            });
            console.log("**********");
            console.log("result.length");
            console.log(result.length);
            console.log("**********");
            if (!result) {
                return { status: 400 };
            }
            result = await Promise.all(result.map(async (item) => {
                return await this.getAdOwnerInfo(item);
            }));
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
                            form: {
                                select: {
                                    items: {
                                        select: {
                                            id: true,
                                            field_name: true,
                                            is_active: true,
                                            required: true,
                                            field_type: true,
                                            values: true,
                                            icon: true,
                                        },
                                        orderBy: { sort_number: "asc" },
                                    },
                                },
                            },
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
RealEstateAdsService = __decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.REQUEST }),
    __param(0, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __param(1, (0, common_1.Inject)(core_1.REQUEST)),
    __metadata("design:paramtypes", [Object, Object, RealEstateAdsPostgresqlRepository_1.default,
        client_service_1.ClientService,
        Transformer_1.default,
        prisma_service_1.PrismaService,
        mailerService_1.default])
], RealEstateAdsService);
exports.RealEstateAdsService = RealEstateAdsService;
//# sourceMappingURL=real-estate-ads.service.js.map