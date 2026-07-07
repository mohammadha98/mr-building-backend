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
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../../../prisma/prisma.service");
let UserPrismaRepository = class UserPrismaRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async count(params) {
        return await this.prisma.users.count({ where: params });
    }
    async findOneByID(id) {
        return await this.prisma.users.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                uniqKey: true,
                phone: true,
                avatar: true,
                token: true,
                refresh_token: true,
                status: true,
                roles: {
                    select: {
                        role: {
                            select: {
                                id: true,
                                title: true,
                                key: true,
                                description: true,
                                permissions: {
                                    select: {
                                        category: {
                                            select: {
                                                category: {
                                                    select: { id: true, title: true, key: true },
                                                },
                                            },
                                        },
                                        permission: {
                                            select: {
                                                id: true,
                                                title: true,
                                                key: true,
                                                category: { select: { id: true } },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
    }
    async updateToken(user_id, token) {
        return await this.prisma.users.update({
            where: { id: user_id },
            data: { token },
            select: {
                id: true,
                name: true,
                email: true,
                uniqKey: true,
                phone: true,
                avatar: true,
                token: true,
                refresh_token: true,
                status: true,
                created_at: true,
                roles: {
                    select: {
                        role: {
                            select: {
                                id: true,
                                title: true,
                                key: true,
                                permissions: {
                                    select: {
                                        category: {
                                            select: {
                                                category: {
                                                    select: { id: true, title: true, key: true },
                                                },
                                            },
                                        },
                                        permission: {
                                            select: {
                                                id: true,
                                                title: true,
                                                key: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
    }
    async login(email) {
        return await this.prisma.users.findFirst({
            where: { email },
            select: {
                id: true,
                name: true,
                email: true,
                uniqKey: true,
                phone: true,
                password: true,
                avatar: true,
                token: true,
                refresh_token: true,
                status: true,
                roles: {
                    select: {
                        role: {
                            select: {
                                id: true,
                                title: true,
                                key: true,
                                description: true,
                                permissions: {
                                    select: {
                                        category: {
                                            select: {
                                                category: {
                                                    select: { id: true, title: true, key: true },
                                                },
                                            },
                                        },
                                        permission: {
                                            select: {
                                                id: true,
                                                title: true,
                                                key: true,
                                                category: { select: { id: true } },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
    }
    async create(params) {
        return await this.prisma.users.create({ data: Object.assign({}, params) });
    }
    async saveUserRoles(userID, roles) {
        await this.prisma.adminUserRoles.createMany({
            data: roles.map((item) => {
                return {
                    roleID: item,
                    userID,
                };
            }),
        });
    }
    async findOne(params) {
        return await this.prisma.users.findFirst({
            where: params,
            select: {
                id: true,
                name: true,
                email: true,
                uniqKey: true,
                phone: true,
                avatar: true,
                token: true,
                refresh_token: true,
                status: true,
                created_at: true,
                roles: {
                    select: {
                        role: {
                            select: {
                                id: true,
                                title: true,
                                key: true,
                                description: true,
                                permissions: {
                                    select: {
                                        category: {
                                            select: {
                                                category: {
                                                    select: { id: true, title: true, key: true },
                                                },
                                            },
                                        },
                                        permission: {
                                            select: {
                                                id: true,
                                                title: true,
                                                key: true,
                                                category: { select: { id: true } },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
    }
    async findMany(params, relations, pagination) {
        return await this.prisma.users.findMany(params);
    }
    async updateOne(where, updateData) {
        return await this.prisma.users.update({
            where,
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                phone: true,
                token: true,
                refresh_token: true,
            },
        });
    }
    async updateMany(where, updateData) {
        return await this.prisma.users.updateMany({ where, data: updateData });
    }
    async deleteOne(where) {
        return await this.prisma.users.delete({ where });
    }
    async deleteUserRoles(userID) {
        console.log({ userID });
        return await this.prisma.adminUserRoles.deleteMany({ where: { userID } });
    }
    async deleteMany(where) {
        return await this.prisma.users.deleteMany({ where });
    }
};
UserPrismaRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserPrismaRepository);
exports.default = UserPrismaRepository;
//# sourceMappingURL=UserPrismaRepository.js.map