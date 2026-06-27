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
exports.RealEstateAdsService = void 0;
const common_1 = require("@nestjs/common");
const RealEstateAdsPostgresqlRepository_1 = require("../repositories/RealEstateAdsPostgresqlRepository");
const Statuses_1 = require("../../../../commons/contracts/Statuses");
const RealEstateAdMediaType_1 = require("../../../../commons/contracts/RealEstateAdMediaType");
const RealEstateAdMediaTypePriorities_1 = require("../../../../commons/contracts/RealEstateAdMediaTypePriorities");
const SortingTypes_1 = require("../../../../commons/contracts/SortingTypes");
const RealEstateAdSellerTypes_1 = require("../../../../commons/contracts/RealEstateAdSellerTypes");
const users_service_1 = require("../../users/admin/users.service");
const prisma_service_1 = require("../../../../../prisma/prisma.service");
const UserTypes_1 = require("../../../../commons/contracts/UserTypes");
const mailerService_1 = require("../../../services/notifications/mailer/mailerService");
const client_list_dto_1 = require("../../client/admin/dto/client-list.dto");
const process = require("process");
const SortingTypes_2 = require("../../../../commons/contracts/SortingTypes");
const Statuses_2 = require("../../../../commons/contracts/Statuses");
const real_estate_ads_service_app_service_1 = require("../app/real-estate-ads-service-app.service");
const messages_1 = require("../../../../commons/enums/messages");
const UploadService_1 = require("../../../services/UploadService");
const get_details_real_estate_ads_dto_1 = require("../app/dto/get-details-real-estate-ads.dto");
const ReasonAdTypes_1 = require("./enums/ReasonAdTypes");
let RealEstateAdsService = class RealEstateAdsService {
    constructor(realEstateAdsPostgresqlRepository, usersService, prismaService, mailerService, adsServiceApp) {
        this.realEstateAdsPostgresqlRepository = realEstateAdsPostgresqlRepository;
        this.usersService = usersService;
        this.prismaService = prismaService;
        this.mailerService = mailerService;
        this.adsServiceApp = adsServiceApp;
        this.uploadService = new UploadService_1.default();
    }
    async findDetails(tracking_code) {
        try {
            const result = (await this.prismaService.realEstateAds.findFirst({
                where: { tracking_code: tracking_code, tag: get_details_real_estate_ads_dto_1.AdsDetailTags.mrbuilding },
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
                                    sort_number: true
                                }
                            }
                        },
                        orderBy: {
                            form: {
                                sort_number: "asc"
                            }
                        }
                    },
                    robotAdItems: true,
                    media: {
                        select: {
                            id: true,
                            file_name: true,
                            file_type: true,
                            sort_number: true,
                            priority: true,
                            thumbnail: true
                        }
                    }
                }
            }));
            if (!result) {
                return { status: 400 };
            }
            let adOwnerInfo;
            if (result.seller_type === RealEstateAdSellerTypes_1.default.individual) {
                adOwnerInfo = await this.prismaService.client.findFirst({
                    where: { id: result.client_id }
                });
                result.owner_info = {
                    phone: adOwnerInfo.phone,
                    name: adOwnerInfo.name + " " + adOwnerInfo.surname,
                    avatar: adOwnerInfo.avatar
                        ? `${process.env.APP_CONTENT_PATH}/clients/avatars/${adOwnerInfo.avatar}`
                        : ""
                };
            }
            else if (result.seller_type === RealEstateAdSellerTypes_1.default.real_estate_agent) {
                const adminInfo = await this.prismaService.realEstateAgentAdmins.findFirst({
                    where: {
                        agent_id: result.agent_id,
                        permissions: { hasSome: "answer_calls" }
                    },
                    select: {
                        client: { select: { phone: true, name: true, avatar: true } }
                    },
                    orderBy: { id: "desc" }
                });
                const agentInfo = await this.prismaService.realEstateAgents.findUnique({
                    where: { id: result.agent_id },
                    select: {
                        name: true,
                        avatar: true,
                        client: { select: { phone: true } }
                    }
                });
                if (!adminInfo) {
                    adOwnerInfo = {
                        phone: agentInfo.client.phone,
                        name: agentInfo.name,
                        avatar: agentInfo.avatar
                    };
                    result.owner_info = {
                        phone: adOwnerInfo.phone,
                        name: adOwnerInfo.name,
                        avatar: adOwnerInfo.avatar
                            ? `${process.env.APP_CONTENT_PATH}/estate-agents/avatars/${adOwnerInfo.avatar}`
                            : ""
                    };
                }
                else {
                    adOwnerInfo = {
                        phone: adminInfo.client.phone,
                        name: adminInfo.client.name,
                        avatar: adminInfo.client.avatar
                    };
                    result.owner_info = {
                        phone: adOwnerInfo.phone,
                        name: adOwnerInfo.name,
                        avatar: adOwnerInfo.avatar
                            ? `${process.env.APP_CONTENT_PATH}/estate-agents/avatars/${adOwnerInfo.avatar}`
                            : ""
                    };
                }
            }
            else if (result.seller_type === RealEstateAdSellerTypes_1.default.advisor) {
                adOwnerInfo = await this.prismaService.realEstateAdvisors.findFirst({
                    where: { client_id: result.client_id },
                    select: {
                        phone: true,
                        avatar: true,
                        client: { select: { name: true, avatar: true } },
                        real_estate_agent: {
                            select: { id: true, phone: true, name: true, avatar: true }
                        }
                    }
                });
                result.owner_info = {
                    phone: adOwnerInfo.real_estate_agent.phone,
                    name: adOwnerInfo.real_estate_agent.name,
                    avatar: adOwnerInfo.real_estate_agent.avatar
                        ? `${process.env.APP_CONTENT_PATH}/estate-agents/avatars/${adOwnerInfo.real_estate_agent.avatar}`
                        : ""
                };
            }
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
    async changeStatus(body) {
        try {
            const ad_info = await this.prismaService.realEstateAds.findFirst({
                where: {
                    id: body.item_id
                }
            });
            if (!ad_info) {
                return { status: 400 };
            }
            if (ad_info.seller_type === RealEstateAdSellerTypes_1.default.real_estate_agent ||
                ad_info.seller_type === RealEstateAdSellerTypes_1.default.advisor) {
                await this.changeNumberOfAds(ad_info, body.status);
            }
            const result = await this.realEstateAdsPostgresqlRepository.changeStatus({
                id: body.item_id
            }, { status: body.status, price_status: body.price_status });
            if (!result) {
                return { status: 400 };
            }
            await this.prismaService.realEstateAdApproval.create({
                data: {
                    user_id: Number(body.user_id),
                    user_type: UserTypes_1.default.dashboard_admin,
                    ad_id: body.item_id,
                    status: body.status
                }
            });
            if (body.status === Statuses_2.default.rejected) {
                await this.prismaService.reasonsForRejectingAds.deleteMany({
                    where: {
                        adId: body.item_id
                    }
                });
                await this.prismaService.reasonsForRejectingAds.createMany({
                    data: body.reasons.map((item) => {
                        return {
                            text: item,
                            adId: body.item_id
                        };
                    })
                });
            }
            else {
                const { details } = await this.adsServiceApp.adDetail({
                    id: ad_info.id
                });
                if (ad_info.seller_type === RealEstateAdSellerTypes_1.default.real_estate_agent ||
                    ad_info.seller_type === RealEstateAdSellerTypes_1.default.advisor) {
                    await this.updatePublishedAdTime(ad_info.agent_id);
                }
            }
            return {
                status: 200
            };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async updatePublishedAdTime(agent_id) {
        await this.prismaService.realEstateAgents.update({
            where: { id: agent_id },
            data: {
                published_ad_time: new Date(Date.now())
            }
        });
    }
    async saveCategory(body) {
        try {
            let result;
            if (body.item_id) {
                result = { id: body.item_id };
                await this.prismaService.realEstateAdMainCategory.update({
                    where: { id: body.item_id },
                    data: {
                        title: body.title,
                        type: body.type
                    },
                    select: { id: true }
                });
            }
            else {
                result = await this.prismaService.realEstateAdMainCategory.create({
                    data: {
                        type: body.type,
                        title: body.title
                    }
                });
            }
            if (body.items.length) {
                await body.items.map(async (item) => {
                    console.log(item);
                    await this.prismaService.realEstateAdSubCategory.create({
                        data: {
                            title: item.title,
                            formId: item.form_id,
                            categoryId: result.id
                        }
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
    async getCategorys(body) {
        try {
            let where = {};
            if (body.status === Statuses_1.default.all) {
                where = {};
            }
            else {
                where = { status: body.status };
            }
            const count = await this.prismaService.realEstateAdMainCategory.count({
                where: Object.assign({}, where)
            });
            const total = this.getTotalPageNumber(Number(count), Number(body.per_page));
            const paginationValue = this.makePagination(Number(body.page), Number(body.per_page));
            const result = await this.prismaService.realEstateAdMainCategory.findMany({
                where: Object.assign({}, where),
                select: {
                    id: true,
                    title: true,
                    type: true,
                    status: true,
                    RealEstateAdSubCategory: {
                        select: {
                            id: true,
                            title: true,
                            formId: true,
                            form: {
                                select: {
                                    items: {
                                        orderBy: { sort_number: "asc" },
                                        select: {
                                            id: true,
                                            field_name: true,
                                            is_active: true,
                                            required: true,
                                            field_type: true,
                                            values: true,
                                            icon: true
                                        }
                                    }
                                }
                            }
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
    async deleteMainCategory(item_id) {
        try {
            const result = await this.prismaService.realEstateAdMainCategory.findFirst({
                where: {
                    id: item_id
                }
            });
            if (!result) {
                return { status: 400 };
            }
            await this.prismaService.realEstateAdSubCategory.deleteMany({
                where: { categoryId: item_id }
            });
            await this.prismaService.realEstateAdMainCategory.delete({
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
    async deleteSubCategory(item_id) {
        try {
            const result = await this.prismaService.realEstateAdSubCategory.findFirst({
                where: {
                    id: item_id
                }
            });
            if (!result) {
                return { status: 400 };
            }
            await this.prismaService.realEstateAdSubCategory.delete({
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
            const result = await this.prismaService.realEstateAdSubCategory.findFirst({
                where: {
                    id: body.item_id
                }
            });
            if (!result) {
                return { status: 400 };
            }
            await this.prismaService.realEstateAdSubCategory.update({
                where: { id: body.item_id },
                data: { title: body.title, form: { connect: { id: body.form_id } } }
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
    async saveReasonsForRejectingAds(body) {
        try {
            let result;
            if (body.item_id) {
                result = await this.prismaService.reasonsAdTemplate.update({
                    where: {
                        id: body.item_id
                    },
                    data: {
                        userId: body.user_id,
                        text: body.text,
                        type: body.type
                    },
                    select: {
                        userId: true,
                        text: true,
                        type: true,
                        created_at: true
                    }
                });
            }
            else {
                result = await this.prismaService.reasonsAdTemplate.create({
                    data: {
                        userId: body.user_id,
                        text: body.text,
                        type: body.type
                    },
                    select: {
                        userId: true,
                        text: true,
                        type: true,
                        created_at: true
                    }
                });
            }
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
    async getReasonsList(query) {
        try {
            let condition = {};
            if (query.reason_type !== ReasonAdTypes_1.ReasonAdTypes.All) {
                condition = { type: query.reason_type };
            }
            if (query.type === client_list_dto_1.GetTypes.search) {
                condition = {
                    text: {
                        contains: query.keyword,
                        mode: "insensitive"
                    }
                };
            }
            let orderBy = { created_at: "desc" };
            if (query.sort === SortingTypes_2.default.oldest) {
                orderBy = { created_at: "asc" };
            }
            console.log({ condition });
            const count = await this.prismaService.reasonsAdTemplate.count({
                where: Object.assign({}, condition)
            });
            const total = this.getTotalPageNumber(Number(count), Number(query.per_page));
            const paginationValue = this.makePagination(Number(query.page), Number(query.per_page));
            const result = await this.prismaService.reasonsAdTemplate.findMany({
                where: Object.assign({}, condition),
                orderBy,
                skip: paginationValue.offset,
                take: paginationValue.per_page,
                select: {
                    id: true,
                    text: true,
                    type: true,
                    created_at: true
                }
            });
            return {
                status: 200,
                result,
                metadata: this.makeMetadata(Number(query.page), Number(query.per_page), Number(total))
            };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async SaveWarningSingBeforeTransaction(body) {
        let result;
        if (body.item_id) {
            result = await this.prismaService.warningSignsBeforTransaction.update({
                where: { id: body.item_id },
                data: { content: body.content },
                select: {
                    id: true,
                    content: true
                }
            });
        }
        result = await this.prismaService.warningSignsBeforTransaction.create({
            data: { content: body.content },
            select: {
                id: true,
                content: true
            }
        });
        return {
            statusCode: common_1.HttpStatus.CREATED,
            message: messages_1.PublicMessage.Created,
            data: result
        };
    }
    async GetWarningSingBeforeTransaction() {
        const result = await this.prismaService.warningSignsBeforTransaction.findFirst({
            select: {
                id: true,
                content: true
            }
        });
        return {
            statusCode: common_1.HttpStatus.OK,
            message: messages_1.PublicMessage.OkResponse,
            data: result
        };
    }
    async deleteAd(id) {
        await this.prismaService.realEstateAds.findFirst({
            where: {
                id
            }
        });
        const adMedia = await this.prismaService.realEstateAdvertisements.findMany({
            where: { ad_id: id }
        });
        adMedia.map(async (item) => {
            await this.uploadService.removeFile(item.file_name, "/real_estate_ads/");
        });
        await this.prismaService.realEstateAdvertisements.deleteMany({
            where: { ad_id: id }
        });
        await this.prismaService.realEstateAdFormValue.deleteMany({
            where: { ad_id: id }
        });
        await this.prismaService.realEstateAds.delete({
            where: {
                id
            }
        });
        return {
            statusCode: common_1.HttpStatus.OK,
            message: messages_1.PublicMessage.Deleted
        };
    }
    async deleteReasonsForRejectingAds(item_id) {
        try {
            await this.prismaService.reasonsAdTemplate.delete({
                where: {
                    id: item_id
                }
            });
            return {
                status: 200
            };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async changeNumberOfAds(ad_info, status) {
        try {
            const agent_info = await this.prismaService.realEstateAgents.findFirst({
                where: { id: ad_info.agent_id }
            });
            if (ad_info.seller_type === RealEstateAdSellerTypes_1.default.real_estate_agent) {
                if (status === Statuses_1.default.approved) {
                    await this.prismaService.realEstateAgents.update({
                        where: { id: ad_info.agent_id },
                        data: {
                            number_of_ads: agent_info.number_of_ads + 1
                        }
                    });
                }
                else if (status === Statuses_1.default.rejected) {
                    await this.prismaService.realEstateAgents.update({
                        where: { id: ad_info.agent_id },
                        data: {
                            number_of_ads: agent_info.number_of_ads - 1
                        }
                    });
                }
            }
            else if (ad_info.seller_type === RealEstateAdSellerTypes_1.default.advisor) {
                const advisor_info = await this.prismaService.realEstateAdvisors.findFirst({
                    where: { id: ad_info.advisor_id }
                });
                if (status === Statuses_1.default.approved) {
                    await this.prismaService.realEstateAdvisors.update({
                        where: { id: ad_info.advisor_id },
                        data: {
                            number_of_ads: advisor_info.number_of_ads + 1
                        }
                    });
                    await this.prismaService.realEstateAgents.update({
                        where: { id: ad_info.agent_id },
                        data: {
                            number_of_ads: agent_info.number_of_ads + 1
                        }
                    });
                }
                else if (status === Statuses_1.default.rejected) {
                    await this.prismaService.realEstateAdvisors.update({
                        where: { id: ad_info.advisor_id },
                        data: {
                            number_of_ads: advisor_info.number_of_ads - 1
                        }
                    });
                    await this.prismaService.realEstateAgents.update({
                        where: { id: ad_info.agent_id },
                        data: {
                            number_of_ads: agent_info.number_of_ads - 1
                        }
                    });
                }
            }
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }
    async getUserPermittedAds() {
        const result = await this.prismaService.adminUserRoleCategoryPermissions.findMany({
            where: {
                key: "list_ads"
            },
            select: {
                category: {
                    select: {
                        assignedRoles: {
                            select: {
                                role: {
                                    select: {
                                        userRoles: {
                                            select: {
                                                user: {
                                                    select: {
                                                        id: true,
                                                        name: true,
                                                        phone: true,
                                                        email: true
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        let usersPermitted = [];
        console.log("userPermitted response");
        result.map((item) => {
            item.category.assignedRoles.map((item2) => {
                item2.role.userRoles.map((user) => {
                    usersPermitted = [...usersPermitted, user.user];
                });
            });
        });
        let emailList = [];
        usersPermitted.map((item) => {
            console.log(item.email);
            emailList.push(item.email);
        });
        return emailList;
    }
    async senEmailForAdmins() {
        const usersPermitted = await this.getUserPermittedAds();
        await this.mailerService.sendBulk({
            body: "آگهی جدید ثبت شده است. برای بررسی آگهی ها وارد پنل آقای ساختمان شوید.",
            subject: "اطلاع رسانی - آگهی جدید",
            to: usersPermitted
        });
    }
    async findAds(query) {
        try {
            const client = await this.usersService.validateWithID(Number(query.user_id));
            if (!client) {
                return { status: 403 };
            }
            let condition = {};
            if (query.status !== Statuses_1.default.all) {
                condition = {
                    where: { status: query.status },
                    orderBy: { id: "desc" }
                };
            }
            if (query.sort === SortingTypes_1.default.newest) {
                condition = Object.assign(Object.assign({}, condition), { orderBy: { id: "desc" } });
            }
            else if (query.sort === SortingTypes_1.default.oldest) {
                condition = Object.assign(Object.assign({}, condition), { orderBy: { id: "asc" } });
            }
            else if (query.sort === SortingTypes_1.default.most_expensive) {
                condition = Object.assign(Object.assign({}, condition), { orderBy: [
                        { sale_price: "desc" },
                        { deposit_price: "desc" },
                        { rent_price: "desc" }
                    ] });
            }
            else if (query.sort === SortingTypes_1.default.cheapest) {
                condition = Object.assign(Object.assign({}, condition), { orderBy: [
                        { sale_price: "asc" },
                        { deposit_price: "asc" },
                        { rent_price: "asc" }
                    ] });
            }
            if (query.sub_category) {
                condition = Object.assign(Object.assign({}, condition), { where: Object.assign(Object.assign({}, condition.where), { subCategoryId: query.sub_category }) });
            }
            if (query.province_id) {
                condition = Object.assign(Object.assign({}, condition), { where: {
                        province_id: Number(query.province_id)
                    } });
            }
            condition.where = Object.assign(Object.assign({}, condition.where), { tag: get_details_real_estate_ads_dto_1.AdsDetailTags.mrbuilding });
            if (query.type === client_list_dto_1.GetTypes.search) {
                condition = Object.assign(Object.assign({}, condition), { where: Object.assign(Object.assign({}, condition.where), { OR: [
                            {
                                title: {
                                    contains: query.keyword,
                                    mode: "insensitive"
                                }
                            },
                            {
                                client: {
                                    name: {
                                        contains: query.keyword,
                                        mode: "insensitive"
                                    }
                                }
                            },
                            {
                                client: {
                                    phone: {
                                        contains: query.keyword,
                                        mode: "insensitive"
                                    }
                                }
                            },
                            {
                                client: {
                                    real_state_agents: {
                                        some: {
                                            name: {
                                                contains: query.keyword,
                                                mode: "insensitive"
                                            }
                                        }
                                    }
                                }
                            }
                        ] }) });
            }
            console.log("*** find Ads: Admin ***");
            console.log("page ", query.page);
            console.log({ query });
            console.log({ condition });
            const count = await this.realEstateAdsPostgresqlRepository.count(condition);
            const total = this.getTotalPageNumber(Number(count), Number(query.per_page));
            const paginationValue = this.makePagination(Number(query.page), Number(query.per_page));
            let result = await this.realEstateAdsPostgresqlRepository.findMany(Object.assign(Object.assign({}, condition), { skip: paginationValue.offset, take: paginationValue.per_page, select: {
                    id: true,
                    category: { select: { id: true, title: true, type: true } },
                    subCategory: { select: { id: true, title: true } },
                    title: true,
                    status: true,
                    Reasons: true,
                    province: { select: { id: true, name: true } },
                    city: { select: { id: true, name: true } },
                    client_id: true,
                    agent_id: true,
                    advisor_id: true,
                    seller_type: true,
                    tracking_code: true,
                    sale_price: true,
                    deposit_price: true,
                    rent_price: true,
                    number_of_rooms: true,
                    max_capicity: true,
                    created_at: true,
                    area: true,
                    media: {
                        where: {
                            file_type: RealEstateAdMediaType_1.default.image,
                            priority: RealEstateAdMediaTypePriorities_1.default.primary
                        },
                        select: {
                            id: true,
                            file_name: true,
                            file_type: true,
                            sort_number: true,
                            priority: true
                        }
                    }
                } }));
            if (!result) {
                return { status: 400 };
            }
            result = await Promise.all(result.map(async (item) => {
                return await this.getAdOwnerInfo(item);
            }));
            return {
                status: 200,
                result,
                metadata: this.makeMetadata(Number(query.page), Number(query.per_page), Number(total))
            };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async findOneByID(item_id) {
        return await this.prismaService.realEstateAds.findFirst({
            where: { id: Number(item_id) },
            select: { id: true, title: true }
        });
    }
    async getAdOwnerInfo(ad) {
        const adInfo = ad;
        adInfo.owner_info = adInfo.owner_info;
        if (ad.seller_type === RealEstateAdSellerTypes_1.default.real_estate_agent) {
            const agentInfo = await this.prismaService.realEstateAgents.findFirst({
                where: { id: ad.agent_id },
                select: { name: true, avatar: true }
            });
            adInfo.owner_info = {
                name: agentInfo.name,
                avatar: agentInfo.avatar
                    ? `${process.env.APP_CONTENT_PATH}/estate-agents/avatars/${agentInfo.avatar}`
                    : ""
            };
        }
        else if (ad.seller_type === RealEstateAdSellerTypes_1.default.advisor) {
            const advisorInfo = await this.prismaService.realEstateAdvisors.findFirst({
                where: { id: ad.advisor_id },
                select: {
                    real_estate_agent: { select: { name: true, avatar: true } }
                }
            });
            adInfo.owner_info = {
                name: advisorInfo.real_estate_agent.name,
                avatar: advisorInfo.real_estate_agent.avatar
                    ? `${process.env.APP_CONTENT_PATH}/estate-agents/avatars/${advisorInfo.real_estate_agent.avatar}`
                    : ""
            };
        }
        return adInfo;
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
RealEstateAdsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [RealEstateAdsPostgresqlRepository_1.default,
        users_service_1.UsersService,
        prisma_service_1.PrismaService,
        mailerService_1.default,
        real_estate_ads_service_app_service_1.RealEstateAdsServiceApp])
], RealEstateAdsService);
exports.RealEstateAdsService = RealEstateAdsService;
//# sourceMappingURL=real-estate-ads.service.js.map