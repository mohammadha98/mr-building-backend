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
const real_estate_ads_service_1 = require("./real-estate-ads.service");
const swagger_1 = require("@nestjs/swagger");
const forbiddenErrorHandler_1 = require("../../../services/httpResponseHandler/forbiddenErrorHandler");
const httpResponsehandler_1 = require("../../../services/httpResponseHandler/httpResponsehandler");
const Transformer_1 = require("./Transformer");
const nestjs_form_data_1 = require("nestjs-form-data");
const badRequestErrorHandler_1 = require("../../../services/httpResponseHandler/badRequestErrorHandler");
const get_real_estate_ads_dto_1 = require("./dto/get-real-estate-ads.dto");
const change_status_ad_dto_1 = require("./dto/change-status-ad.dto");
const AdminTokenAuthGuard_1 = require("../../jwt-auth/AdminTokenAuthGuard");
const Pagination_dto_1 = require("../../../../commons/contracts/Pagination.dto");
const update_sub_category_dto_1 = require("./dto/update-sub-category-dto");
const create_ad_category_dto_1 = require("./dto/create-ad-category-dto");
const saveReasonsForRejectingAds_dto_1 = require("./dto/saveReasonsForRejectingAds-dto");
const swagger_consumes_1 = require("../../../../commons/enums/swagger.consumes");
const warning_signs_before_transaction_dto_1 = require("./dto/warning-signs-before-transaction-dto");
const get_reasons_ad_dto_1 = require("./dto/get-reasons-ad.dto");
let RealEstateAdsSettingsController = class RealEstateAdsSettingsController {
    constructor(realEstateAdsService, responseHandler, realEstateAdsTransformer) {
        this.realEstateAdsService = realEstateAdsService;
        this.responseHandler = responseHandler;
        this.realEstateAdsTransformer = realEstateAdsTransformer;
    }
    async findAds(query, req, res) {
        query.user_id = req.user.id;
        console.log(query.status);
        console.log("ip_address: ", req.ip_address);
        const result = await this.realEstateAdsService.findAds(query);
        if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new common_1.InternalServerErrorException();
        }
        const transformer = this.realEstateAdsTransformer.collectionAdList(result.result);
        return this.responseHandler.send(res, 200, "لیست آگهی ها در دسترس است.", {
            data: transformer,
            metadata: result.metadata,
        });
    }
    async findDetails(tracking_code, req, res) {
        console.log("*** findDetails AD ADMIN ***");
        console.log({ tracking_code });
        const result = await this.realEstateAdsService.findDetails(tracking_code);
        if (result.status === 400) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("خطا. آیتم موردنظر موجود نمیباشد.");
        }
        else if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new common_1.InternalServerErrorException();
        }
        const transformer = this.realEstateAdsTransformer.transformDetails(result.result);
        return this.responseHandler.send(res, 200, "جزییات آگهی درخواستی در دسترس است.", transformer);
    }
    async changeStatus(body, req, res) {
        body.user_id = req.user.id;
        console.log("*** changeStatus Ad: ADMIN ***");
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
    async saveCategory(body, req, res) {
        body.user_id = req.user.id;
        console.log("*** saveAssortment Ad: ADMIN ***");
        console.log(body);
        const result = await this.realEstateAdsService.saveCategory(body);
        if (result.status === 400) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("خطا. آیتم موردنظر موجود نمیباشد.");
        }
        else if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new common_1.InternalServerErrorException();
        }
        return this.responseHandler.send(res, 201, "عملیات با موفقیت انجام شد");
    }
    async getAssortments(body, req, res) {
        body.user_id = req.user.id;
        console.log("*** getAssortments Ad: ADMIN ***");
        console.log(body);
        const result = await this.realEstateAdsService.getCategorys(body);
        if (result.status === 500) {
            throw new common_1.InternalServerErrorException();
        }
        const transformer = this.realEstateAdsTransformer.assortmentCollection(result.result);
        return this.responseHandler.send(res, 200, "لیست دیته بندی ها در دسترس است.", {
            data: transformer,
            metadata: result.metadata,
        });
    }
    async deleteMainCategory(item_id, req, res) {
        console.log("*** deleteAssortments Ad: ADMIN ***");
        console.log(item_id);
        const result = await this.realEstateAdsService.deleteMainCategory(item_id);
        if (result.status === 400) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("خطا. آیتم موردنظر وجود ندارد.");
        }
        else if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new common_1.InternalServerErrorException();
        }
        return this.responseHandler.send(res, 200, "عملیات با موفقیت انجام شد.");
    }
    async deleteSubCategory(item_id, req, res) {
        console.log("*** deleteSubAssortment Ad: ADMIN ***");
        console.log(item_id);
        const result = await this.realEstateAdsService.deleteSubCategory(item_id);
        if (result.status === 400) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("خطا. آیتم موردنظر وجود ندارد.");
        }
        else if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new common_1.InternalServerErrorException();
        }
        return this.responseHandler.send(res, 200, "عملیات با موفقیت انجام شد.");
    }
    async updateSubCategory(body, req, res) {
        console.log("*** updateSubAssortment Ad: ADMIN ***");
        console.log({ body });
        const result = await this.realEstateAdsService.updateSubCategory(body);
        if (result.status === 400) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("خطا. آیتم موردنظر وجود ندارد.");
        }
        else if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new common_1.InternalServerErrorException();
        }
        return this.responseHandler.send(res, 200, "عملیات با موفقیت انجام شد.");
    }
    async saveReasonsForRejectingAds(body, req, res) {
        body.user_id = req.user.id;
        console.log("*** saveReasonsForRejectingAdsDto Ad: ADMIN ***");
        console.log({ body });
        const result = await this.realEstateAdsService.saveReasonsForRejectingAds(body);
        if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new common_1.InternalServerErrorException();
        }
        const transformer = result.result;
        return this.responseHandler.send(res, 201, "عملیات با موفقیت انجام شد.", transformer);
    }
    async deleteReasonsForRejectingAds(item_id, req, res) {
        console.log("*** deleteReasonsForRejectingAds Ad: ADMIN ***");
        console.log({ item_id });
        const result = await this.realEstateAdsService.deleteReasonsForRejectingAds(item_id);
        if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new common_1.InternalServerErrorException();
        }
        return this.responseHandler.send(res, 200, "عملیات با موفقیت انجام شد.");
    }
    async getReasonsList(query, req, res) {
        console.log("*** get Reasons List Ad: ADMIN ***");
        console.log({ query });
        const result = await this.realEstateAdsService.getReasonsList(query);
        if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new common_1.InternalServerErrorException();
        }
        return this.responseHandler.send(res, 200, "عملیات با موفقیت انجام شد.", {
            data: result.result,
            metadata: result.metadata,
        });
    }
    async SaveWarningSingBeforeTransaction(body) {
        console.log("*** Save WarningSingBeforeTransaction: ADMIN ***");
        console.log({ body });
        return this.realEstateAdsService.SaveWarningSingBeforeTransaction(body);
    }
    async GetWarningSingBeforeTransaction() {
        console.log("*** Get WarningSingBeforeTransaction: ADMIN ***");
        return this.realEstateAdsService.GetWarningSingBeforeTransaction();
    }
    async deleteAd(id) {
        console.log("*** Delete Ad: ADMIN ***");
        return this.realEstateAdsService.deleteAd(+id);
    }
};
__decorate([
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
    (0, swagger_1.ApiOperation)({ summary: "جزییات آگهی" }),
    (0, common_1.Get)("/:tracking_code"),
    __param(0, (0, common_1.Param)("tracking_code")),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], RealEstateAdsSettingsController.prototype, "findDetails", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "تغییر وضعیت آگهی" }),
    (0, common_1.Post)("change-status"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [change_status_ad_dto_1.Admin_ChangeStatusAdDto, Object, Object]),
    __metadata("design:returntype", Promise)
], RealEstateAdsSettingsController.prototype, "changeStatus", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "ایجاد / ویرایش دسته بندی و زیردسته" }),
    (0, common_1.Post)("/category"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_ad_category_dto_1.CreateAdCategoryDto, Object, Object]),
    __metadata("design:returntype", Promise)
], RealEstateAdsSettingsController.prototype, "saveCategory", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "لیست دسته بندی" }),
    (0, common_1.Get)("/category/list"),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Pagination_dto_1.PaginationDto, Object, Object]),
    __metadata("design:returntype", Promise)
], RealEstateAdsSettingsController.prototype, "getAssortments", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "حذف دسته بندی" }),
    (0, common_1.Delete)("/category/:item_id"),
    __param(0, (0, common_1.Param)("item_id")),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], RealEstateAdsSettingsController.prototype, "deleteMainCategory", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "حذف زیر دسته" }),
    (0, common_1.Delete)("/category/sub/:item_id"),
    __param(0, (0, common_1.Param)("item_id")),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], RealEstateAdsSettingsController.prototype, "deleteSubCategory", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "ویرایش زیر دسته" }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, nestjs_form_data_1.FormDataRequest)(),
    (0, common_1.Patch)("/category/sub"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_sub_category_dto_1.UpdateSubCategoryDto, Object, Object]),
    __metadata("design:returntype", Promise)
], RealEstateAdsSettingsController.prototype, "updateSubCategory", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: " ایجاد / ویرایش دلیل آگهی" }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, nestjs_form_data_1.FormDataRequest)(),
    (0, common_1.Post)("/reasons"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [saveReasonsForRejectingAds_dto_1.saveReasonsForRejectingAdsDto, Object, Object]),
    __metadata("design:returntype", Promise)
], RealEstateAdsSettingsController.prototype, "saveReasonsForRejectingAds", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "خذف دلیل آگهی" }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, nestjs_form_data_1.FormDataRequest)(),
    (0, common_1.Delete)("/reasons/:item_id"),
    __param(0, (0, common_1.Param)("item_id")),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], RealEstateAdsSettingsController.prototype, "deleteReasonsForRejectingAds", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "لیست دلایل آگهی" }),
    (0, common_1.Get)("/reasons/list"),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_reasons_ad_dto_1.GetReasonsAdDto, Object, Object]),
    __metadata("design:returntype", Promise)
], RealEstateAdsSettingsController.prototype, "getReasonsList", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "ذخیره زنگ خطرهای قبل از معامله" }),
    (0, swagger_1.ApiConsumes)(swagger_consumes_1.SwaggerConsumes.Json),
    (0, common_1.Post)("/warning-sing-before-transaction"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [warning_signs_before_transaction_dto_1.WarningSignsBeforeTransactionDto]),
    __metadata("design:returntype", Promise)
], RealEstateAdsSettingsController.prototype, "SaveWarningSingBeforeTransaction", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "دریافت زنگ خطرهای قبل از معامله" }),
    (0, common_1.Post)("/get-warning"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RealEstateAdsSettingsController.prototype, "GetWarningSingBeforeTransaction", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "حذف آگهی" }),
    (0, swagger_1.ApiConsumes)(swagger_consumes_1.SwaggerConsumes.Json),
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], RealEstateAdsSettingsController.prototype, "deleteAd", null);
RealEstateAdsSettingsController = __decorate([
    (0, common_1.UseGuards)(AdminTokenAuthGuard_1.default),
    (0, swagger_1.ApiSecurity)("JWT-auth"),
    (0, swagger_1.ApiTags)("v1/admin/real-estate-ads"),
    (0, common_1.Controller)("v1/admin/real-estate-ads"),
    __metadata("design:paramtypes", [real_estate_ads_service_1.RealEstateAdsService,
        httpResponsehandler_1.HttpResponsehandler,
        Transformer_1.default])
], RealEstateAdsSettingsController);
exports.RealEstateAdsSettingsController = RealEstateAdsSettingsController;
//# sourceMappingURL=real-estate-ads.controller.js.map