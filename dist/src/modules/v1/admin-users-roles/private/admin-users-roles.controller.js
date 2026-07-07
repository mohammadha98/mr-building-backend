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
exports.AdminUsersRolesController = void 0;
const common_1 = require("@nestjs/common");
const admin_users_roles_service_1 = require("./admin-users-roles.service");
const swagger_1 = require("@nestjs/swagger");
const nestjs_form_data_1 = require("nestjs-form-data");
const InternalServerErrorSchema_1 = require("../../../../commons/contracts/swaggerDefinations/InternalServerErrorSchema");
const AdminTokenAuthGuard_1 = require("../../jwt-auth/AdminTokenAuthGuard");
const badRequestErrorHandler_1 = require("../../../services/httpResponseHandler/badRequestErrorHandler");
const create_category_role_permissions_1 = require("./dto/create-category-role-permissions");
const create_category_roles_1 = require("./dto/create-category-roles");
const update_category_roles_1 = require("./dto/update-category-roles");
const update_category_roles_permission_1 = require("./dto/update-category-roles-permission");
const Transformer_1 = require("./Transformer");
const httpResponsehandler_1 = require("../../../services/httpResponseHandler/httpResponsehandler");
let AdminUsersRolesController = class AdminUsersRolesController {
    constructor(adminUsersRolesService, transformer) {
        this.adminUsersRolesService = adminUsersRolesService;
        this.transformer = transformer;
        this.responseHandler = new httpResponsehandler_1.HttpResponsehandler();
    }
    async createCategoryRoles(body, request, res) {
        body.creator_id = request.user.id;
        console.log("create/update category roles for admin user");
        console.log({ body });
        const result = await this.adminUsersRolesService.createCategoryRoles(body);
        if (result.status === 400) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("خطا. آیتم موردنظر موجود نمیباشد.");
        }
        else if (result.status === 500) {
            throw new InternalServerErrorSchema_1.default();
        }
        const transformer = this.transformer.transformCategoryRoles(result.result);
        return this.responseHandler.send(res, 201, "دسته بندی جدید با موفقیت ایجاد شد.", transformer);
    }
    async getCategoryRoles(request, res) {
        console.log("getCategoryRoles: Private API");
        const result = await this.adminUsersRolesService.getCategoryRoles();
        if (result.status === 400) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("خطا. آیتم موردنظر موجود نمیباشد.");
        }
        else if (result.status === 500) {
            throw new InternalServerErrorSchema_1.default();
        }
        const transformer = this.transformer.collectionCategoryRoles(result.categoryInfo);
        return this.responseHandler.send(res, 200, "لیست دسته بندی ها در دسترس است.", transformer);
    }
    async deleteCategoryRoles(category_id, request, res) {
        const result = await this.adminUsersRolesService.deleteCategoryRoles(category_id);
        if (result.status === 400) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("خطا. آیتم موردنظر موجود نمیباشد.");
        }
        else if (result.status === 500) {
            throw new InternalServerErrorSchema_1.default();
        }
        return this.responseHandler.send(res, 200, "حذف با موفقیت انجام شد");
    }
    async updateCategoryRoles(body, request, res) {
        body.creator_id = request.user.id;
        console.log("Update category roles for admin user");
        console.log({ body });
        const result = await this.adminUsersRolesService.UpdateCategoryRolesDto(body);
        if (result.status === 400) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("خطا. آیتم موردنظر موجود نمیباشد.");
        }
        else if (result.status === 500) {
            throw new InternalServerErrorSchema_1.default();
        }
        const transformer = this.transformer.transformCategoryRoles(result.result);
        return this.responseHandler.send(res, 200, "دسته بندی جدید مورد نظر ویرایش شد..", transformer);
    }
    async CreateCategoryRolePermissions(body, request, res) {
        body.creator_id = request.user.id;
        console.log("create Permissions for category roles for admin user");
        console.log({ body });
        const result = await this.adminUsersRolesService.CreateCategoryRolePermissions(body);
        if (result.status === 400) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("خطا. آیتم موردنظر موجود نمیباشد.");
        }
        else if (result.status === 500) {
            throw new InternalServerErrorSchema_1.default();
        }
        const transformer = this.transformer.transformPermissionCategoryRoles(result.result);
        return this.responseHandler.send(res, 201, "پرمیشن جدید برای دسته بندی موردنظر با موفقیت ایجاد شد.", transformer);
    }
    async UpdatePermissionCategoryRole(body, request, res) {
        body.creator_id = request.user.id;
        console.log("Update Permission for category roles for admin user");
        console.log({ body });
        const result = await this.adminUsersRolesService.UpdatePermissionCategoryRoleDto(body);
        if (result.status === 400) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("خطا. آیتم موردنظر موجود نمیباشد.");
        }
        else if (result.status === 500) {
            throw new InternalServerErrorSchema_1.default();
        }
        const transformer = this.transformer.transformPermissionCategoryRoles(result.result);
        return this.responseHandler.send(res, 200, "ویرایش پرمیشن برای دسته بندی رول ها انجام شد.", transformer);
    }
    async deleteCategoryPermission(permission_id, request, res) {
        const result = await this.adminUsersRolesService.deleteCategoryPermission(permission_id);
        if (result.status === 400) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("خطا. آیتم موردنظر موجود نمیباشد.");
        }
        else if (result.status === 500) {
            throw new InternalServerErrorSchema_1.default();
        }
        return this.responseHandler.send(res, 200, "حذف با موفقیت انجام شد");
    }
};
__decorate([
    (0, swagger_1.ApiCreatedResponse)({
        description: "دسته بندی جدید با موفقیت ایجاد شد.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "number", example: 201 },
                message: {
                    type: "string",
                    example: "دسته بندی جدید با موفقیت ایجاد شد.",
                },
                error: { type: "string", example: "" },
                data: {
                    type: "object",
                    properties: {
                        id: { type: "string" },
                        title: { type: "string" },
                        key: { type: "string" },
                    },
                },
            },
        },
    }),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: "ایجاد - ویرایش دسته بندی رول ها" }),
    (0, nestjs_form_data_1.FormDataRequest)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_category_roles_1.CreateCategoryRolesDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminUsersRolesController.prototype, "createCategoryRoles", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "لیست دسته بندی ها در دسترس است.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "number", example: 200 },
                message: {
                    type: "string",
                    example: "لیست دسته بندی ها در دسترس است.",
                },
                error: { type: "string", example: "" },
                data: {
                    type: "object",
                    properties: {
                        id: { type: "string" },
                        title: { type: "string" },
                        key: { type: "string" },
                        permissions: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    id: { type: "string" },
                                    title: { type: "string" },
                                    key: { type: "string" },
                                    category_id: { type: "string" },
                                },
                            },
                        },
                    },
                },
            },
        },
    }),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "دریافت دسته بندی رول ها" }),
    (0, nestjs_form_data_1.FormDataRequest)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminUsersRolesController.prototype, "getCategoryRoles", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "حذف با موفقیت انجام شد",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "number", example: 200 },
                message: {
                    type: "string",
                    example: "حذف با موفقیت انجام شد",
                },
                error: { type: "string", example: "" },
                data: {
                    type: "object",
                    properties: {
                        id: { type: "string" },
                        title: { type: "string" },
                        key: { type: "string" },
                        permissions: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    id: { type: "string" },
                                    title: { type: "string" },
                                    key: { type: "string" },
                                    category_id: { type: "string" },
                                },
                            },
                        },
                    },
                },
            },
        },
    }),
    (0, common_1.Delete)("/:category_id"),
    (0, swagger_1.ApiOperation)({ summary: "حذف دسته بندی رول ها" }),
    (0, nestjs_form_data_1.FormDataRequest)(),
    __param(0, (0, common_1.Param)("category_id")),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminUsersRolesController.prototype, "deleteCategoryRoles", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "دسته بندی جدید مورد نظر ویرایش شد..",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "number", example: 200 },
                message: {
                    type: "string",
                    example: "دسته بندی جدید مورد نظر ویرایش شد..",
                },
                error: { type: "string", example: "" },
                data: {
                    type: "object",
                    properties: {
                        id: { type: "string" },
                        title: { type: "string" },
                        key: { type: "string" },
                    },
                },
            },
        },
    }),
    (0, common_1.Patch)(),
    (0, swagger_1.ApiOperation)({ summary: "ویرایش دسته بندی رول ها" }),
    (0, nestjs_form_data_1.FormDataRequest)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_category_roles_1.UpdateCategoryRolesDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminUsersRolesController.prototype, "updateCategoryRoles", null);
__decorate([
    (0, swagger_1.ApiCreatedResponse)({
        description: "پرمیشن جدید برای دسته بندی موردنظر با موفقیت ایجاد شد.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "number", example: 201 },
                message: {
                    type: "string",
                    example: "پرمیشن جدید برای دسته بندی موردنظر با موفقیت ایجاد شد.",
                },
                error: { type: "string", example: "" },
                data: {
                    type: "object",
                    properties: {
                        id: { type: "string" },
                        title: { type: "string" },
                        key: { type: "string" },
                    },
                },
            },
        },
    }),
    (0, common_1.Post)("permissions"),
    (0, swagger_1.ApiOperation)({ summary: "ایجاد پرمیشن برای دسته بندی رول ها" }),
    (0, nestjs_form_data_1.FormDataRequest)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_category_role_permissions_1.CreateCategoryRolePermissionsDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminUsersRolesController.prototype, "CreateCategoryRolePermissions", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "ویرایش پرمیشن برای دسته بندی رول ها انجام شد.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "number", example: 200 },
                message: {
                    type: "string",
                    example: "ویرایش پرمیشن برای دسته بندی رول ها انجام شد.",
                },
                error: { type: "string", example: "" },
                data: {
                    type: "object",
                    properties: {
                        id: { type: "string" },
                        title: { type: "string" },
                        key: { type: "string" },
                    },
                },
            },
        },
    }),
    (0, common_1.Patch)("permissions"),
    (0, swagger_1.ApiOperation)({ summary: "ویرایش پرمیشن دسته بندی" }),
    (0, nestjs_form_data_1.FormDataRequest)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_category_roles_permission_1.UpdatePermissionCategoryRoleDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminUsersRolesController.prototype, "UpdatePermissionCategoryRole", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "حذف با موفقیت انجام شد",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "number", example: 200 },
                message: {
                    type: "string",
                    example: "حذف با موفقیت انجام شد",
                },
                error: { type: "string", example: "" },
                data: {
                    type: "object",
                    properties: {
                        id: { type: "string" },
                        title: { type: "string" },
                        key: { type: "string" },
                        permissions: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    id: { type: "string" },
                                    title: { type: "string" },
                                    key: { type: "string" },
                                    category_id: { type: "string" },
                                },
                            },
                        },
                    },
                },
            },
        },
    }),
    (0, common_1.Delete)("/:permission_id"),
    (0, swagger_1.ApiOperation)({ summary: "حذف پرمیشن دسته بندی " }),
    (0, nestjs_form_data_1.FormDataRequest)(),
    __param(0, (0, common_1.Param)("permission_id")),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminUsersRolesController.prototype, "deleteCategoryPermission", null);
AdminUsersRolesController = __decorate([
    (0, common_1.UseGuards)(AdminTokenAuthGuard_1.default),
    (0, swagger_1.ApiSecurity)("JWT-auth"),
    (0, swagger_1.ApiTags)("v1/admin-users-roles-categories"),
    (0, common_1.Controller)("v1/admin/users/roles/private/categories"),
    __metadata("design:paramtypes", [admin_users_roles_service_1.AdminUsersRolesService,
        Transformer_1.default])
], AdminUsersRolesController);
exports.AdminUsersRolesController = AdminUsersRolesController;
//# sourceMappingURL=admin-users-roles.controller.js.map