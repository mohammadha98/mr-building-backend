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
exports.SliderController = void 0;
const common_1 = require("@nestjs/common");
const slider_service_1 = require("./slider.service");
const create_slider_dto_1 = require("./dto/create-slider.dto");
const update_slider_dto_1 = require("./dto/update-slider.dto");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const swagger_1 = require("@nestjs/swagger");
const ForbiddenSchema_1 = require("../../../commons/contracts/swaggerDefinations/ForbiddenSchema");
const InternalServerErrorSchema_1 = require("../../../commons/contracts/swaggerDefinations/InternalServerErrorSchema");
const NotFoundSchema_1 = require("../../../commons/contracts/swaggerDefinations/NotFoundSchema");
const UnAuthorizedSchema_1 = require("../../../commons/contracts/swaggerDefinations/UnAuthorizedSchema");
const internalServerErrorHandler_1 = require("../../services/httpResponseHandler/internalServerErrorHandler");
const httpResponsehandler_1 = require("../../services/httpResponseHandler/httpResponsehandler");
const transformer_admin_1 = require("./contracts/transformer-admin");
const PaginationSchema_1 = require("../../../commons/contracts/PaginationSchema");
const check_file_middleware_1 = require("../../../middlewares/check-file.middleware");
const AdminTokenAuthGuard_1 = require("../jwt-auth/AdminTokenAuthGuard");
let SliderController = class SliderController {
    constructor(sliderService, responseHandler, sliderTransformer) {
        this.sliderService = sliderService;
        this.responseHandler = responseHandler;
        this.sliderTransformer = sliderTransformer;
    }
    async create(createSliderDto, thumbnail, req, res) {
        createSliderDto.thumbnail = thumbnail.filename;
        const newSlider = await this.sliderService.create(createSliderDto);
        if (!newSlider) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        const transformer = this.sliderTransformer.transform(newSlider);
        return this.responseHandler.send(res, 201, "دیتا با موفقیت ذخیره شد.", transformer);
    }
    async findAll(query, res) {
        query.page = query.page || 1;
        query.per_page = query.per_page || 1;
        const result = await this.sliderService.findAll(query);
        const sliders = this.sliderTransformer.collection(result.sliders);
        return this.responseHandler.send(res, 200, "لیست اسلایدر ها در دسترس است.", {
            data: sliders,
            metadata: result.metadata,
        });
    }
    async update(body, res, file) {
        body.file = file ? file.filename : null;
        console.log("*** Update Silder ***");
        console.log({ body });
        const result = await this.sliderService.update(body);
        if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        const response = this.sliderTransformer.transform(result.result);
        return this.responseHandler.send(res, 200, "ویرایش با موفقیت حذف شد.", response);
    }
    async remove(id, res) {
        const result = await this.sliderService.remove(id);
        if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        return this.responseHandler.send(res, 200, "آیتم موردنظر با موفقیت حذف شد.");
    }
};
__decorate([
    (0, swagger_1.ApiCreatedResponse)({
        description: "دیتا با موفقیت ذخیره شد.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 201 },
                message: {
                    type: "string",
                    example: "دیتا با موفقیت ذخیره شد.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {},
                },
            },
        },
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("thumbnail", {
        storage: (0, multer_1.diskStorage)({
            destination: "./public/contents/sliders",
            filename(req, file, callback) {
                const filename = (0, path_1.parse)((0, path_1.join)(file.originalname)).name;
                const extention = (0, path_1.parse)((0, path_1.join)(file.originalname)).ext;
                callback(null, `${filename}-${Date.now()}${extention}`);
            },
        }),
    })),
    (0, common_1.Post)(),
    (0, swagger_1.ApiBody)({ type: create_slider_dto_1.CreateSliderDto }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Request)()),
    __param(3, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_slider_dto_1.CreateSliderDto, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SliderController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "لیست اسلایدر ها در دسترس است.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "لیست اسلایدر ها در دسترس است.",
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
                                    id: { type: "integer", example: "1" },
                                    title: { type: "String", example: "title" },
                                    thumbnail: { type: "String", example: "thumbnail url" },
                                    status: { type: "String", example: "active, inactive" },
                                    created_at: { type: "String", example: "thumbnail url" },
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
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: "خطا. احزار هویت انجام نشده است",
        type: UnAuthorizedSchema_1.default,
        schema: {
            $ref: (0, swagger_1.getSchemaPath)(UnAuthorizedSchema_1.default),
        },
    }),
    (0, swagger_1.ApiForbiddenResponse)({
        description: "خطا. اجازه ادامه کار را ندارید.",
        type: ForbiddenSchema_1.default,
        schema: {
            $ref: (0, swagger_1.getSchemaPath)(ForbiddenSchema_1.default),
        },
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: "خطا. آدرس موردنظر یافت نشد",
        type: NotFoundSchema_1.default,
        schema: {
            $ref: (0, swagger_1.getSchemaPath)(NotFoundSchema_1.default),
        },
    }),
    (0, swagger_1.ApiInternalServerErrorResponse)({
        type: InternalServerErrorSchema_1.default,
        description: "خطای سرور. لطفا کمی بعد تلاش کنید",
        schema: {
            $ref: (0, swagger_1.getSchemaPath)(InternalServerErrorSchema_1.default),
        },
    }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PaginationSchema_1.PaginationSchema, Object]),
    __metadata("design:returntype", Promise)
], SliderController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)("update"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file", {
        storage: (0, multer_1.diskStorage)({
            destination: "./public/contents/sliders",
            filename(req, file, callback) {
                const filename = (0, path_1.parse)((0, path_1.join)(file.originalname)).name;
                const extention = (0, path_1.parse)((0, path_1.join)(file.originalname)).ext;
                callback(null, `${filename}-${Date.now()}${extention}`);
            },
        }),
    }), check_file_middleware_1.CheckFileMiddleware),
    (0, swagger_1.ApiBody)({ type: update_slider_dto_1.UpdateSliderDto }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Response)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_slider_dto_1.UpdateSliderDto, Object, Object]),
    __metadata("design:returntype", Promise)
], SliderController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], SliderController.prototype, "remove", null);
SliderController = __decorate([
    (0, common_1.UseGuards)(AdminTokenAuthGuard_1.default),
    (0, swagger_1.ApiSecurity)("JWT-auth"),
    (0, swagger_1.ApiTags)("v1/admin-slider"),
    (0, common_1.Controller)("v1/admin/slider"),
    __metadata("design:paramtypes", [slider_service_1.SliderService,
        httpResponsehandler_1.HttpResponsehandler,
        transformer_admin_1.default])
], SliderController);
exports.SliderController = SliderController;
//# sourceMappingURL=slider.controller.js.map