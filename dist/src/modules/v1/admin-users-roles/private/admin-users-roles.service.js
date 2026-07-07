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
exports.AdminUsersRolesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../../prisma/prisma.service");
let AdminUsersRolesService = class AdminUsersRolesService {
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    async createCategoryRoles(body) {
        try {
            const isExistKey = await this.prismaService.adminUserRoleCategories.findFirst({
                where: { key: body.key },
            });
            if (isExistKey) {
                return { status: 400 };
            }
            const result = await this.prismaService.adminUserRoleCategories.create({
                data: { key: body.key, title: body.title, creator_id: body.creator_id },
                select: {
                    id: true,
                    title: true,
                    key: true,
                    createdAt: true,
                    updatedAt: true,
                    creator_id: true,
                    permissions: {
                        select: {
                            id: true,
                            title: true,
                            key: true,
                            categoryID: true,
                        },
                    },
                },
            });
            return { status: 200, result };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async UpdateCategoryRolesDto(body) {
        try {
            const isExistKey = await this.prismaService.adminUserRoleCategories.findFirst({
                where: { id: body.category_id },
            });
            console.log({ isExistKey });
            if (!isExistKey) {
                return { status: 400 };
            }
            const result = await this.prismaService.adminUserRoleCategories.update({
                where: { id: body.category_id },
                data: { title: body.title, creator_id: body.creator_id, key: body.key },
                select: {
                    id: true,
                    title: true,
                    key: true,
                    permissions: {
                        select: {
                            id: true,
                            title: true,
                            key: true,
                            categoryID: true,
                        },
                    },
                },
            });
            return { status: 200, result };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async UpdatePermissionCategoryRoleDto(body) {
        try {
            const isExistKey = await this.prismaService.adminUserRoleCategoryPermissions.findFirst({
                where: { id: body.permission_id },
            });
            if (!isExistKey) {
                return { status: 400 };
            }
            const result = await this.prismaService.adminUserRoleCategoryPermissions.update({
                where: { id: body.permission_id },
                data: {
                    key: body.key,
                    title: body.title,
                    creator_id: body.creator_id,
                },
                select: {
                    id: true,
                    title: true,
                    key: true,
                    categoryID: true,
                },
            });
            return { status: 200, result };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async getCategoryRoles() {
        try {
            const categoryInfo = await this.prismaService.adminUserRoleCategories.findMany({
                select: {
                    id: true,
                    title: true,
                    key: true,
                    permissions: {
                        select: { id: true, title: true, key: true, categoryID: true },
                    },
                },
                orderBy: { createdAt: "desc" },
            });
            if (!categoryInfo) {
                return { status: 400 };
            }
            return { status: 200, categoryInfo };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async deleteCategoryRoles(category_id) {
        try {
            const categoryInfo = await this.prismaService.adminUserRoleCategories.findFirst({
                where: { id: category_id },
            });
            if (!categoryInfo) {
                return { status: 400 };
            }
            await this.prismaService.adminUserRoleCategoryPermissions.deleteMany({
                where: { categoryID: category_id },
            });
            await this.prismaService.adminUserRoleCategories.delete({
                where: { id: category_id },
            });
            return { status: 200 };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async deleteCategoryPermission(permission_id) {
        try {
            const result = await this.prismaService.adminUserRoleCategoryPermissions.findFirst({
                where: { id: permission_id },
            });
            console.log({ result });
            if (!result) {
                return { status: 400 };
            }
            await this.prismaService.adminUserRoleCategoryPermissions.delete({
                where: { id: permission_id },
            });
            return { status: 200 };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async CreateCategoryRolePermissions(body) {
        try {
            const isExistCategory = await this.prismaService.adminUserRoleCategories.findFirst({
                where: { id: body.category_id },
            });
            if (!isExistCategory) {
                return { status: 400 };
            }
            const isExistKey = await this.prismaService.adminUserRoleCategoryPermissions.findFirst({
                where: { key: body.key },
            });
            if (isExistKey) {
                return { status: 400 };
            }
            const result = await this.prismaService.adminUserRoleCategoryPermissions.create({
                data: {
                    key: body.key,
                    title: body.title,
                    creator_id: body.creator_id,
                    category: { connect: { id: body.category_id } },
                },
                select: {
                    id: true,
                    title: true,
                    key: true,
                    categoryID: true,
                },
            });
            return { status: 200, result };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
};
AdminUsersRolesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminUsersRolesService);
exports.AdminUsersRolesService = AdminUsersRolesService;
//# sourceMappingURL=admin-users-roles.service.js.map