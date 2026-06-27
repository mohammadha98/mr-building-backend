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
exports.StorefrontController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const swagger_1 = require("@nestjs/swagger");
const storefront_service_1 = require("./storefront.service");
const create_storefront_dto_1 = require("./dto/create-storefront.dto");
const list_storefront_dto_1 = require("./dto/list-storefront.dto");
const check_avatar_middleware_1 = require("./dto/check-avatar.middleware");
const check_lisence_middleware_1 = require("./dto/check-lisence.middleware");
const crypto_1 = require("crypto");
const BadRequestSchema_1 = require("../../../../commons/contracts/swaggerDefinations/BadRequestSchema");
const nestjs_form_data_1 = require("nestjs-form-data");
const delete_media_item_products_dto_1 = require("./dto/delete-media-item-products.dto");
const upload_file_products_dto_1 = require("./dto/upload-file-products.dto");
const change_cover_media_item_dto_1 = require("./dto/change-cover-media-item.dto");
const save_product_dto_1 = require("./dto/save-product.dto");
const update_product_dto_1 = require("./dto/update-product.dto");
const get_product_dto_1 = require("./dto/get-product.dto");
const change_status_product_dto_1 = require("./dto/change-status-product.dto");
const TokenAuthGuardClient_1 = require("../../jwt-auth/TokenAuthGuardClient");
let StorefrontController = class StorefrontController {
    constructor(storefrontService) {
        this.storefrontService = storefrontService;
    }
    async create(body, files) {
        const { avatar, license } = files;
        const avatarName = avatar ? avatar[0].filename : null;
        const licenseName = license ? license[0].filename : null;
        body.avatar = null;
        if (files.avatar) {
            body.avatar = avatarName;
        }
        body.license = null;
        if (files.license) {
            body.license = licenseName;
        }
        console.log("*** Store Request: APP ***");
        console.log(body);
        return await this.storefrontService.storeRequest(body);
    }
    async listOfStorefronts(query) {
        console.log("listOfStorefronts: APP");
        console.log({ query });
        return await this.storefrontService.listOfStorefronts(query);
    }
    async GetStorefrontInfo(store_id) {
        return await this.storefrontService.storefrontDetails(store_id);
    }
    async getProperties() {
        console.log("getProperties for storefront");
        return await this.storefrontService.getCategories();
    }
    async UploadTempFile(body) {
        return await this.storefrontService.UploadFile(body);
    }
    async removeAdFile(query) {
        console.log("*** removeProductFile ***");
        console.log(query);
        return await this.storefrontService.removeFile(query);
    }
    async changeCover(body) {
        return await this.storefrontService.changeCover(body);
    }
    async SaveNewProduct(body) {
        return await this.storefrontService.SaveNewProduct(body);
    }
    async updateProduct(body) {
        return await this.storefrontService.updateProduct(body);
    }
    async findStorefrontProducts(body) {
        console.log("findStorefrontProducts");
        console.log(body);
        return await this.storefrontService.findStorefrontProducts(body);
    }
    async changeStatusProduct(body) {
        console.log("ChangeStatusProduct ");
        console.log(body);
        return await this.storefrontService.changeStatusProduct(body);
    }
    async deleteProduct(product_id) {
        console.log("deleteProduct ");
        console.log({ product_id });
        return await this.storefrontService.deleteProduct(product_id);
    }
    async addStorefrontIntoBookmark(storefront_id) {
        console.log("addStorefrontIntoBookmark ");
        console.log({ storefront_id });
        return await this.storefrontService.addStorefrontIntoBookmark(storefront_id);
    }
    async getBookmarkedList() {
        console.log("getBookmarkedList ");
        return await this.storefrontService.getBookmarkedList();
    }
};
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "ثبت / ویرایش درخواست فروشگاه" }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: "avatar", maxCount: 1 },
        { name: "license", maxCount: 1 },
    ], {
        storage: (0, multer_1.diskStorage)({
            destination: "./public/contents/temp/storefronts",
            filename: (req, file, callback) => {
                const extension = (0, path_1.parse)((0, path_1.join)(file.originalname)).ext;
                const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
                callback(null, `${uniqueSuffix}${extension}`);
            },
        }),
    }), check_avatar_middleware_1.CheckAvatarMiddleware, check_lisence_middleware_1.CheckLicenseMiddleware),
    (0, common_1.Post)(),
    (0, swagger_1.ApiBody)({ type: create_storefront_dto_1.CreateStorefrontDto }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_storefront_dto_1.CreateStorefrontDto, Object]),
    __metadata("design:returntype", Promise)
], StorefrontController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "لیست فروشگاه ها در دسترس است.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "لیست فروشگاه  ها در دسترس است.",
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
                                    tracking_code: { type: "string" },
                                    client_id: { type: "integer", example: 1 },
                                    name: { type: "string" },
                                    description: { type: "string" },
                                    color: { type: "string" },
                                    avatar: { type: "string" },
                                    score: { type: "number", example: 0 },
                                    province: {
                                        type: "object",
                                        properties: {
                                            id: { type: "number" },
                                            name: { type: "string" },
                                        },
                                    },
                                    city: {
                                        type: "object",
                                        properties: {
                                            id: { type: "number" },
                                            name: { type: "string" },
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
    (0, swagger_1.ApiOperation)({ summary: "لیست/سرچ فروشگاه" }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_storefront_dto_1.ListStorefrontDto]),
    __metadata("design:returntype", Promise)
], StorefrontController.prototype, "listOfStorefronts", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "جزییات فروشگاه در دسترس است.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "جزییات فروشگاه در دسترس است.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 1 },
                        client_id: { type: "integer", example: 1 },
                        tracking_code: { type: "string" },
                        phone: { type: "string" },
                        avatar: { type: "string" },
                        license: { type: "string" },
                        license_status: {
                            type: "string",
                            example: "pending || approved || rejected",
                        },
                        status: { type: "string", example: "active, inactive" },
                        score: { type: "number", example: 0 },
                        number_of_products: { type: "number", example: 0 },
                        province: {
                            type: "object",
                            properties: {
                                id: { type: "number" },
                                name: { type: "string" },
                            },
                        },
                        city: {
                            type: "object",
                            properties: {
                                id: { type: "number" },
                                name: { type: "string" },
                            },
                        },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "جزییات فروشگاه" }),
    (0, common_1.Get)("info/:store_id"),
    __param(0, (0, common_1.Param)("store_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StorefrontController.prototype, "GetStorefrontInfo", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "نیازمندی ها در دسترس است.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "نیازمندی ها در دسترس است.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {
                        categories: {
                            type: "array",
                            items: {
                                properties: {
                                    id: { type: "number" },
                                    title: { type: "string" },
                                    form_items: {
                                        type: "array",
                                        items: {
                                            properties: {
                                                id: { type: "number", example: 1 },
                                                field_name: { type: "string" },
                                                is_active: { type: "boolean" },
                                                required: { type: "boolean" },
                                                field_type: { type: "string" },
                                                values: { type: "array" },
                                                sort_number: { type: "number", example: 1 },
                                                status: { type: "string" },
                                                key: { type: "string" },
                                                formId: { type: "string" },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        brands: {
                            type: "array",
                            items: {
                                properties: {
                                    id: { type: "integer", example: 1 },
                                    title: { type: "string" },
                                    thumbnail: { type: "string" },
                                },
                            },
                        },
                        units: {
                            type: "array",
                            items: {},
                        },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "لیست نیازمندی های ثبت محصول" }),
    (0, common_1.Get)("requirements"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StorefrontController.prototype, "getProperties", null);
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
            destination: "./public/contents/temp/products/files/",
            filename(req, file, callback) {
                const uniqueCode = (0, crypto_1.randomBytes)(3).toString("hex").toUpperCase();
                const extention = (0, path_1.parse)((0, path_1.join)(file.originalname)).ext;
                callback(null, `${Date.now()}-${uniqueCode}${extention}`);
            },
        }),
    })),
    (0, swagger_1.ApiOperation)({ summary: "آپلود فایل" }),
    (0, common_1.Post)("file"),
    (0, swagger_1.ApiBody)({ type: upload_file_products_dto_1.UploadFileProductsDto }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [upload_file_products_dto_1.UploadFileProductsDto]),
    __metadata("design:returntype", Promise)
], StorefrontController.prototype, "UploadTempFile", null);
__decorate([
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
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [delete_media_item_products_dto_1.DeleteMediaProductsDto]),
    __metadata("design:returntype", Promise)
], StorefrontController.prototype, "removeAdFile", null);
__decorate([
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, nestjs_form_data_1.FormDataRequest)(),
    (0, swagger_1.ApiOperation)({ summary: "تغییر کاور " }),
    (0, common_1.Post)("/change_cover"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [change_cover_media_item_dto_1.ChangeCoverMediaProductDto]),
    __metadata("design:returntype", Promise)
], StorefrontController.prototype, "changeCover", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "ذخیره محصول" }),
    (0, common_1.Post)("/product"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [save_product_dto_1.SaveProductDto]),
    __metadata("design:returntype", Promise)
], StorefrontController.prototype, "SaveNewProduct", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "ویرایش محصول" }),
    (0, common_1.Patch)("/product"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_product_dto_1.UpdateProductDto]),
    __metadata("design:returntype", Promise)
], StorefrontController.prototype, "updateProduct", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "دریافت محصولات یک فروشگاه" }),
    (0, common_1.Get)("/product"),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_product_dto_1.GetProductDto]),
    __metadata("design:returntype", Promise)
], StorefrontController.prototype, "findStorefrontProducts", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "تغییر وضعیت یک محصول" }),
    (0, common_1.Patch)("/product/change_status"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [change_status_product_dto_1.ChangeStatusProductDto]),
    __metadata("design:returntype", Promise)
], StorefrontController.prototype, "changeStatusProduct", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "حذف محصول" }),
    (0, common_1.Delete)("/product/:product_id"),
    __param(0, (0, common_1.Param)("product_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StorefrontController.prototype, "deleteProduct", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "بوکمارک / حذف فروشگاه" }),
    (0, common_1.Post)("/bookmark/:storefront_id"),
    __param(0, (0, common_1.Param)("storefront_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StorefrontController.prototype, "addStorefrontIntoBookmark", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "لیست بوکمارک شده ها" }),
    (0, common_1.Get)("/bookmark"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StorefrontController.prototype, "getBookmarkedList", null);
StorefrontController = __decorate([
    (0, common_1.UseGuards)(TokenAuthGuardClient_1.default),
    (0, swagger_1.ApiSecurity)("JWT-auth"),
    (0, swagger_1.ApiTags)("v2/app-marketplace-storefront"),
    (0, common_1.Controller)("v2/app/marketplace/storefront"),
    __metadata("design:paramtypes", [storefront_service_1.StorefrontService])
], StorefrontController);
exports.StorefrontController = StorefrontController;
//# sourceMappingURL=storefront.controller.js.map