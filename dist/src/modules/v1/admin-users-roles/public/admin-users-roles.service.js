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
    async createRole(body) {
        try {
            const isExistRoleProfile = await this.prismaService.adminUserRolesProfile.findFirst({
                where: { key: body.key },
            });
            let result;
            if (isExistRoleProfile) {
                result = await this.prismaService.adminUserRolesProfile.update({
                    where: { id: isExistRoleProfile.id },
                    data: {
                        title: body.title,
                        description: body.description,
                        creator_id: body.creator_id,
                    },
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        key: true,
                        createdAt: true,
                        updatedAt: true,
                        creator_id: true,
                        permissions: { select: { id: true } },
                        category: {
                            select: {
                                id: true,
                                category: { select: { title: true } },
                            },
                        },
                    },
                });
                console.log("exist");
                console.log(result);
                await Promise.all(result.permissions.map(async (permission) => {
                    console.log("permissions");
                    console.log(permission);
                    await this.prismaService.adminUserRolesProfileCategoryPermisions.delete({ where: { id: permission.id } });
                }));
                await Promise.all(result.category.map(async (category) => {
                    console.log("category");
                    console.log(category);
                    await this.prismaService.adminUserRolesProfileCategories.delete({
                        where: { id: category.id },
                    });
                }));
                body.categories.map(async (category) => {
                    const validateCategory = await this.prismaService.adminUserRoleCategories.findFirst({
                        where: { id: category.category_id },
                    });
                    if (validateCategory) {
                        const catInfo = await this.prismaService.adminUserRolesProfileCategories.create({
                            data: {
                                category: { connect: { id: validateCategory.id } },
                                role: { connect: { id: result.id } },
                            },
                        });
                        await this.prismaService.adminUserRolesProfileCategoryPermisions.createMany({
                            data: category.permissions.map((item) => {
                                return {
                                    permissionID: item,
                                    categoryID: catInfo.id,
                                    roleID: result.id,
                                };
                            }),
                        });
                    }
                });
            }
            else {
                result = await this.prismaService.adminUserRolesProfile.create({
                    data: {
                        key: body.key,
                        title: body.title,
                        description: body.description,
                        creator_id: body.creator_id,
                    },
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        key: true,
                        createdAt: true,
                        updatedAt: true,
                        creator_id: true,
                    },
                });
                body.categories.map(async (category) => {
                    const validateCategory = await this.prismaService.adminUserRoleCategories.findFirst({
                        where: { id: category.category_id },
                    });
                    if (validateCategory) {
                        const catInfo = await this.prismaService.adminUserRolesProfileCategories.create({
                            data: {
                                category: { connect: { id: validateCategory.id } },
                                role: { connect: { id: result.id } },
                            },
                        });
                        await this.prismaService.adminUserRolesProfileCategoryPermisions.createMany({
                            data: category.permissions.map((item) => {
                                return {
                                    permissionID: item,
                                    categoryID: catInfo.id,
                                    roleID: result.id,
                                };
                            }),
                        });
                    }
                });
            }
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
    async roleList(query) {
        try {
            const count = await this.prismaService.adminUserRolesProfile.count({});
            const total = this.getTotalPageNumber(Number(count), Number(query.per_page));
            const paginationValue = this.makePagination(Number(query.page), Number(query.per_page));
            const roles = await this.prismaService.adminUserRolesProfile.findMany({
                skip: paginationValue.offset,
                take: paginationValue.per_page,
                select: {
                    id: true,
                    title: true,
                    description: true,
                    key: true,
                    category: {
                        select: {
                            category: { select: { id: true, title: true, key: true } },
                        },
                    },
                    permissions: {
                        select: {
                            permission: {
                                select: {
                                    id: true,
                                    title: true,
                                    key: true,
                                    category: { select: { key: true } },
                                },
                            },
                        },
                    },
                },
                orderBy: { createdAt: "desc" },
            });
            return {
                status: 200,
                roles,
                metadata: this.makeMetadata(Number(query.page), Number(query.per_page), Number(total)),
            };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async roleInfo(role_id) {
        try {
            const info = await this.prismaService.adminUserRolesProfile.findFirst({
                where: { id: role_id },
                select: {
                    id: true,
                    title: true,
                    description: true,
                    key: true,
                    permissions: {
                        select: {
                            permission: {
                                select: {
                                    id: true,
                                    title: true,
                                    key: true,
                                    category: { select: { id: true, title: true, key: true } },
                                },
                            },
                        },
                    },
                },
            });
            if (!info) {
                return { status: 400 };
            }
            return {
                status: 200,
                info,
            };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async deleteRole(role_id) {
        try {
            const result = await this.prismaService.adminUserRolesProfile.findFirst({
                where: { id: role_id },
                select: {
                    id: true,
                    title: true,
                    description: true,
                    key: true,
                    createdAt: true,
                    updatedAt: true,
                    creator_id: true,
                    permissions: { select: { id: true } },
                    category: {
                        select: {
                            id: true,
                            category: { select: { title: true } },
                        },
                    },
                },
            });
            if (!result) {
                return { status: 400 };
            }
            await Promise.all(result.permissions.map(async (permission) => {
                await this.prismaService.adminUserRolesProfileCategoryPermisions.delete({ where: { id: permission.id } });
            }));
            await Promise.all(result.category.map(async (category) => {
                await this.prismaService.adminUserRolesProfileCategories.delete({
                    where: { id: category.id },
                });
            }));
            await this.prismaService.adminUserRoles.deleteMany({
                where: { roleID: role_id },
            });
            await this.prismaService.adminUserRolesProfile.deleteMany({
                where: { id: role_id },
            });
            return { status: 200 };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
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
AdminUsersRolesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminUsersRolesService);
exports.AdminUsersRolesService = AdminUsersRolesService;
//# sourceMappingURL=admin-users-roles.service.js.map