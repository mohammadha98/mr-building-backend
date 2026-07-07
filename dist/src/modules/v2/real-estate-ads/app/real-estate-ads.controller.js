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
exports.RealEstateAdsSettingsController = void 0;
const common_1 = require("@nestjs/common");
const real_estate_ads_service_app_service_1 = require("./real-estate-ads-service-app.service");
const create_real_estate_ads_dto_1 = require("./dto/create-real-estate-ads.dto");
const swagger_1 = require("@nestjs/swagger");
const forbiddenErrorHandler_1 = require("../../../services/httpResponseHandler/forbiddenErrorHandler");
const httpResponsehandler_1 = require("../../../services/httpResponseHandler/httpResponsehandler");
const get_details_real_estate_ads_dto_1 = require("./dto/get-details-real-estate-ads.dto");
const Transformer_1 = require("./Transformer");
const path_1 = require("path");
const crypto_1 = require("crypto");
const upload_file_real_estate_ads_dto_1 = require("./dto/upload-file-real-estate-ads.dto");
const nestjs_form_data_1 = require("nestjs-form-data");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const badRequestErrorHandler_1 = require("../../../services/httpResponseHandler/badRequestErrorHandler");
const BadRequestSchema_1 = require("../../../../commons/contracts/swaggerDefinations/BadRequestSchema");
const get_real_estate_ads_dto_1 = require("./dto/get-real-estate-ads.dto");
const filtered_dto_1 = require("./dto/filtered.dto");
const delete_real_estate_ads_dto_1 = require("./dto/delete-real-estate-ads.dto");
const delete_media_item_dto_1 = require("./dto/delete-media-item.dto");
const update_real_estate_ads_dto_1 = require("./dto/update-real-estate-ads.dto");
const change_cover_media_item_dto_1 = require("./dto/change-cover-media-item.dto");
const get_public_ads_1 = require("./dto/get-public-ads");
const change_status_ad_dto_1 = require("./dto/change-status-ad.dto");
const swagger_consumes_1 = require("../../../../commons/enums/swagger.consumes");
const save_ad_settings_1 = require("./dto/save-ad-settings");
const TokenAuthGuardClient_1 = require("../../jwt-auth/TokenAuthGuardClient");
const save_suspicious_behavior_ad_1 = require("./dto/save-suspicious-behavior-ad");
const estimate_price_ad_1 = require("./dto/estimate-price-ad");
let RealEstateAdsSettingsController = class RealEstateAdsSettingsController {
    constructor(realEstateAdsService, responseHandler, realEstateAdsTransformer) {
        this.realEstateAdsService = realEstateAdsService;
        this.responseHandler = responseHandler;
        this.realEstateAdsTransformer = realEstateAdsTransformer;
    }
    async create(body, req, res) {
        body.client_id = req.client.id;
        console.log("*** CreateRealEstateAdDto ***");
        console.log({ body });
        const result = await this.realEstateAdsService.storeAd(body);
        if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new common_1.InternalServerErrorException();
        }
        return this.responseHandler.send(res, 201, "آگهی جدید ثبت شد. بعد بررسی و تایید منتشر خواهد شد.", { id: result.result.id });
    }
    async update(body, req, res) {
        body.client_id = req.client.id;
        console.log("*** UpdateRealEstateAdDto ***");
        console.log({ body });
        const result = await this.realEstateAdsService.update(body);
        if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new common_1.InternalServerErrorException();
        }
        return this.responseHandler.send(res, 201, "ویرایش آگهی انجام شد. بعد از تایید منتشر میشود.", { id: result.result.id });
    }
    async findAds(query, req, res) {
        query.client_id = req.client.id;
        const result = await this.realEstateAdsService.findAds(query);
        if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new common_1.InternalServerErrorException();
        }
        return this.responseHandler.send(res, 200, "لیست آگهی ها در دسترس است.", {
            data: result.result,
            metadata: result.metadata,
        });
    }
    async filteredAds(body, req, res) {
        body.client_id = req.client.id;
        console.log("*** filteredAds ***");
        console.log({ body });
        const result = await this.realEstateAdsService.filteredAds(body);
        if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new common_1.InternalServerErrorException();
        }
        const transformer = this.realEstateAdsTransformer.collectionAdList(result.result);
        return this.responseHandler.send(res, 200, "آگهی های فیلتر شده در دسترس است.", {
            data: transformer,
            metadata: result.metadata,
        });
    }
    async findDetails(query, req) {
        query.client_id = req.client.id;
        console.log({ query });
        return this.realEstateAdsService.findDetails(query);
    }
    async UploadTempFile(body, file, req, res) {
        console.log("*** UploadFile: RealEstate Ad ***");
        console.log({ file });
        body.file = file.filename;
        console.log({ body });
        return await this.realEstateAdsService.UploadFile(body, res);
    }
    async removeAd(body, req, res) {
        body.client_id = req.client.id;
        console.log("*** Remove Ad ***");
        console.log(body);
        const result = await this.realEstateAdsService.removeAd(body);
        if (result.status === 400) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("فایل موردنظر موجود نمیباشد.");
        }
        else if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new common_1.InternalServerErrorException();
        }
        return this.responseHandler.send(res, 200, "آگهی موردنظر با موفقیت حذف شد.");
    }
    async removeAdFile(query, req, res) {
        query.client_id = req.client.id;
        console.log("*** removeAdFile ***");
        console.log(query);
        const result = await this.realEstateAdsService.removeAdFile(query);
        if (result.status === 400) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("فایل موردنظر موجود نمیباشد.");
        }
        else if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new common_1.InternalServerErrorException();
        }
        return this.responseHandler.send(res, 200, "فایل موردنظر با موفقیت حذف شد.");
    }
    async changeCover(body, req, res) {
        body.client_id = req.client.id;
        const result = await this.realEstateAdsService.changeCover(body);
        if (result.status === 400) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("آگهی موردنظر موجود نمیباشد.");
        }
        else if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new common_1.InternalServerErrorException();
        }
        return this.responseHandler.send(res, 200, "کاور با موفقیت انتخاب شد.");
    }
    async changeStatus(body, req, res) {
        body.user_id = req.client.id;
        console.log("*** changeStatus Ad: agentADMIN ***");
        console.log(body);
        const result = await this.realEstateAdsService.changeStatus(body);
        if (result.status === 400) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("خطا. آیتم موردنظر موجود نمیباشد.");
        }
        else if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new common_1.InternalServerErrorException();
        }
        return this.responseHandler.send(res, 201, "وضعیت آگهی با موفقیت تغییر کرد.");
    }
    async GetPublicAdsDto(body, req, res) {
        body.client_id = req.client.id;
        console.log("*** GetPublicAdsDto ***");
        console.log(body);
        const result = await this.realEstateAdsService.getPublicAds(body);
        if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new common_1.InternalServerErrorException();
        }
        return this.responseHandler.send(res, 200, "لیست آگهی های عمومی در دسترس است.", {
            data: result.result,
            metadata: result.metadata,
        });
    }
    async getCategories(req, res) {
        console.log("*** getCategories Ad: APP ***");
        const result = await this.realEstateAdsService.getCategories();
        if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new common_1.InternalServerErrorException();
        }
        const transformer = this.realEstateAdsTransformer.assortmentCollection(result.result);
        return this.responseHandler.send(res, 200, "لیست دیته بندی ها در دسترس است.", transformer);
    }
    async getReasonsList() {
        console.log("*** rejected reason list: App ***");
        return await this.realEstateAdsService.getRejectedReasonList();
    }
    async getDeletedReasonList() {
        console.log("*** deleted reason list: App ***");
        return await this.realEstateAdsService.getDeletedReasonList();
    }
    async getSuspiciousBehavior() {
        console.log("*** getSuspiciousBehavior: App ***");
        return await this.realEstateAdsService.getSuspiciousBehavior();
    }
    async saveNewSuspiciousBehavior(body, req) {
        console.log("*** save New Suspicious Behavior: App ***");
        body.client_id = req.client.id;
        console.log(body);
        return await this.realEstateAdsService.saveNewSuspiciousBehavior(body);
    }
    async storeEstimatePriceForAd(body, req) {
        console.log("*** store Estimate Price For Ad: App ***");
        body.client_id = req.client.id;
        console.log(body);
        return await this.realEstateAdsService.storeEstimatePriceForAd(body);
    }
    async updateExpiredAd(body, req) {
        console.log("*** update Expired Ad: App ***");
        body.client_id = req.client.id;
        console.log(body);
        return await this.realEstateAdsService.updateExpiredAd(body);
    }
    async saveAdSettingsForNotification(body) {
        console.log("*** Save Ad Settings For Notification ***");
        console.log({ body });
        return await this.realEstateAdsService.saveFilteredNotificationForAds(body);
    }
    async getAdSettingsForNotification() {
        console.log("*** Get Ad Settings For Notification ***");
        return await this.realEstateAdsService.getFilteredNotificationForAds();
    }
    async deleteAdSettingsForNotification(item_id) {
        console.log("*** Delete Ad Settings For Notification ***");
        return await this.realEstateAdsService.deleteFilteredNotificationForAds(item_id);
    }
    testFN() { }
};
__decorate([
    (0, swagger_1.ApiCreatedResponse)({
        description: "آگهی جدید ثبت شد. بعد بررسی و تایید منتشر خواهد شد.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 201 },
                message: {
                    type: "string",
                    example: "آگهی جدید ثبت شد. بعد بررسی و تایید منتشر خواهد شد.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 1 },
                    },
                },
            },
        },
    }),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: "ایجاد آگهی" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_real_estate_ads_dto_1.CreateRealEstateAdDto, Object, Object]),
    __metadata("design:returntype", Promise)
], RealEstateAdsSettingsController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiCreatedResponse)({
        description: "ویرایش آگهی انجام شد. بعد از تایید منتشر میشود.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 201 },
                message: {
                    type: "string",
                    example: "ویرایش آگهی انجام شد. بعد از تایید منتشر میشود.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 1 },
                    },
                },
            },
        },
    }),
    (0, common_1.Patch)(),
    (0, swagger_1.ApiOperation)({ summary: "ویرایش آگهی" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_real_estate_ads_dto_1.UpdateRealEstateAdDto, Object, Object]),
    __metadata("design:returntype", Promise)
], RealEstateAdsSettingsController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "لیست آگهی ها در دسترس است.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "لیست آگهی ها در دسترس است.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {
                        data: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    id: { type: "integer", example: 1 },
                                    category: {
                                        type: "object",
                                        properties: {
                                            id: { type: "integer", example: 1 },
                                            title: { type: "String" },
                                            type: {
                                                type: "String",
                                                example: "sale, rent, participation, short_rent",
                                            },
                                        },
                                    },
                                    sub_category: {
                                        type: "object",
                                        properties: {
                                            id: { type: "integer", example: 1 },
                                            title: { type: "String" },
                                        },
                                    },
                                    sale_price: { type: "String" },
                                    deposit_price: { type: "String" },
                                    rent_price: { type: "String" },
                                    number_of_rooms: { type: "String" },
                                    max_capicity: { type: "String" },
                                    normal_days_price: { type: "String" },
                                    title: { type: "String" },
                                    status: {
                                        type: "String",
                                        example: "pending, rejected, approved, inactive, expired",
                                    },
                                    province: {
                                        type: "object",
                                        properties: {
                                            id: { type: "string" },
                                            name: { type: "string" },
                                        },
                                    },
                                    city: {
                                        type: "object",
                                        properties: {
                                            id: { type: "string" },
                                            name: { type: "string" },
                                        },
                                    },
                                    area: { type: "String" },
                                    seller_type: { type: "String" },
                                    owner_info: {
                                        type: "object",
                                        properties: {
                                            name: { type: "string" },
                                            avatar: { type: "string" },
                                        },
                                    },
                                    media: {
                                        type: "object",
                                        properties: {
                                            id: { type: "number", example: 1 },
                                            file_name: { type: "string" },
                                            file_type: { type: "string", example: "image" },
                                            file_url: { type: "string" },
                                            sort_number: { type: "string" },
                                            priority: { type: "string", example: "primary" },
                                        },
                                    },
                                },
                            },
                        },
                        metadata: {
                            type: "object",
                            properties: {
                                page: { type: "integer", example: 1 },
                                total_page: { type: "integer", example: 1 },
                                per_page: { type: "integer", example: 1 },
                                next: { type: "boolean", example: true },
                                back: { type: "boolean", example: false },
                            },
                        },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "دریافت آگهی ها" }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_real_estate_ads_dto_1.GetRealEstateAdDto, Object, Object]),
    __metadata("design:returntype", Promise)
], RealEstateAdsSettingsController.prototype, "findAds", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "آگهی های فیلتر شده در دسترس است.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "آگهی های فیلتر شده در دسترس است.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {
                        data: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    id: { type: "integer", example: 1 },
                                    category: {
                                        type: "object",
                                        properties: {
                                            id: { type: "integer", example: 1 },
                                            title: { type: "String" },
                                            type: {
                                                type: "String",
                                                example: "sale, rent, participation, short_rent",
                                            },
                                        },
                                    },
                                    sub_category: {
                                        type: "object",
                                        properties: {
                                            id: { type: "integer", example: 1 },
                                            title: { type: "String" },
                                        },
                                    },
                                    sale_price: { type: "String" },
                                    deposit_price: { type: "String" },
                                    rent_price: { type: "String" },
                                    number_of_rooms: { type: "String" },
                                    max_capicity: { type: "String" },
                                    normal_days_price: { type: "String" },
                                    title: { type: "String" },
                                    status: {
                                        type: "String",
                                        example: "pending, rejected, approved, inactive, expired",
                                    },
                                    province: {
                                        type: "object",
                                        properties: {
                                            id: { type: "string" },
                                            name: { type: "string" },
                                        },
                                    },
                                    city: {
                                        type: "object",
                                        properties: {
                                            id: { type: "string" },
                                            name: { type: "string" },
                                        },
                                    },
                                    area: { type: "String" },
                                    media: {
                                        type: "object",
                                        properties: {
                                            id: { type: "number", example: 1 },
                                            file_name: { type: "string" },
                                            file_type: { type: "string", example: "image" },
                                            file_url: { type: "string" },
                                            sort_number: { type: "string" },
                                            priority: { type: "string", example: "primary" },
                                        },
                                    },
                                },
                            },
                        },
                        metadata: {
                            type: "object",
                            properties: {
                                page: { type: "integer", example: 1 },
                                total_page: { type: "integer", example: 1 },
                                per_page: { type: "integer", example: 1 },
                                next: { type: "boolean", example: true },
                                back: { type: "boolean", example: false },
                            },
                        },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "فیلتر آگهی ها" }),
    (0, common_1.Post)("filter"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filtered_dto_1.FilteredDto, Object, Object]),
    __metadata("design:returntype", Promise)
], RealEstateAdsSettingsController.prototype, "filteredAds", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "جزییات آگهی درخواستی در دسترس است.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "جزییات آگهی درخواستی در دسترس است.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {
                        details: {
                            type: "object",
                            properties: {
                                id: { type: "integer", example: 1 },
                                tracking_code: { type: "String" },
                                seller_type: {
                                    type: "String",
                                    example: "individual || real_estate_agent || advisor",
                                },
                                owner_id: { type: "integer", example: 1 },
                                title: { type: "String" },
                                description: { type: "String" },
                                category: {
                                    type: "object",
                                    properties: {
                                        id: { type: "integer", example: 1 },
                                        title: { type: "String" },
                                        type: {
                                            type: "String",
                                            example: "sale, rent, participation, short_rent",
                                        },
                                    },
                                },
                                sub_category: {
                                    type: "object",
                                    properties: {
                                        id: { type: "integer", example: 1 },
                                        title: { type: "String" },
                                    },
                                },
                                sale_price: { type: "String" },
                                deposit_price: { type: "String" },
                                rent_price: { type: "String" },
                                number_of_rooms: { type: "String" },
                                max_capicity: { type: "String" },
                                size: { type: "integer" },
                                year_built: { type: "integer" },
                                normal_days_price: { type: "integer" },
                                weekend_price: { type: "integer" },
                                special_days_price: { type: "integer" },
                                cost_per_additional_person: { type: "integer" },
                                extra_people: { type: "integer" },
                                latitude: { type: "number" },
                                longitude: { type: "number" },
                                prepaid_price: { type: "String" },
                                agent_valuation_request: { type: "Boolean", example: false },
                                price_status: { type: "String", example: "fair, high, low" },
                                price_rating: { type: "number", example: "1-5" },
                                status: {
                                    type: "String",
                                    example: "pending, rejected, approved, inactive, expired",
                                },
                                province: {
                                    type: "object",
                                    properties: {
                                        id: { type: "string" },
                                        name: { type: "string" },
                                    },
                                },
                                city: {
                                    type: "object",
                                    properties: {
                                        id: { type: "string" },
                                        name: { type: "string" },
                                    },
                                },
                                area: { type: "String" },
                                owner_info: {
                                    type: "object",
                                    properties: {
                                        name: { type: "string" },
                                        avatar: { type: "string" },
                                    },
                                },
                                items: {
                                    type: "array",
                                    items: {
                                        properties: {
                                            id: { type: "number", example: 1 },
                                            item_id: { type: "number", example: 1 },
                                            field_type: { type: "string" },
                                            field_name: { type: "string" },
                                            value: { type: "string" },
                                            icon: { type: "string" },
                                        },
                                    },
                                },
                                media: {
                                    type: "array",
                                    items: {
                                        properties: {
                                            id: { type: "number", example: 1 },
                                            file_name: { type: "string" },
                                            file_type: { type: "string", example: "image, video" },
                                            file_url: { type: "string" },
                                            sort_number: { type: "string" },
                                            priority: { type: "string", example: "primary, normal" },
                                        },
                                    },
                                },
                                created_at: { type: "String" },
                            },
                        },
                        related: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    id: { type: "integer", example: 1 },
                                    category: {
                                        type: "object",
                                        properties: {
                                            id: { type: "integer", example: 1 },
                                            title: { type: "String" },
                                            type: {
                                                type: "String",
                                                example: "sale, rent, participation, short_rent",
                                            },
                                        },
                                    },
                                    sub_category: {
                                        type: "object",
                                        properties: {
                                            id: { type: "integer", example: 1 },
                                            title: { type: "String" },
                                        },
                                    },
                                    sale_price: { type: "String" },
                                    deposit_price: { type: "String" },
                                    rent_price: { type: "String" },
                                    number_of_rooms: { type: "String" },
                                    max_capicity: { type: "String" },
                                    normal_days_price: { type: "String" },
                                    title: { type: "String" },
                                    status: {
                                        type: "String",
                                        example: "pending, rejected, approved, inactive, expired",
                                    },
                                    province: {
                                        type: "object",
                                        properties: {
                                            id: { type: "string" },
                                            name: { type: "string" },
                                        },
                                    },
                                    city: {
                                        type: "object",
                                        properties: {
                                            id: { type: "string" },
                                            name: { type: "string" },
                                        },
                                    },
                                    area: { type: "String" },
                                    seller_type: { type: "String" },
                                    owner_info: {
                                        type: "object",
                                        properties: {
                                            name: { type: "string" },
                                            avatar: { type: "string" },
                                        },
                                    },
                                    media: {
                                        type: "object",
                                        properties: {
                                            id: { type: "number", example: 1 },
                                            file_name: { type: "string" },
                                            file_type: { type: "string", example: "image" },
                                            file_url: { type: "string" },
                                            sort_number: { type: "string" },
                                            priority: { type: "string", example: "primary" },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "جزییات آگهی" }),
    (0, common_1.Get)("details"),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_details_real_estate_ads_dto_1.GetDetailsRealEstateAdItemsDto, Object]),
    __metadata("design:returntype", Promise)
], RealEstateAdsSettingsController.prototype, "findDetails", null);
__decorate([
    (0, swagger_1.ApiCreatedResponse)({
        description: "فایل مورد نظر با موفقیت آپلود شد.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 201 },
                message: {
                    type: "string",
                    example: "فایل مورد نظر با موفقیت آپلود شد.",
                },
                error: { type: "string" },
                data: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: { type: "integer", example: 1 },
                            file_name: { type: "string" },
                            file_url: { type: "string" },
                            file_type: { type: "string", example: "image, video" },
                            priority: { type: "string", example: "primary, normal" },
                        },
                    },
                },
            },
        },
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file", {
        storage: (0, multer_1.diskStorage)({
            destination: "./public/contents/temp/files/",
            filename(req, file, callback) {
                const uniqueCode = (0, crypto_1.randomBytes)(3).toString("hex").toUpperCase();
                const extension = (0, path_1.parse)((0, path_1.join)(file.originalname)).ext;
                const filename = `${Date.now()}-${uniqueCode}${extension}`;
                callback(null, filename);
            },
        }),
    })),
    (0, swagger_1.ApiOperation)({ summary: "آپلود فایل" }),
    (0, common_1.Post)("file"),
    (0, swagger_1.ApiBody)({ type: upload_file_real_estate_ads_dto_1.UploadFileRealEstateAdItemsDto }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Request)()),
    __param(3, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [upload_file_real_estate_ads_dto_1.UploadFileRealEstateAdItemsDto, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], RealEstateAdsSettingsController.prototype, "UploadTempFile", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "حذف آگهی" }),
    (0, swagger_1.ApiConsumes)(swagger_consumes_1.SwaggerConsumes.Json),
    (0, common_1.Delete)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [delete_real_estate_ads_dto_1.DeleteRealEstateAdItemsDto, Object, Object]),
    __metadata("design:returntype", Promise)
], RealEstateAdsSettingsController.prototype, "removeAd", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "فایل موردنظر با موفقیت حذف شد.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "فایل موردنظر با موفقیت حذف شد.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {},
                },
            },
        },
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: "خطا. آیتم موردنظر موجود نمیباشد.",
        type: BadRequestSchema_1.default,
        schema: {
            $ref: (0, swagger_1.getSchemaPath)(BadRequestSchema_1.default),
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "حذف فایل " }),
    (0, common_1.Delete)("file"),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [delete_media_item_dto_1.DeleteRealEstateMediaItemDto, Object, Object]),
    __metadata("design:returntype", Promise)
], RealEstateAdsSettingsController.prototype, "removeAdFile", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "کاور با موفقیت انتخاب شد.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "کاور با موفقیت انتخاب شد.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {},
                },
            },
        },
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: "خطا. آیتم موردنظر موجود نمیباشد.",
        type: BadRequestSchema_1.default,
        schema: {
            $ref: (0, swagger_1.getSchemaPath)(BadRequestSchema_1.default),
        },
    }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, nestjs_form_data_1.FormDataRequest)(),
    (0, swagger_1.ApiOperation)({ summary: "تغییر کاور آگهی" }),
    (0, common_1.Post)("/change_cover"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [change_cover_media_item_dto_1.ChangeCoverMediaDto, Object, Object]),
    __metadata("design:returntype", Promise)
], RealEstateAdsSettingsController.prototype, "changeCover", null);
__decorate([
    (0, swagger_1.ApiCreatedResponse)({
        description: "وضعیت آگهی با موفقیت تغییر کرد.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 201 },
                message: {
                    type: "string",
                    example: "وضعیت آگهی با موفقیت تغییر کرد.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {},
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "تغییر وضعیت آگهی" }),
    (0, common_1.Post)("change-status"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [change_status_ad_dto_1.APP_ChangeStatusAdDto, Object, Object]),
    __metadata("design:returntype", Promise)
], RealEstateAdsSettingsController.prototype, "changeStatus", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "لیست آگهی ها در دسترس است.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "لیست آگهی ها در دسترس است.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {
                        data: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    id: { type: "integer", example: 1 },
                                    type: {
                                        type: "String",
                                        example: "sale, presell, collaboration, rent",
                                    },
                                    title: { type: "String" },
                                    sale_price: { type: "String" },
                                    deposit_price: { type: "String" },
                                    rent_price: { type: "String" },
                                    prepaid_price: { type: "String" },
                                    status: {
                                        type: "String",
                                        example: "pending, rejected, approved, inactive, expired",
                                    },
                                    province: {
                                        type: "object",
                                        properties: {
                                            id: { type: "string" },
                                            name: { type: "string" },
                                        },
                                    },
                                    city: {
                                        type: "object",
                                        properties: {
                                            id: { type: "string" },
                                            name: { type: "string" },
                                        },
                                    },
                                    area: { type: "String" },
                                    media: {
                                        type: "object",
                                        properties: {
                                            id: { type: "number", example: 1 },
                                            file_name: { type: "string" },
                                            file_type: { type: "string", example: "image" },
                                            file_url: { type: "string" },
                                            sort_number: { type: "string" },
                                            priority: { type: "string", example: "primary" },
                                        },
                                    },
                                },
                            },
                        },
                        metadata: {
                            type: "object",
                            properties: {
                                page: { type: "integer", example: 1 },
                                total_page: { type: "integer", example: 1 },
                                per_page: { type: "integer", example: 1 },
                                next: { type: "boolean", example: true },
                                back: { type: "boolean", example: false },
                            },
                        },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "دریافت آگهی های عمومی - اپراتورها" }),
    (0, common_1.Post)("/public"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_public_ads_1.GetPublicAdsDto, Object, Object]),
    __metadata("design:returntype", Promise)
], RealEstateAdsSettingsController.prototype, "GetPublicAdsDto", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "لیست دیته بندی ها در دسترس است.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "لیست دیته بندی ها در دسترس است.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {
                        data: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    id: { type: "integer", example: 1 },
                                    title: { type: "String" },
                                    items: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                id: { type: "integer", example: 1 },
                                                title: { type: "String" },
                                                form: {
                                                    type: "object",
                                                    properties: {
                                                        items: {
                                                            type: "array",
                                                            items: {
                                                                type: "object",
                                                                properties: {
                                                                    id: { type: "integer", example: 1 },
                                                                    field_name: {
                                                                        type: "String",
                                                                        example: "field_name",
                                                                    },
                                                                    type: {
                                                                        type: "String",
                                                                        example: "sale, presell, collaboration, rent",
                                                                    },
                                                                    field_type: {
                                                                        type: "String",
                                                                        example: "input_string, input_number, list, toggle  ",
                                                                    },
                                                                    values: {
                                                                        type: "array",
                                                                        items: { type: "string", properties: {} },
                                                                    },
                                                                    sort_number: { type: "integer", example: 1 },
                                                                    icon: {
                                                                        type: "String",
                                                                        example: "field_name",
                                                                    },
                                                                },
                                                            },
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        metadata: {
                            type: "object",
                            properties: {
                                page: { type: "integer", example: 1 },
                                total_page: { type: "integer", example: 1 },
                                per_page: { type: "integer", example: 1 },
                                next: { type: "boolean", example: true },
                                back: { type: "boolean", example: false },
                            },
                        },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "لیست دسته بندی" }),
    (0, common_1.Get)("/categories/list"),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RealEstateAdsSettingsController.prototype, "getCategories", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "لیست دلایل رد آگهی" }),
    (0, common_1.Get)("/reasons/list"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RealEstateAdsSettingsController.prototype, "getReasonsList", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "لیست دلایل حذف آگهی" }),
    (0, common_1.Get)("/reasons/deleted"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RealEstateAdsSettingsController.prototype, "getDeletedReasonList", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "لیست رفتار های مشکوک در آگهی" }),
    (0, common_1.Get)("/reasons/suspicious-behavior"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RealEstateAdsSettingsController.prototype, "getSuspiciousBehavior", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "ثبت رفتار مشکوک آگهی" }),
    (0, common_1.Post)("/reasons/suspicious-behavior"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [save_suspicious_behavior_ad_1.saveNewSuspiciousBehavior, Object]),
    __metadata("design:returntype", Promise)
], RealEstateAdsSettingsController.prototype, "saveNewSuspiciousBehavior", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "ثبت ارزیابی آگهی" }),
    (0, common_1.Post)("/reports/estimate-price"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [estimate_price_ad_1.EstimatePriceAd, Object]),
    __metadata("design:returntype", Promise)
], RealEstateAdsSettingsController.prototype, "storeEstimatePriceForAd", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "بروزرسانی تاریخ انقضا آگهی" }),
    (0, common_1.Post)("/update/expired-at"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_real_estate_ads_dto_1.UpdateExpiredAd, Object]),
    __metadata("design:returntype", Promise)
], RealEstateAdsSettingsController.prototype, "updateExpiredAd", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "ذخیره / ویرایش: تنظیمات نوتیف برای دریافت آگهی ها",
    }),
    (0, swagger_1.ApiConsumes)(swagger_consumes_1.SwaggerConsumes.Json),
    (0, common_1.Post)("/settings/notification"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [save_ad_settings_1.SaveAdSettingsDto]),
    __metadata("design:returntype", Promise)
], RealEstateAdsSettingsController.prototype, "saveAdSettingsForNotification", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "دریافت تنظیمات نوتیف برای دریافت آگهی ها" }),
    (0, common_1.Get)("/settings/notification"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RealEstateAdsSettingsController.prototype, "getAdSettingsForNotification", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "حذف تنظیمات نوتیف برای دریافت آگهی ها" }),
    (0, common_1.Delete)("/settings/notification/:item_id"),
    __param(0, (0, common_1.Param)("item_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RealEstateAdsSettingsController.prototype, "deleteAdSettingsForNotification", null);
__decorate([
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file", {
        storage: (0, multer_1.diskStorage)({
            destination: "./public/contents/real_estate_ads/",
            filename(req, file, callback) {
                const uniqueCode = (0, crypto_1.randomBytes)(3).toString("hex").toUpperCase();
                const extention = (0, path_1.parse)((0, path_1.join)(file.originalname)).ext;
                callback(null, `${Date.now()}-${uniqueCode}${extention}`);
            },
        }),
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RealEstateAdsSettingsController.prototype, "testFN", null);
RealEstateAdsSettingsController = __decorate([
    (0, common_1.UseGuards)(TokenAuthGuardClient_1.default),
    (0, swagger_1.ApiSecurity)("JWT-auth"),
    (0, swagger_1.ApiTags)("v2/app-real-estate-ads"),
    (0, common_1.Controller)("v2/app/real-estate-ads"),
    __metadata("design:paramtypes", [real_estate_ads_service_app_service_1.RealEstateAdsServiceApp,
        httpResponsehandler_1.HttpResponsehandler,
        Transformer_1.default])
], RealEstateAdsSettingsController);
exports.RealEstateAdsSettingsController = RealEstateAdsSettingsController;
//# sourceMappingURL=real-estate-ads.controller.js.map