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
exports.RealEstateAdsFormsController = void 0;
const common_1 = require("@nestjs/common");
const real_estate_ads_forms_service_1 = require("./real-estate-ads-forms.service");
const create_real_estate_ads_form_item_dto_1 = require("./dto/create-real-estate-ads-form-item.dto");
const update_real_estate_ads_forms_dto_1 = require("./dto/update-real-estate-ads-forms.dto");
const swagger_1 = require("@nestjs/swagger");
const forbiddenErrorHandler_1 = require("../../../services/httpResponseHandler/forbiddenErrorHandler");
const httpResponsehandler_1 = require("../../../services/httpResponseHandler/httpResponsehandler");
const get_real_estate_ads_forms_dto_1 = require("./dto/get-real-estate-ads-forms.dto");
const Transformer_1 = require("./Transformer");
const path_1 = require("path");
const crypto_1 = require("crypto");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const badRequestErrorHandler_1 = require("../../../services/httpResponseHandler/badRequestErrorHandler");
const nestjs_form_data_1 = require("nestjs-form-data");
const update_sort_items_real_estate_ads_forms_dto_1 = require("./dto/update-sort-items-real-estate-ads-forms.dto");
const CheckIconMiddleware_1 = require("./dto/CheckIconMiddleware ");
const AdminTokenAuthGuard_1 = require("../../jwt-auth/AdminTokenAuthGuard");
const create_real_estate_ads_form_dto_1 = require("./dto/create-real-estate-ads-form.dto");
const Pagination_dto_1 = require("../../../../commons/contracts/Pagination.dto");
const update_real_estate_ads_form_item_dto_1 = require("./dto/update-real-estate-ads-form-item.dto");
let RealEstateAdsFormsController = class RealEstateAdsFormsController {
    constructor(realEstateAdsFormsService, realEstateAdFormsTransformer, responseHandler) {
        this.realEstateAdsFormsService = realEstateAdsFormsService;
        this.realEstateAdFormsTransformer = realEstateAdFormsTransformer;
        this.responseHandler = responseHandler;
    }
    async createForm(body, req, res) {
        body.user_id = req.user.id;
        const result = await this.realEstateAdsFormsService.createNewForm(body);
        if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new common_1.InternalServerErrorException();
        }
        return this.responseHandler.send(res, 201, "فرم جدید با موفقیت ایجاد شد.", result.result);
    }
    async findForms(query, req, res) {
        query.user_id = req.user.id;
        console.log("findForms: ADMIN");
        console.log({ query });
        const result = await this.realEstateAdsFormsService.findForms(query);
        const transformer = this.realEstateAdFormsTransformer.collection(result.result);
        if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new common_1.InternalServerErrorException();
        }
        return this.responseHandler.send(res, 200, "آیتم های فرم آگهی املاک در دسترس است.", {
            data: transformer,
            metadata: result.metadata,
        });
    }
    async updateForm(body, req, res) {
        body.user_id = req.user.id;
        console.log("updateForm");
        console.log(body);
        const result = await this.realEstateAdsFormsService.updateForm(body);
        if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new common_1.InternalServerErrorException();
        }
        return this.responseHandler.send(res, 200, "ویرایش با موفقیت انجام شد");
    }
    async removeForm(form_id, req, res) {
        const result = await this.realEstateAdsFormsService.removeForm(form_id);
        if (result.status === 400) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("خطا. آیتم موردنظر موجود نمیباشد.");
        }
        else if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new common_1.InternalServerErrorException();
        }
        return this.responseHandler.send(res, 200, "فرم موردنظر با موفقیت حذف شد.");
    }
    async saveItem(body, icon, req, res) {
        body.user_id = req.user.id;
        body.icon = icon.filename;
        console.log("saveItemForm: ADMIN");
        console.log({ body });
        const result = await this.realEstateAdsFormsService.saveItem(body);
        const transform = this.realEstateAdFormsTransformer.transformItem(result.result);
        if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new common_1.InternalServerErrorException();
        }
        return this.responseHandler.send(res, 201, "آیتم جدید با موفقیت ذخیره شد.", transform);
    }
    async findItems(query, req, res) {
        query.client_id = req.user.id;
        console.log("findItemsForm: ADMIN");
        console.log({ query });
        const result = await this.realEstateAdsFormsService.findItems(query);
        const transformer = this.realEstateAdFormsTransformer.collectionItem(result.result);
        if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new common_1.InternalServerErrorException();
        }
        return this.responseHandler.send(res, 200, "آیتم های فرم آگهی املاک در دسترس است.", transformer);
    }
    async removeItem(item_id, req, res) {
        console.log("removeItemForm: ADMIN");
        console.log(item_id);
        const result = await this.realEstateAdsFormsService.removeItem(item_id);
        if (result.status === 400) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("خطا. آیتم موردنظر موجود نمیباشد.");
        }
        else if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new common_1.InternalServerErrorException();
        }
        return this.responseHandler.send(res, 200, "آیتم موردنظر با موفقیت حذف شد.");
    }
    async updateItem(body, icon, req, res) {
        body.user_id = req.user.id;
        body.icon = icon ? icon.filename : null;
        console.log("updateItemForm: ADMIN");
        console.log(body);
        const result = await this.realEstateAdsFormsService.updateItem(body);
        const transform = this.realEstateAdFormsTransformer.transformItem(result.result);
        if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new common_1.InternalServerErrorException();
        }
        return this.responseHandler.send(res, 200, "ویرایش با موفقیت انجام شد", transform);
    }
    async updateDraggableItems(body, req, res) {
        body.user_id = req.user.id;
        console.log("updateDraggableItems");
        console.log(body);
        const result = await this.realEstateAdsFormsService.updateDraggableItems(body);
        if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new common_1.InternalServerErrorException();
        }
        return this.responseHandler.send(res, 200, "آیتم موردنظر با موفقیت حذف شد.");
    }
};
__decorate([
    (0, swagger_1.ApiCreatedResponse)({
        description: "فرم جدید با موفقیت ایجاد شد.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 201 },
                message: {
                    type: "string",
                    example: "فرم جدید با موفقیت ایجاد شد.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {
                        id: { type: "string" },
                        title: { type: "string" },
                        description: { type: "string" },
                    },
                },
            },
        },
    }),
    (0, common_1.Post)(),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, nestjs_form_data_1.FormDataRequest)(),
    (0, swagger_1.ApiOperation)({ summary: "ایجاد فرم" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_real_estate_ads_form_dto_1.CreateRealEstateAdFormsDto, Object, Object]),
    __metadata("design:returntype", Promise)
], RealEstateAdsFormsController.prototype, "createForm", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "لیست فرم ها در دسترس است.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "لیست فرم ها در دسترس است.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {
                        data: {
                            type: "array",
                            items: {
                                properties: {
                                    id: { type: "integer", example: 1 },
                                    title: { type: "string" },
                                    description: { type: "string" },
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
    (0, swagger_1.ApiOperation)({ summary: "دریافت فرم ها" }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Pagination_dto_1.PaginationDto, Object, Object]),
    __metadata("design:returntype", Promise)
], RealEstateAdsFormsController.prototype, "findForms", null);
__decorate([
    (0, common_1.Patch)(),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, nestjs_form_data_1.FormDataRequest)(),
    (0, swagger_1.ApiOperation)({ summary: "بروزرسانی فرم" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_real_estate_ads_forms_dto_1.UpdateRealEstateAdsFormsDto, Object, Object]),
    __metadata("design:returntype", Promise)
], RealEstateAdsFormsController.prototype, "updateForm", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "حذف فرم" }),
    (0, common_1.Delete)(":form_id"),
    __param(0, (0, common_1.Param)("form_id")),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], RealEstateAdsFormsController.prototype, "removeForm", null);
__decorate([
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("icon", {
        storage: (0, multer_1.diskStorage)({
            destination: "./public/contents/real_estate_ad_forms/icons",
            filename(req, file, callback) {
                const uniqueCode = (0, crypto_1.randomBytes)(3).toString("hex").toUpperCase();
                const extention = (0, path_1.parse)((0, path_1.join)(file.originalname)).ext;
                callback(null, `${Date.now()}-${uniqueCode}${extention}`);
            },
        }),
    })),
    (0, common_1.Post)("/items"),
    (0, swagger_1.ApiBody)({ type: create_real_estate_ads_form_item_dto_1.CreateRealEstateAdFormsItemsDto }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, swagger_1.ApiOperation)({ summary: "ذخیره آیتم جدید" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Request)()),
    __param(3, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_real_estate_ads_form_item_dto_1.CreateRealEstateAdFormsItemsDto, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], RealEstateAdsFormsController.prototype, "saveItem", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "دریافت آیتم های فرم" }),
    (0, common_1.Get)("items"),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_real_estate_ads_forms_dto_1.GetRealEstateAdFormsItemsDto, Object, Object]),
    __metadata("design:returntype", Promise)
], RealEstateAdsFormsController.prototype, "findItems", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "حذف آیتم" }),
    (0, common_1.Delete)("/items/:item_id"),
    __param(0, (0, common_1.Param)("item_id")),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], RealEstateAdsFormsController.prototype, "removeItem", null);
__decorate([
    (0, common_1.Patch)("/items"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("icon", {
        storage: (0, multer_1.diskStorage)({
            destination: "./public/contents/real_estate_ad_forms/icons",
            filename(req, file, callback) {
                const uniqueCode = (0, crypto_1.randomBytes)(3).toString("hex").toUpperCase();
                const extention = (0, path_1.parse)((0, path_1.join)(file.originalname)).ext;
                callback(null, `${Date.now()}-${uniqueCode}${extention}`);
            },
        }),
    }), CheckIconMiddleware_1.CheckIconMiddleware),
    (0, swagger_1.ApiBody)({ type: update_real_estate_ads_form_item_dto_1.UpdateRealEstateAdFormsItemsDto }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, swagger_1.ApiOperation)({ summary: "بروزرسانی آیتم" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)(new common_1.ParseFilePipe({ fileIsRequired: false }))),
    __param(2, (0, common_1.Request)()),
    __param(3, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_real_estate_ads_form_item_dto_1.UpdateRealEstateAdFormsItemsDto, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], RealEstateAdsFormsController.prototype, "updateItem", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "ذخیره جابجایی آیتم ها" }),
    (0, common_1.Post)("change_priority"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_sort_items_real_estate_ads_forms_dto_1.UpdateSortItemsRealEstateAdsFormsDto, Object, Object]),
    __metadata("design:returntype", Promise)
], RealEstateAdsFormsController.prototype, "updateDraggableItems", null);
RealEstateAdsFormsController = __decorate([
    (0, common_1.UseGuards)(AdminTokenAuthGuard_1.default),
    (0, swagger_1.ApiSecurity)("JWT-auth"),
    (0, swagger_1.ApiTags)("v2/admin-real-estate-ads-forms"),
    (0, common_1.Controller)("v2/admin/real-estate-ads-forms"),
    __metadata("design:paramtypes", [real_estate_ads_forms_service_1.RealEstateAdsFormsService,
        Transformer_1.default,
        httpResponsehandler_1.HttpResponsehandler])
], RealEstateAdsFormsController);
exports.RealEstateAdsFormsController = RealEstateAdsFormsController;
//# sourceMappingURL=real-estate-ads-forms.controller.js.map