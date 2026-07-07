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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const UserPrismaRepository_1 = require("./repositories/UserPrismaRepository");
const bcrypt_1 = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../../../../../prisma/prisma.service");
const crypto_1 = require("crypto");
const client_list_dto_1 = require("../../client/admin/dto/client-list.dto");
const mailerService_1 = require("../../../services/notifications/mailer/mailerService");
const SortingTypes_1 = require("../../../../commons/contracts/SortingTypes");
let UsersService = class UsersService {
    constructor(userPrismaModel, jwtService, prismaService, mailerService) {
        this.userPrismaModel = userPrismaModel;
        this.jwtService = jwtService;
        this.prismaService = prismaService;
        this.mailerService = mailerService;
    }
    async create(createUserDto) {
        try {
            const hasUser = await this.userPrismaModel.findOne({
                email: createUserDto.email,
            });
            if (hasUser === null) {
                createUserDto.password = (0, bcrypt_1.hashSync)(createUserDto.password, 10);
                const roles = createUserDto.roles;
                delete createUserDto.roles;
                createUserDto.uniqKey = await this.generateUniqKey();
                const newUser = await this.userPrismaModel.create(createUserDto);
                await this.userPrismaModel.saveUserRoles(newUser.id, roles);
                const token = this.jwtService.sign({ sub: createUserDto.uniqKey }, { secret: process.env.JWT_SECRET_KEY_ADMIN });
                const updatedUser = await this.userPrismaModel.updateToken(newUser.id, token);
                return { status: 200, user: updatedUser };
            }
            return { status: 409 };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async generateUniqKey() {
        const uniqKey = (0, crypto_1.randomBytes)(20).toString("base64");
        const isDuplicatedUniqKey = await this.prismaService.users.findFirst({
            where: { uniqKey },
        });
        if (isDuplicatedUniqKey) {
            await this.generateUniqKey();
        }
        return uniqKey;
    }
    async findAll(query) {
        try {
            const adminUser = await this.userPrismaModel.findOneByID(query.user_id);
            if (!adminUser) {
                return { status: 403 };
            }
            let condition = {};
            if (query.type === client_list_dto_1.GetTypes.search) {
                condition = {
                    name: {
                        contains: query.keyword,
                        mode: "insensitive",
                    },
                };
            }
            let orderBy = { id: "desc" };
            if (query.sort === SortingTypes_1.default.oldest) {
                orderBy = { id: "asc" };
            }
            const count = await this.userPrismaModel.count(Object.assign({}, condition));
            const total = this.getTotalPageNumber(Number(count), Number(query.per_page));
            const paginationValue = this.makePagination(Number(query.page), Number(query.per_page));
            const users = await this.prismaService.users.findMany({
                where: Object.assign({}, condition),
                skip: paginationValue.offset,
                take: paginationValue.per_page,
                orderBy,
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
            return {
                status: 200,
                users,
                metadata: this.makeMetadata(Number(query.page), Number(query.per_page), Number(total)),
            };
        }
        catch (error) {
            console.log(error);
            return {
                status: 500,
            };
        }
    }
    async login(email, password) {
        const user = await this.userPrismaModel.login(email);
        if (!user) {
            return { status: 400 };
        }
        const validatePassword = (0, bcrypt_1.compareSync)(password, user.password);
        return validatePassword ? { status: 200, user } : { status: 400 };
    }
    async getUserInfo(userInfoDto) {
        const userInfo = await this.userPrismaModel.findOne({
            uniqKey: userInfoDto.user_key,
        });
        if (!userInfo) {
            return { status: 400 };
        }
        return { status: 200, user: userInfo };
    }
    async tokenValidaion(id) {
        const user = await this.userPrismaModel.findOneByID(id);
        if (!user) {
            return { status: 403 };
        }
        return { status: 200, user };
    }
    async updateUser(updateUserDto) {
        const userInfo = await this.userPrismaModel.findOne({
            uniqKey: updateUserDto.user_key,
        });
        if (!userInfo) {
            return { status: 400 };
        }
        const validateEmail = await this.prismaService.users.findFirst({
            where: {
                email: updateUserDto.email,
                NOT: {
                    id: userInfo.id,
                },
            },
        });
        if (validateEmail) {
            return { status: 409 };
        }
        await this.userPrismaModel.updateOne({ id: userInfo.id }, {
            name: updateUserDto.name,
            email: updateUserDto.email,
        });
        return { status: 200 };
    }
    async updateRoles(body) {
        const userInfo = await this.userPrismaModel.findOne({
            uniqKey: body.user_key,
        });
        if (!userInfo) {
            return { status: 400 };
        }
        await this.updateUserRoles(userInfo.id, body.roles);
        return { status: 200 };
    }
    async updateUserRoles(user_id, roles) {
        await this.prismaService.adminUserRoles.deleteMany({
            where: { userID: user_id },
        });
        await this.userPrismaModel.saveUserRoles(user_id, roles);
    }
    async updateUserProfile(updateUserDto) {
        const validateUserTokenID = await this.userPrismaModel.findOne({
            id: Number(updateUserDto.user_id),
        });
        if (!validateUserTokenID) {
            return { status: 403 };
        }
        const userInfo = await this.userPrismaModel.findOne({
            id: Number(updateUserDto.user_id),
        });
        if (!userInfo) {
            return { status: 400 };
        }
        await this.userPrismaModel.updateOne({ id: Number(updateUserDto.user_id) }, {
            name: updateUserDto.name,
        });
        return { status: 200 };
    }
    async removeUser(user_id) {
        const userInfo = await this.userPrismaModel.findOne({
            id: Number(user_id),
        });
        if (!userInfo) {
            return { status: 400 };
        }
        await this.userPrismaModel.deleteUserRoles(Number(user_id));
        await this.userPrismaModel.deleteOne({ id: Number(user_id) });
        return { status: 200 };
    }
    async changePassword(changePasswordDto) {
        const userInfo = await this.userPrismaModel.findOne({
            id: Number(changePasswordDto.user_id),
        });
        if (!userInfo) {
            return { status: 400 };
        }
        changePasswordDto.password = (0, bcrypt_1.hashSync)(changePasswordDto.password, 10);
        await this.userPrismaModel.updateOne({ id: Number(changePasswordDto.user_id) }, {
            password: changePasswordDto.password,
        });
        return { status: 200 };
    }
    async validateWithID(user_id) {
        const user = await this.userPrismaModel.findOneByID(Number(user_id));
        if (!user) {
            return false;
        }
        return user;
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
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [UserPrismaRepository_1.default,
        jwt_1.JwtService,
        prisma_service_1.PrismaService,
        mailerService_1.default])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map