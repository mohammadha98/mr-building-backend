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
exports.RealEstateAdsServiceApp = void 0;
const RealEstateAdsPostgresqlRepository_1 = require("../repositories/RealEstateAdsPostgresqlRepository");
const client_service_1 = require("../../client/app/client.service");
const RealEstateAdTypes_1 = require("../../../../commons/contracts/RealEstateAdTypes");
const get_details_real_estate_ads_dto_1 = require("./dto/get-details-real-estate-ads.dto");
const fs_1 = require("fs");
const Statuses_1 = require("../../../../commons/contracts/Statuses");
const Statuses_2 = require("../../../../commons/contracts/Statuses");
const RealEstateAdMediaType_1 = require("../../../../commons/contracts/RealEstateAdMediaType");
const RealEstateAdMediaTypePriorities_1 = require("../../../../commons/contracts/RealEstateAdMediaTypePriorities");
const SortingTypes_1 = require("../../../../commons/contracts/SortingTypes");
const get_real_estate_ads_dto_1 = require("./dto/get-real-estate-ads.dto");
const RealEstateAdSellerTypes_1 = require("../../../../commons/contracts/RealEstateAdSellerTypes");
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
const Transformer_1 = require("./Transformer");
const delete_media_item_dto_1 = require("./dto/delete-media-item.dto");
const UploadService_1 = require("../../../services/UploadService");
const prisma_service_1 = require("../../../../../prisma/prisma.service");
const ClientRoles_1 = require("../../../../commons/contracts/ClientRoles");
const MissionTypes_1 = require("../../../../commons/contracts/MissionTypes");
const MissionTypes_2 = require("../../../../commons/contracts/MissionTypes");
const mailerService_1 = require("../../../services/notifications/mailer/mailerService");
const real_estate_ads_service_1 = require("../robotScraper/real-estate-ads.service");
const path_1 = require("path");
const process = require("process");
const UploaderFileTypes_1 = require("../../../../commons/contracts/UploaderFileTypes");
const ffmpeg = require("fluent-ffmpeg");
const SharpPipe_1 = require("../../../../commons/pipes/SharpPipe");
const core_1 = require("@nestjs/core");
const messages_1 = require("../../../../commons/enums/messages");
const FcmNotificationService_1 = require("../../../services/notifications/fcm/FcmNotificationService");
const SmsService_1 = require("../../../services/notifications/sms/SmsService");
const ReasonAdTypes_1 = require("../admin/enums/ReasonAdTypes");
let RealEstateAdsServiceApp = class RealEstateAdsServiceApp {
    constructor(request, cacheManager, realEstateAdsPostgresqlRepository, clientService, realEstateAdsTransformer, prismaService, mailerService, robotScraper, notificationService, smsService) {
        this.request = request;
        this.cacheManager = cacheManager;
        this.realEstateAdsPostgresqlRepository = realEstateAdsPostgresqlRepository;
        this.clientService = clientService;
        this.realEstateAdsTransformer = realEstateAdsTransformer;
        this.prismaService = prismaService;
        this.mailerService = mailerService;
        this.robotScraper = robotScraper;
        this.notificationService = notificationService;
        this.smsService = smsService;
        this.uploadService = new UploadService_1.default();
    }
    async storeAd(body) {
        try {
            const client = await this.clientService.validateWithID(Number(body.client_id));
            if (!client) {
                return { status: 403 };
            }
            let expired_at;
            if (body.expired_at) {
                expired_at = new Date(body.expired_at);
                expired_at.setHours(0, 0, 0, 0);
            }
            else {
                expired_at = null;
            }
            body.expired_at = expired_at;
            if (!body.is_timed) {
                body.is_timed = false;
            }
            body.status = Statuses_2.default.approved;
            if (body.seller_type === RealEstateAdSellerTypes_1.default.individual) {
                body.agent_id = 0;
                body.advisor_id = 0;
                body.status = Statuses_2.default.pending;
            }
            body.tracking_code = await this.generateTrackingCode();
            const newItem = await this.realEstateAdsPostgresqlRepository.create(body);
            if (body.items.length) {
                body.items.map(async (item) => {
                    await this.realEstateAdsPostgresqlRepository.createItem({
                        data: {
                            advertisement: { connect: { id: Number(newItem.id) } },
                            form: { connect: { id: item.id } },
                            value: item.value,
                        },
                    });
                });
            }
            if (body.media.length) {
                body.media.map(async (item) => {
                    console.log(item);
                    const fileInfo = await this.realEstateAdsPostgresqlRepository.getFileInfo({
                        type: "temp",
                        item_id: Number(item.id),
                        client_id: body.client_id,
                    });
                    await this.realEstateAdsPostgresqlRepository.createMedia({
                        data: {
                            advertisement: { connect: { id: newItem.id } },
                            file_name: item.file_name,
                            file_type: item.file_type,
                            sort_number: item.sort_number,
                            priority: item.priority,
                            thumbnail: fileInfo.thumbnail,
                        },
                    });
                    await this.uploadService.moveFile(fileInfo.file_name, "temp/files/", "real_estate_ads/");
                    await this.realEstateAdsPostgresqlRepository.deleteTempFile(Number(item.id));
                });
            }
            await this.senEmailForAdmins();
            if (body.seller_type === RealEstateAdSellerTypes_1.default.real_estate_agent ||
                body.seller_type === RealEstateAdSellerTypes_1.default.advisor) {
                await this.updatePublishedAdTime(body.agent_id);
            }
            return { status: 201, result: { id: newItem.id } };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async updateExpiredAd(body) {
        const adInfo = await this.prismaService.realEstateAds.findFirst({
            where: { id: body.adId },
        });
        if (!adInfo) {
            throw new common_1.BadRequestException();
        }
        let expired_at = new Date(body.expired_at);
        let data = {
            expired_at,
            is_timed: true,
        };
        if (adInfo.seller_type === RealEstateAdSellerTypes_1.default.individual) {
            data.status = Statuses_2.default.pending;
        }
        else {
            data.status = Statuses_2.default.approved;
        }
        await this.prismaService.realEstateAds.update({
            where: { id: body.adId },
            data,
        });
        return { status: 201, message: messages_1.PublicMessage.OkResponse };
    }
    async updatePublishedAdTime(agent_id) {
        await this.prismaService.realEstateAgents.update({
            where: { id: agent_id },
            data: {
                published_ad_time: new Date(Date.now()),
            },
        });
    }
    async getClientsForFilteredAdSetting(body, adInfo) {
        const currentDate = new Date();
        currentDate.setUTCHours(0, 0, 0, 0);
        const items = body.items;
        let filters = [];
        let where = {
            provinceId: adInfo.province_id,
            cityId: adInfo.city_id,
            categoryId: adInfo.categoryId,
            subCategoryId: adInfo.subCategoryId,
        };
        let dateFilters = [
            { expired_at: null },
            { expired_at: { gte: currentDate } },
            ...(items && items.length > 0
                ? [
                    {
                        items: {
                            some: {
                                OR: items.map((item) => ({
                                    title: item.field_nam,
                                    value: String(item.value),
                                })),
                            },
                        },
                    },
                ]
                : []),
        ];
        if (body.year_built > 0) {
            filters.push({
                year_built_from: {
                    lte: +body.year_built,
                    not: 0,
                },
                year_built_to: {
                    gte: +body.year_built,
                },
            });
        }
        if (body.size > 0) {
            filters.push({
                size_from: {
                    lte: +body.size,
                    not: 0,
                },
                size_to: {
                    gte: +body.size,
                },
            });
        }
        if (body.sale_price > 0) {
            filters.push({
                sale_price_from: {
                    lte: body.sale_price,
                    not: 0,
                },
                sale_price_to: {
                    gte: body.sale_price,
                },
            });
        }
        if (body.rent_price > 0) {
            filters.push({
                rent_price_from: {
                    lte: body.rent_price,
                    not: 0,
                },
                rent_price_to: {
                    gte: body.rent_price,
                },
            });
        }
        if (body.deposit_price > 0) {
            filters.push({
                deposit_price_from: {
                    lte: body.deposit_price,
                    not: 0,
                },
                deposit_price_to: {
                    gte: body.deposit_price,
                },
            });
        }
        if (body.normal_days_price > 0) {
            filters.push({
                normal_days_price_from: {
                    lte: body.normal_days_price,
                    not: 0,
                },
                normal_days_price_to: {
                    gte: body.normal_days_price,
                },
            });
        }
        if (body.number_of_rooms > 0) {
            filters.push({
                number_of_rooms_from: {
                    lte: body.number_of_rooms,
                    not: 0,
                },
                number_of_rooms_to: {
                    gte: body.number_of_rooms,
                },
            });
        }
        if (body.max_capicity > 0) {
            filters.push({
                max_capicity_from: {
                    lte: body.max_capicity,
                    not: 0,
                },
                max_capicity_to: {
                    gte: body.max_capicity,
                },
            });
        }
        if (filters.length > 0) {
            where.AND = filters;
        }
        where.OR = dateFilters;
        const result = await this.prismaService.filteredNotification_Ads.findMany({
            where,
            select: {
                title: true,
                whatsappNotification: true,
                smsNotification: true,
                client: {
                    select: {
                        phone: true,
                        notification_tokens: {
                            select: {
                                notification_token: true,
                            },
                        },
                    },
                },
            },
        });
        let tokens = [];
        let phones = [];
        result.map(async (item) => {
            const phone = item.client.phone;
            if (item.smsNotification) {
                if (!phones.includes(phone)) {
                    phones.push({ title: item.title, phone });
                }
            }
            if (item.whatsappNotification) {
            }
            item.client.notification_tokens.map((token) => {
                if (!tokens.includes(token.notification_token)) {
                    tokens.push({
                        token: token.notification_token,
                        adTitle: adInfo.title,
                        filterTitle: item.title,
                    });
                }
            });
        });
        tokens.map((item) => {
            const title = ` آگهی ${item.adTitle} مطابق با فیلتر ${item.filterTitle} ثبت شد. `;
            this.notificationService.send({
                title,
                notification_token: item.token,
                key: "ad_notification",
                body: JSON.stringify({
                    source: "ad_notification",
                    message: title,
                    tracking_code: adInfo.tracking_code,
                }),
            });
        });
    }
    async saveFilteredNotificationForAds(body) {
        const { id: client_id } = this.request.client;
        let filterId;
        const items = body.items;
        delete body.items;
        let expired_at;
        if (body.expired_at) {
            expired_at = new Date(body.expired_at);
            expired_at.setHours(0, 0, 0, 0);
        }
        else {
            expired_at = null;
        }
        body.expired_at = expired_at;
        if (body.item_id) {
            delete body.item_id;
            await this.prismaService.filteredNotification_Ads.updateMany({
                where: {
                    id: body.item_id,
                    client_id,
                },
                data: Object.assign({}, body),
            });
            filterId = body.item_id;
            await this.prismaService.filteredNotification_Ads_Values.deleteMany({
                where: {
                    filter_id: filterId,
                },
            });
        }
        else {
            delete body.item_id;
            const result = await this.prismaService.filteredNotification_Ads.create({
                data: Object.assign({ client: { connect: { id: client_id } } }, body),
            });
            filterId = result.id;
        }
        items.map(async (item) => {
            await this.prismaService.filteredNotification_Ads_Values.create({
                data: {
                    title: item.title,
                    value: item.value,
                    filter: { connect: { id: filterId } },
                    form: { connect: { id: item.id } },
                },
            });
        });
        return {
            statusCode: common_1.HttpStatus.CREATED,
            message: messages_1.PublicMessage.Created,
            data: {
                id: filterId,
            },
        };
    }
    async getFilteredNotificationForAds() {
        const { id: client_id } = this.request.client;
        const currentDate = new Date();
        currentDate.setUTCHours(0, 0, 0, 0);
        console.log({ currentDate });
        const settings = await this.prismaService.filteredNotification_Ads.findMany({
            where: { client_id },
            include: { items: true },
        });
        const transform = this.realEstateAdsTransformer.collectionNotificationSettings(settings);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: messages_1.PublicMessage.OkResponse,
            data: transform,
        };
    }
    async deleteFilteredNotificationForAds(item_id) {
        const { id: client_id } = this.request.client;
        await this.prismaService.filteredNotification_Ads_Values.deleteMany({
            where: { filter_id: item_id, filter: { client_id } },
        });
        await this.prismaService.filteredNotification_Ads.deleteMany({
            where: { id: item_id, client_id },
        });
        return {
            statusCode: common_1.HttpStatus.OK,
            message: messages_1.PublicMessage.Deleted,
        };
    }
    async GetWarningSingBeforeTransaction() {
        let warnings = (await this.prismaService.warningSignsBeforTransaction.findFirst({
            select: {
                id: true,
                content: true,
            },
        }));
        if (!warnings) {
            warnings = "";
        }
        return warnings;
    }
    async update(body) {
        try {
            const client = await this.clientService.validateWithID(Number(body.client_id));
            if (!client) {
                return { status: 403 };
            }
            const details = await this.realEstateAdsPostgresqlRepository.findOneByID(Number(body.id));
            if (!details) {
                return { status: 400 };
            }
            if (body.seller_type === RealEstateAdSellerTypes_1.default.individual) {
                body.agent_id = 0;
                body.advisor_id = 0;
            }
            await this.realEstateAdsPostgresqlRepository.removeItems(Number(body.id));
            if (body.items.length) {
                body.items.map(async (item) => {
                    await this.realEstateAdsPostgresqlRepository.createItem({
                        data: {
                            advertisement: { connect: { id: Number(details.id) } },
                            form: { connect: { id: item.id } },
                            value: item.value,
                        },
                    });
                });
            }
            let expired_at;
            if (body.expired_at) {
                expired_at = new Date(body.expired_at);
                expired_at.setHours(0, 0, 0, 0);
            }
            else {
                expired_at = null;
            }
            body.expired_at = expired_at;
            const updatedItem = await this.realEstateAdsPostgresqlRepository.updateOne({ id: Number(body.id) }, body);
            const resourceKey = `singleTransform_AdId_${body.id}`;
            const transformer = this.realEstateAdsTransformer.transformDetails(updatedItem);
            const related = await this.realEstateAdsPostgresqlRepository.findMany({
                where: {
                    status: Statuses_1.default.approved,
                    province_id: Number(updatedItem.province.id),
                    city_id: Number(updatedItem.city.id),
                    NOT: {
                        id: Number(body.id),
                    },
                },
                skip: 0,
                take: 12,
                select: {
                    id: true,
                    category: { select: { id: true, title: true, type: true } },
                    subCategory: { select: { id: true, title: true } },
                    title: true,
                    sale_price: true,
                    deposit_price: true,
                    rent_price: true,
                    is_applicant: true,
                    number_of_rooms: true,
                    max_capicity: true,
                    normal_days_price: true,
                    weekend_price: true,
                    special_days_price: true,
                    cost_per_additional_person: true,
                    extra_people: true,
                    status: true,
                    province: { select: { id: true, name: true } },
                    city: { select: { id: true, name: true } },
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
            const relatedTransformer = this.realEstateAdsTransformer.collectionAdList(related);
            await this.cacheManager.set(resourceKey, {
                details: transformer,
                related: relatedTransformer,
            });
            return { status: 201, result: { id: body.id } };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async checkExistDataInSuspiciousBehavior(clientId, adId) {
        return this.prismaService.suspiciousBehaviosForAds.findFirst({
            where: { adId, clientId },
        });
    }
    async checkExistDataInEstimatePriceForAd(clientId, adId) {
        return this.prismaService.estimatePriceAds.findFirst({
            where: { adId, clientId },
        });
    }
    async findDetails(query) {
        console.log("*** findDetails ***");
        const client = await this.clientService.validateWithID(Number(query.client_id));
        if (!client) {
            throw new common_1.ForbiddenException();
        }
        let where = {};
        if (query.tracking_code) {
            where = { tracking_code: query.tracking_code };
        }
        else {
            where = { id: Number(query.item_id) };
        }
        const resourceKey = `ad_details_id_${query.item_id}`;
        let single = await this.cacheManager.get(resourceKey);
        const warnings = await this.GetWarningSingBeforeTransaction();
        if (!single) {
            const transformer = await this.adDetail(where);
            await this.cacheManager.set(resourceKey, Object.assign(Object.assign({}, transformer), { warnings }));
            single = Object.assign(Object.assign({}, transformer), { warnings });
        }
        const existSuspiciousBehaviorData = await this.checkExistDataInSuspiciousBehavior(client.id, single.details.id);
        single.details.report_suspicious_behavior = !!existSuspiciousBehaviorData;
        const existEstimatePrice = await this.checkExistDataInEstimatePriceForAd(client.id, single.details.id);
        single.details.estimated_price = !!existEstimatePrice;
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
                robotAdItems: true,
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
        if (!result || result.status === Statuses_1.default.inactive) {
            throw new common_1.BadRequestException();
        }
        let adOwnerInfo;
        if ((result === null || result === void 0 ? void 0 : result.seller_type) === RealEstateAdSellerTypes_1.default.individual &&
            (result === null || result === void 0 ? void 0 : result.tag) === get_details_real_estate_ads_dto_1.AdsDetailTags.mrbuilding) {
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
        result.is_active_chat = true;
        result.display_contact = true;
        if ((result === null || result === void 0 ? void 0 : result.tag) !== get_details_real_estate_ads_dto_1.AdsDetailTags.mrbuilding) {
            const checkExistClient = await this.prismaService.client.findFirst({
                where: { phone: result.owner_phone },
            });
            if (checkExistClient) {
                result.client_id = checkExistClient.id;
                result.owner_info = {
                    phone: checkExistClient.phone,
                    name: checkExistClient.name + " " + checkExistClient.surname,
                    avatar: checkExistClient.avatar
                        ? `${process.env.APP_CONTENT_PATH}/clients/avatars/${checkExistClient.avatar}`
                        : "",
                };
            }
            else {
                result.client_id = null;
                result.is_active_chat = false;
                result.owner_info = {
                    phone: result.owner_phone,
                    name: result.owner_name ? result.owner_name : "",
                    avatar: "",
                };
            }
        }
        const details = this.realEstateAdsTransformer.transformDetails(result);
        let related = await this.realEstateAdsPostgresqlRepository.findMany({
            where: {
                subCategoryId: result.subCategoryId,
                province_id: Number(result.province.id),
                status: Statuses_1.default.approved,
                city_id: Number(result.city.id),
                NOT: {
                    id: result.id,
                },
            },
            skip: 0,
            orderBy: { created_at: "desc" },
            take: 12,
            select: {
                id: true,
                tag: true,
                category: { select: { id: true, title: true, type: true } },
                subCategory: { select: { id: true, title: true } },
                title: true,
                is_applicant: true,
                status: true,
                province: { select: { id: true, name: true } },
                city: { select: { id: true, name: true } },
                area: true,
                seller_type: true,
                agent_id: true,
                advisor_id: true,
                sale_price: true,
                deposit_price: true,
                rent_price: true,
                number_of_rooms: true,
                max_capicity: true,
                normal_days_price: true,
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
        related = await Promise.all(related.map(async (item) => {
            return await this.getAdOwnerInfo(item);
        }));
        related = this.realEstateAdsTransformer.collectionAdList(related);
        return { details, related };
    }
    async findAds(query) {
        try {
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
                if (!result) {
                    return { status: 400 };
                }
                result = await Promise.all(result.map(async (item) => {
                    item.display_contact = true;
                    if ((item === null || item === void 0 ? void 0 : item.tag) !== get_details_real_estate_ads_dto_1.AdsDetailTags.mrbuilding &&
                        item.owner_phone !== null) {
                        const checkExistClient = await this.prismaService.client.findFirst({
                            where: { phone: item.owner_phone },
                        });
                        if (checkExistClient) {
                            item.client_id = checkExistClient.id;
                            item.owner_info = {
                                phone: checkExistClient.phone,
                                name: checkExistClient.name + " " + checkExistClient.surname,
                                avatar: checkExistClient.avatar
                                    ? `${process.env.APP_CONTENT_PATH}/clients/avatars/${checkExistClient.avatar}`
                                    : "",
                            };
                        }
                        else {
                            item.client_id = null;
                            item.is_active_chat = false;
                            item.owner_info = {
                                phone: item.owner_phone,
                                name: item.owner_name ? item.owner_name : "",
                                avatar: "",
                            };
                        }
                    }
                    return await this.getAdOwnerInfo(item);
                }));
                const transformer = this.realEstateAdsTransformer.collectionAdList(result);
                await this.cacheManager.set(resourceKey, transformer);
                result = transformer;
                console.log("*** Save Ads List Into Cache ***");
            }
            else {
                console.log("*** Get Ads List From Cache ***");
            }
            console.log("length: ", result.length);
            console.log("* resourceKey *");
            console.log(resourceKey);
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
            resourceKey = `tag_${query.tag}_sort_${query.sort}_clientId_${query.client_id}_provinceId_${query.province_id}_page_${query.page}`;
        }
        else if (query.tag === "individual") {
            resourceKey = `tag_${query.tag}_province_id_${query.province_id}_city_id_${query.city_id}_clientId_${Number(query.client_id)}_page_${query.page}`;
        }
        else if (query.tag === "me") {
            resourceKey = `tag_${query.tag}_clientId_${Number(query.client_id)}_page_${query.page}`;
        }
        else if (query.tag === RealEstateAdSellerTypes_1.default.real_estate_agent) {
            resourceKey = `tag_${query.tag}_status_${query.status}_sort_${query.sort}_clientId_${query.client_id}_agentId_${query.agent_id}_page_${query.page}__category_id_${query.category_id}___sub_category_id_${query.sub_category_id}`;
        }
        else if (query.tag === RealEstateAdSellerTypes_1.default.advisor) {
            resourceKey = `tag_${query.tag}_status_${query.status}_clientId_${query.client_id}_advisorId_${query.advisor_id}_sort_${query.sort}_page_${query.page}__category_id_${query.category_id}___sub_category_id_${query.sub_category_id}`;
        }
        else if (query.tag === "search") {
            resourceKey = `tag_${query.tag}_status_${query.status}_clientId_${query.client_id}_sort_${query.sort}_provinceId_${query.province_id}_page_${query.page}`;
        }
        return resourceKey;
    }
    makeSortAds(condition, sort, type, tag) {
        if (tag === get_real_estate_ads_dto_1.SelectedAdStatus.me) {
            condition.orderBy = { created_at: "desc" };
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
    async sortAdsByDate(list) {
        const compareAdsTime = (a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return dateA - dateB;
        };
        const sortedData = list.sort(compareAdsTime);
        sortedData.reverse();
        return sortedData;
    }
    async getAdOwnerInfo(ad) {
        const adInfo = ad;
        adInfo.owner_info = adInfo.owner_info;
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
            const client = await this.clientService.validateWithID(Number(body.client_id));
            if (!client) {
                return { status: 403 };
            }
            const { type, sale_price, deposit_price, normal_days_price, number_of_rooms, max_capicity, rent_price, size, year_built, items, city_id, has_video, } = body;
            let orderBy;
            let where;
            if (body.city_id) {
                where = {
                    city_id: body.city_id,
                };
            }
            if (body.category_id) {
                where = {
                    categoryId: body.category_id,
                };
            }
            if (body.sub_category_id.length > 0) {
                where = Object.assign(Object.assign({}, where), { subCategoryId: body.sub_category_id });
            }
            where = Object.assign(Object.assign({}, where), { status: "approved", province_id: body.province_id, is_applicant: body.is_applicant, AND: [
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
            if (body.tag === "all") {
                where = Object.assign({}, where);
            }
            else if (body.tag === "real_estate_agent") {
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
                    title: true,
                    is_applicant: true,
                    tag: true,
                    owner_name: true,
                    owner_phone: true,
                    robotAdItems: true,
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
                            thumbnail: true,
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
    async removeAd(query) {
        try {
            const client = await this.clientService.validateWithID(Number(query.client_id));
            if (!client) {
                return { status: 403 };
            }
            const adDetails = await this.realEstateAdsPostgresqlRepository.findOneByID(Number(query.ad_id));
            if (!adDetails) {
                return { status: 400 };
            }
            await this.realEstateAdsPostgresqlRepository.changeStatus({ id: Number(query.ad_id) }, { status: Statuses_1.default.deleted });
            await this.prismaService.reasonsForDeletedAds.createMany({
                data: query.reasons.map((item) => {
                    return {
                        text: item,
                        adId: adDetails.id,
                    };
                }),
            });
            const resourceKey = `singleTransform_AdId_${adDetails.id}`;
            await this.cacheManager.del(resourceKey);
            if (client.roles.includes(ClientRoles_1.default.advisor)) {
                const info = await this.prismaService.realEstateAdvisors.findFirst({
                    where: { client_id: client.id },
                });
                await this.prismaService.realEstateAdvisors.update({
                    where: { id: info.id },
                    data: { number_of_ads: info.number_of_ads - 1 },
                });
                const agentInfo = await this.prismaService.realEstateAgents.findFirst({
                    where: { id: info.real_estate_agent_id },
                });
                await this.prismaService.realEstateAgents.update({
                    where: { id: agentInfo.id },
                    data: { number_of_ads: Number(agentInfo.number_of_ads) - 1 },
                });
            }
            else if (client.roles.includes(ClientRoles_1.default.estate_agent)) {
                const info = await this.prismaService.realEstateAgents.findFirst({
                    where: { client_id: client.id },
                });
                await this.prismaService.realEstateAgents.update({
                    where: { id: info.id },
                    data: { number_of_ads: Number(info.number_of_ads) - 1 },
                });
            }
            return { status: 200 };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async getPublicAds(body) {
        try {
            const client = await this.clientService.validateWithID(Number(body.client_id));
            if (!client) {
                return { status: 403 };
            }
            const filters = { seller_type: RealEstateAdSellerTypes_1.default.individual };
            if (body.ad_type.length) {
                filters.type = { in: body.ad_type };
            }
            if (body.province.length) {
                filters.province_id = { in: body.province };
            }
            if (body.city.length) {
                filters.city_id = { in: body.city };
            }
            const count = await this.prismaService.realEstateAds.count({
                where: filters,
            });
            const total = this.getTotalPageNumber(Number(count), Number(body.per_page));
            const paginationValue = this.makePagination(Number(body.page), Number(body.per_page));
            console.log(count);
            const result = await this.prismaService.realEstateAds.findMany({
                where: filters,
                skip: paginationValue.offset,
                take: paginationValue.per_page,
                select: {
                    id: true,
                    title: true,
                    status: true,
                    province: { select: { id: true, name: true } },
                    city: { select: { id: true, name: true } },
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
                orderBy: { id: "desc" },
            });
            const transform = this.realEstateAdsTransformer.collectionAdList(result);
            return {
                status: 200,
                result: transform,
                metadata: this.makeMetadata(Number(body.page), Number(body.per_page), Number(total)),
            };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async UploadFile(body, res) {
        let dirname = "";
        let thumbnail = "";
        let result;
        if (body.type === "temp") {
            dirname = "temp/files/";
            if (body.file_type === UploaderFileTypes_1.default.video) {
                thumbnail = await this.generateThumbnailForVideo(body.file, dirname);
            }
            else {
                console.log({ dirname });
                const { path } = await this.generateThumbnailForImage(body.file, dirname);
                thumbnail = path;
            }
            result =
                await this.realEstateAdsPostgresqlRepository.SaveRealEstateAdsTempFiles(body.file_type, body.file, thumbnail);
        }
        else {
            dirname = "real_estate_ads";
            this.uploadService.moveFile(body.file, "temp/files/", dirname);
            if (body.file_type === UploaderFileTypes_1.default.video) {
                thumbnail = await this.generateThumbnailForVideo(body.file, dirname);
            }
            else {
                const { path } = await this.generateThumbnailForImage(body.file, dirname);
                thumbnail = path;
            }
            if (body.priority === RealEstateAdMediaTypePriorities_1.default.primary) {
                await this.realEstateAdsPostgresqlRepository.changePriorityFilesToNormal(body.ad_id);
            }
            result = await this.realEstateAdsPostgresqlRepository.saveMedia(body.ad_id, body.file_type, body.file, thumbnail);
        }
        const transformer = this.realEstateAdsTransformer.transformFile(result, dirname, get_details_real_estate_ads_dto_1.AdsDetailTags.mrbuilding);
        res.status(200);
        return res.json({
            statusCode: 200,
            message: "لیست آیتم های فرم آگهی املاک در دسترس است.",
            data: transformer,
        });
    }
    async generateThumbnailForVideo(file, dir) {
        const path = this.getPath();
        const filename = Date.now() + "-thumb.png";
        ffmpeg({ source: `${path}/${dir}/${file}` }).takeScreenshots({
            count: 1,
            timemarks: [0],
            filename,
        }, `${path}/${dir}/`);
        return `/${dir}/${filename}`;
    }
    async generateThumbnailForImage(file, dir) {
        const { path } = await (0, SharpPipe_1.default)(file, `/${dir}/`);
        return { path };
    }
    getPath() {
        const ROOT_PATH = process.cwd();
        const APP_CONTENT = process.env.APP_CONTENT;
        return `${ROOT_PATH}${APP_CONTENT}`;
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
    async moveFileLocation(source, destination, file_name) {
        if ((0, fs_1.existsSync)((0, path_1.join)(__dirname, source, file_name))) {
            (0, fs_1.renameSync)((0, path_1.join)(__dirname, source, file_name), (0, path_1.join)(__dirname, destination, file_name));
            return true;
        }
        return false;
    }
    async removeAdFile(query) {
        try {
            const client = await this.clientService.validateWithID(query.client_id);
            if (!client) {
                return { status: 403 };
            }
            const fileInfo = await this.realEstateAdsPostgresqlRepository.getFileInfo(query);
            if (!fileInfo) {
                return { status: 400 };
            }
            if (query.type === delete_media_item_dto_1.RealEstateMediaItemTypes.file) {
                await this.realEstateAdsPostgresqlRepository.removeMedia(Number(query.item_id));
                this.uploadService.removeFile(fileInfo.file_name, "real_estate_ads");
            }
            else {
                await this.realEstateAdsPostgresqlRepository.deleteTempFile(Number(query.item_id));
                this.uploadService.removeFile(fileInfo.file_name, "temp/real_estate_ads");
            }
            return { status: 200 };
        }
        catch (error) {
            return { status: 500 };
        }
    }
    async changeCover(body) {
        try {
            const client = await this.clientService.validateWithID(Number(body.client_id));
            if (!client) {
                return { status: 403 };
            }
            const adInfo = await this.prismaService.realEstateAds.findFirst({
                where: { id: Number(body.ad_id), client_id: Number(body.client_id) },
            });
            if (!adInfo) {
                return { status: 400 };
            }
            await this.prismaService.realEstateAdvertisements.updateMany({
                where: { ad_id: Number(body.ad_id) },
                data: { priority: RealEstateAdMediaTypePriorities_1.default.normal },
            });
            await this.prismaService.realEstateAdvertisements.update({
                where: { id: Number(body.item_id) },
                data: { priority: RealEstateAdMediaTypePriorities_1.default.primary },
            });
            return { status: 200 };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async generateTrackingCode() {
        const uniqueCode = (Math.random() * (100000000 - 1000000) +
            1000000).toFixed(0);
        const isCodeUnique = await this.realEstateAdsPostgresqlRepository.findOne({
            where: { tracking_code: uniqueCode },
        });
        if (isCodeUnique) {
            return this.generateTrackingCode();
        }
        return uniqueCode;
    }
    async changeStatus(body) {
        try {
            const client = await this.clientService.validateWithID(Number(body.user_id));
            if (!client) {
                return { status: 403 };
            }
            const ad_info = await this.realEstateAdsPostgresqlRepository.findOne({
                where: {
                    id: Number(body.item_id),
                },
            });
            if (!ad_info) {
                return { status: 400 };
            }
            if (ad_info.seller_type === RealEstateAdSellerTypes_1.default.real_estate_agent ||
                ad_info.seller_type === RealEstateAdSellerTypes_1.default.advisor) {
                await this.changeNumberOfAds(client, ad_info, body.status);
            }
            let data = {};
            if (body.status === Statuses_2.default.approved) {
                data = {
                    status: body.status,
                    price_status: body.price_status,
                };
            }
            else {
                await this.prismaService.reasonsForRejectingAds.deleteMany({
                    where: {
                        adId: Number(body.item_id),
                    },
                });
                if (body.status === Statuses_2.default.rejected && body.reasons.length) {
                    await this.prismaService.reasonsForRejectingAds.createMany({
                        data: body.reasons.map((item) => {
                            return {
                                text: item,
                                adId: Number(body.item_id),
                            };
                        }),
                    });
                }
                data = {
                    status: body.status,
                };
            }
            console.log("change Status Ad ");
            console.log({ data });
            const result = await this.realEstateAdsPostgresqlRepository.changeStatus({
                id: Number(body.item_id),
            }, data);
            if (!result) {
                return { status: 500 };
            }
            console.log(client.roles);
            await this.prismaService.realEstateAdApproval.create({
                data: {
                    user_id: Number(body.user_id),
                    user_type: client.roles.length > 1
                        ? client.roles[client.roles.indexOf(ClientRoles_1.default.client) + 1]
                        : "client",
                    ad_id: Number(body.item_id),
                    status: body.status,
                },
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
    async sendNotificationNewAd(ad_info) {
        console.log("Send Notification: Published Ad");
        await this.getClientsForFilteredAdSetting({
            categoryId: ad_info.categoryId,
            subCategoryId: ad_info.subCategoryId,
            cityId: ad_info.city_id,
            provinceId: ad_info.province_id,
            year_built: ad_info.year_built,
            sale_price: ad_info.sale_price,
            deposit_price: ad_info.deposit_price,
            rent_price: ad_info.rent_price,
            normal_days_price: ad_info.normal_days_price,
            number_of_rooms: ad_info.number_of_rooms,
            special_days_price: ad_info.special_days_price,
            weekend_price: ad_info.weekend_price,
            max_capicity: ad_info.max_capicity,
            size: ad_info.size,
        }, ad_info);
    }
    async changeNumberOfAds(client, ad_info, status) {
        try {
            const agent_info = await this.prismaService.realEstateAgents.findFirst({
                where: { id: ad_info.agent_id },
            });
            if (ad_info.seller_type === RealEstateAdSellerTypes_1.default.real_estate_agent) {
                if (status === Statuses_1.default.approved) {
                    if (ad_info.status === Statuses_1.default.pending ||
                        ad_info.status === Statuses_1.default.rejected) {
                        await this.prismaService.realEstateAgents.update({
                            where: { id: ad_info.agent_id },
                            data: {
                                number_of_ads: agent_info.number_of_ads + 1,
                            },
                        });
                        await this.saveNewPrize(client, MissionTypes_1.default.ad_approval);
                    }
                }
                else if (status === Statuses_1.default.rejected &&
                    ad_info.status === Statuses_1.default.approved) {
                    await this.prismaService.realEstateAgents.update({
                        where: { id: ad_info.agent_id },
                        data: {
                            number_of_ads: agent_info.number_of_ads - 1,
                        },
                    });
                }
            }
            else if (ad_info.seller_type === RealEstateAdSellerTypes_1.default.advisor) {
                const advisor_info = await this.prismaService.realEstateAdvisors.findFirst({
                    where: { id: ad_info.advisor_id },
                });
                if (status === Statuses_1.default.approved) {
                    if (ad_info.status === Statuses_1.default.pending ||
                        ad_info.status === Statuses_1.default.rejected) {
                        await this.saveNewPrize(client, MissionTypes_1.default.ad_approval);
                        await this.prismaService.realEstateAdvisors.update({
                            where: { id: ad_info.advisor_id },
                            data: {
                                number_of_ads: advisor_info.number_of_ads + 1,
                            },
                        });
                        await this.prismaService.realEstateAgents.update({
                            where: { id: ad_info.agent_id },
                            data: {
                                number_of_ads: agent_info.number_of_ads + 1,
                            },
                        });
                    }
                }
                else if (status === Statuses_1.default.rejected &&
                    ad_info.status === Statuses_1.default.approved) {
                    await this.prismaService.realEstateAdvisors.update({
                        where: { id: ad_info.advisor_id },
                        data: {
                            number_of_ads: advisor_info.number_of_ads - 1,
                        },
                    });
                    await this.prismaService.realEstateAgents.update({
                        where: { id: ad_info.agent_id },
                        data: {
                            number_of_ads: agent_info.number_of_ads - 1,
                        },
                    });
                }
            }
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }
    async saveNewPrize(client, refrence) {
        let mission = (await this.prismaService.missions.findFirst({
            where: { key: refrence },
        }));
        if (!mission) {
            mission = {
                title: "تایید آگهی",
                key: MissionTypes_2.default.approval_ad,
                description: "با تایید هر آگهی در بخش آگهی‌های عمومی، از ما امتیاز بگیرید!",
                point: 130,
            };
        }
        await this.prismaService.receiveMissions.create({
            data: {
                mission_id: mission.id,
                client_id: client.id,
                title: mission.title,
                description: mission.description,
                point: mission.point,
                received_at: new Date(),
            },
        });
        await this.clientService.saveMission(mission, client.id);
        await this.clientService.saveHistoryOfScore(client.id, mission, client.score, "increase");
    }
    async getUserPermittedAds() {
        const result = await this.prismaService.adminUserRoleCategories.findMany({
            where: {
                key: "ads",
                assignedRoles: {
                    some: {
                        role: {
                            isNot: {
                                title: "سوپر ادمین",
                            },
                        },
                    },
                },
            },
            select: {
                assignedRoles: {
                    select: {
                        role: {
                            select: {
                                title: true,
                                userRoles: {
                                    select: {
                                        user: {
                                            select: {
                                                id: true,
                                                name: true,
                                                phone: true,
                                                email: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        let usersPermitted = [];
        result.map((item) => {
            item.assignedRoles.map((role) => {
                if (role.role.title !== "سوپر ادمین") {
                    role.role.userRoles.map((user) => {
                        usersPermitted = [...usersPermitted, user.user];
                    });
                }
            });
        });
        let emailList = [];
        usersPermitted.map((item) => {
            emailList = [...emailList, item.email];
        });
        return emailList;
    }
    async senEmailForAdmins() {
        const usersPermitted = await this.getUserPermittedAds();
        await this.mailerService.sendBulk({
            body: "آگهی جدید ثبت شده است. برای بررسی آگهی ها وارد پنل آقای ساختمان شوید.",
            subject: "اطلاع رسانی - آگهی جدید",
            to: usersPermitted,
        });
    }
    async getRejectedReasonList() {
        const result = await this.prismaService.reasonsAdTemplate.findMany({
            where: { type: ReasonAdTypes_1.ReasonAdTypes.Rejected },
            orderBy: { created_at: "desc" },
            select: {
                id: true,
                text: true,
                created_at: true,
            },
        });
        return {
            status: common_1.HttpStatus.OK,
            message: messages_1.PublicMessage.OkResponse,
            data: result,
        };
    }
    async getDeletedReasonList() {
        const result = await this.prismaService.reasonsAdTemplate.findMany({
            where: { type: ReasonAdTypes_1.ReasonAdTypes.Deleted },
            orderBy: { created_at: "desc" },
            select: {
                id: true,
                text: true,
                created_at: true,
            },
        });
        return {
            status: common_1.HttpStatus.OK,
            message: messages_1.PublicMessage.OkResponse,
            data: result,
        };
    }
    async getSuspiciousBehavior() {
        const result = await this.prismaService.reasonsAdTemplate.findMany({
            where: { type: ReasonAdTypes_1.ReasonAdTypes.SuspiciousBehavior },
            orderBy: { created_at: "desc" },
            select: {
                id: true,
                text: true,
                created_at: true,
            },
        });
        return {
            status: common_1.HttpStatus.OK,
            message: messages_1.PublicMessage.OkResponse,
            data: result,
        };
    }
    async saveNewSuspiciousBehavior(body) {
        const result = await this.prismaService.suspiciousBehaviosForAds.createMany({
            data: body.reasons.map((item) => {
                return {
                    text: item,
                    adId: body.ad_id,
                    clientId: body.client_id,
                };
            }),
        });
        return {
            status: common_1.HttpStatus.CREATED,
            message: messages_1.PublicMessage.OkResponse,
        };
    }
    async storeEstimatePriceForAd(body) {
        const checkExist = await this.prismaService.estimatePriceAds.findFirst({
            where: {
                clientId: body.client_id,
                adId: body.ad_id,
            },
        });
        if (checkExist) {
            throw new common_1.ConflictException();
        }
        await this.prismaService.estimatePriceAds.create({
            data: {
                client: { connect: { id: body.client_id } },
                ad: { connect: { id: body.ad_id } },
                estimate_price: body.status,
            },
        });
        return {
            status: common_1.HttpStatus.CREATED,
            message: messages_1.PublicMessage.OkResponse,
        };
    }
    generateConditionFoFindAds(query) {
        let condition = {
            where: {},
            orderBy: {},
        };
        let Reasons = false;
        if (query.tag === get_real_estate_ads_dto_1.SelectedAdStatus.me) {
            Reasons = true;
            condition.where = {
                client_id: Number(query.client_id),
                seller_type: RealEstateAdSellerTypes_1.default.individual,
            };
        }
        else if (query.tag === get_real_estate_ads_dto_1.SelectedAdStatus.individual) {
            condition.where = {
                seller_type: query.tag,
                province_id: Number(query.province_id),
            };
            if (query.city_id) {
                condition.where = Object.assign(Object.assign({}, condition.where), { city_id: Number(query.city_id) });
            }
        }
        else if (query.tag === "all") {
            condition.where = {
                status: Statuses_1.default.approved,
                province_id: Number(query.province_id),
            };
            if (query.city_id) {
                condition.where = Object.assign(Object.assign({}, condition.where), { city_id: Number(query.city_id) });
            }
        }
        else if (query.tag === "real_estate_agent") {
            Reasons = true;
            condition.where = {
                agent_id: Number(query.agent_id),
                OR: [
                    { seller_type: RealEstateAdSellerTypes_1.default.real_estate_agent },
                    { seller_type: RealEstateAdSellerTypes_1.default.advisor },
                ],
                status: query.status !== "all" ? query.status : undefined,
            };
        }
        else if (query.tag === "advisor") {
            condition.where = {
                seller_type: RealEstateAdSellerTypes_1.default.advisor,
                advisor_id: Number(query.advisor_id),
                status: query.status !== "all" ? query.status : undefined,
            };
        }
        else if (query.tag === get_real_estate_ads_dto_1.SelectedAdStatus.search) {
            condition.where = {
                status: query.status !== "all" ? query.status : undefined,
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
        condition = this.makeSortAds(condition, query.sort, query.type, query.tag);
        if (query.status !== Statuses_1.default.all) {
            condition.where.status = query.status;
        }
        else {
            condition.where.status = {
                not: Statuses_1.default.deleted,
            };
        }
        return { condition, Reasons };
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
RealEstateAdsServiceApp = __decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.REQUEST }),
    __param(0, (0, common_1.Inject)(core_1.REQUEST)),
    __param(1, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [Object, Object, RealEstateAdsPostgresqlRepository_1.default,
        client_service_1.ClientService,
        Transformer_1.default,
        prisma_service_1.PrismaService,
        mailerService_1.default,
        real_estate_ads_service_1.RealEstateAdsService_robotScraper,
        FcmNotificationService_1.default,
        SmsService_1.default])
], RealEstateAdsServiceApp);
exports.RealEstateAdsServiceApp = RealEstateAdsServiceApp;
//# sourceMappingURL=real-estate-ads-service-app.service.js.map