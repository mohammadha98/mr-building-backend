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
const Transformer_1 = require("./Transformer");
const httpResponsehandler_1 = require("../../../services/httpResponseHandler/httpResponsehandler");
const create_role_1 = require("../private/dto/create-role");
const Pagination_dto_1 = require("../../../../commons/contracts/Pagination.dto");
let AdminUsersRolesController = class AdminUsersRolesController {
    constructor(adminUsersRolesService, transformer) {
        this.adminUsersRolesService = adminUsersRolesService;
        this.transformer = transformer;
        this.responseHandler = new httpResponsehandler_1.HttpResponsehandler();
    }
    async getCategoryRoles(request, res) {
        console.log("getCategoryRoles: ADMIN");
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
    async createCategoryRoles(body, request, res) {
        body.creator_id = request.user.id;
        console.log("create/update  role for admin user");
        console.log({ body });
        const result = await this.adminUsersRolesService.createRole(body);
        return this.responseHandler.send(res, 201, "رول جدید با موفقیت ایجاد شد.");
    }
    async roleList(query, res) {
        console.log("roleList: ADMIN");
        console.log({ query });
        const result = await this.adminUsersRolesService.roleList(query);
        if (result.status === 500) {
            throw new InternalServerErrorSchema_1.default();
        }
        const transformer = this.transformer.collectionRoles(result.roles);
        return this.responseHandler.send(res, 200, "لیست رول ها در دسترس است.", {
            data: transformer,
            metadata: result.metadata,
        });
    }
    async roleInfo(role_id, request, res) {
        console.log("roleInfo: ADMIN");
        console.log({ role_id });
        const result = await this.adminUsersRolesService.roleInfo(role_id);
        if (result.status === 400) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("خطا. آیتم موردنظر موجود نمیباشد.");
        }
        else if (result.status === 500) {
            throw new InternalServerErrorSchema_1.default();
        }
        return this.responseHandler.send(res, 200, "جزییات رول در دسترس است.", result.info);
    }
    async deleteRole(role_id, request, res) {
        console.log("deleteRole: ADMIN");
        console.log({ role_id });
        const result = await this.adminUsersRolesService.deleteRole(role_id);
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
    (0, common_1.Get)("/categories"),
    (0, swagger_1.ApiOperation)({ summary: "دریافت دسته بندی ها و پرمیشن هایشان" }),
    (0, nestjs_form_data_1.FormDataRequest)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminUsersRolesController.prototype, "getCategoryRoles", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: "ایجاد - ویرایش رول" }),
    (0, nestjs_form_data_1.FormDataRequest)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_role_1.CreateRoleDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminUsersRolesController.prototype, "createCategoryRoles", null);
__decorate([
    (0, common_1.Get)(""),
    (0, swagger_1.ApiOperation)({ summary: "لیست رول ها" }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Pagination_dto_1.PaginationDto, Object]),
    __metadata("design:returntype", Promise)
], AdminUsersRolesController.prototype, "roleList", null);
__decorate([
    (0, common_1.Get)(":role_id"),
    (0, swagger_1.ApiOperation)({ summary: "جزییات رول" }),
    __param(0, (0, common_1.Param)("role_id")),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminUsersRolesController.prototype, "roleInfo", null);
__decorate([
    (0, common_1.Delete)("/:role_id"),
    (0, swagger_1.ApiOperation)({ summary: "حذف رول" }),
    (0, nestjs_form_data_1.FormDataRequest)(),
    __param(0, (0, common_1.Param)("role_id")),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminUsersRolesController.prototype, "deleteRole", null);
AdminUsersRolesController = __decorate([
    (0, common_1.UseGuards)(AdminTokenAuthGuard_1.default),
    (0, swagger_1.ApiSecurity)("JWT-auth"),
    (0, swagger_1.ApiTags)("v1/admin-users-roles"),
    (0, common_1.Controller)("v1/admin/users/roles"),
    __metadata("design:paramtypes", [admin_users_roles_service_1.AdminUsersRolesService,
        Transformer_1.default])
], AdminUsersRolesController);
exports.AdminUsersRolesController = AdminUsersRolesController;
//# sourceMappingURL=admin-users-roles.controller.js.map