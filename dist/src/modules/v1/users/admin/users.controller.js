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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const create_user_dto_1 = require("./dto/create-user.dto");
const update_user_dto_1 = require("./dto/update-user.dto");
const swagger_1 = require("@nestjs/swagger");
const nestjs_form_data_1 = require("nestjs-form-data");
const httpResponsehandler_1 = require("../../../services/httpResponseHandler/httpResponsehandler");
const login_user_dto_1 = require("./dto/login-user.dto");
const Transformer_1 = require("./Transformer");
const InternalServerErrorSchema_1 = require("../../../../commons/contracts/swaggerDefinations/InternalServerErrorSchema");
const ForbiddenSchema_1 = require("../../../../commons/contracts/swaggerDefinations/ForbiddenSchema");
const BadRequestSchema_1 = require("../../../../commons/contracts/swaggerDefinations/BadRequestSchema");
const Pagination_dto_1 = require("../../../../commons/contracts/Pagination.dto");
const UnAuthorizedSchema_1 = require("../../../../commons/contracts/swaggerDefinations/UnAuthorizedSchema");
const badRequestErrorHandler_1 = require("../../../services/httpResponseHandler/badRequestErrorHandler");
const user_change_password_dto_1 = require("./dto/user-change-password.dto");
const update_user_profile_dto_copy_1 = require("./dto/update-user-profile.dto copy");
const AdminTokenAuthGuard_1 = require("../../jwt-auth/AdminTokenAuthGuard");
const conflictErrorHandler_1 = require("../../../services/httpResponseHandler/conflictErrorHandler");
const update_user_roles_dto_1 = require("./dto/update-user-roles.dto");
const internalServerErrorHandler_1 = require("../../../services/httpResponseHandler/internalServerErrorHandler");
let UsersController = class UsersController {
    constructor(usersService, userTransformer) {
        this.usersService = usersService;
        this.userTransformer = userTransformer;
        this.responseHandler = new httpResponsehandler_1.HttpResponsehandler();
    }
    async create(body, request, res) {
        body.creator_id = request.user.id;
        console.log("create admin user");
        console.log({ body });
        console.log(request.user);
        const result = await this.usersService.create(body);
        if (result.status === 409) {
            throw new conflictErrorHandler_1.ConflictErrorHandler("خطا. ایمیل ارسالی تکراری میباشد.");
        }
        else if (result.status === 500) {
            throw new InternalServerErrorSchema_1.default();
        }
        return this.responseHandler.send(res, 201, "کاربر جدید با موفقیت ایجاد شد.");
    }
    async userInfo(user_key, req, res) {
        const body = {
            user_key,
            token_id: req.user.id,
        };
        const result = await this.usersService.getUserInfo(body);
        if (result.status === 403) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("خطا. اجازه ادامه کار را ندارد.");
        }
        else if (result.status === 400) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("خطا. آیتم موردنظر موجود نمیباشد.");
        }
        else if (result.status === 500) {
            throw new InternalServerErrorSchema_1.default();
        }
        const transformer = this.userTransformer.transform(result.user);
        return this.responseHandler.send(res, 200, "مشخصات کاربر موردنظر در دسترس است.", transformer);
    }
    async login(registerAuthDto, req, res) {
        const result = await this.usersService.login(registerAuthDto.email, registerAuthDto.password);
        if (result.status === 400) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("خطا. ایمیل یا کلمه عبور اشتباه است.");
        }
        else if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        const transformer = this.userTransformer.transform(result.user);
        return this.responseHandler.send(res, common_1.HttpStatus.OK, "با موفقیت وارد شدید.", transformer);
    }
    async tokenValidaion(req, res) {
        const user_id = req.user.id;
        const result = await this.usersService.tokenValidaion(user_id);
        if (result.status === 403) {
            throw new ForbiddenSchema_1.default();
        }
        const transformer = this.userTransformer.transform(result.user);
        return this.responseHandler.send(res, 200, "اعتبار سنجی با موفقیت انجام شد.", transformer);
    }
    async findAll(paginationQuery, req, res) {
        paginationQuery.user_id = req.user.id;
        const result = await this.usersService.findAll(paginationQuery);
        if (result.status === 403) {
            throw new ForbiddenSchema_1.default();
        }
        const userTransformer = this.userTransformer.collection(result.users);
        return this.responseHandler.send(res, 200, "لیست کاربران پنل در دسترس است.", {
            data: userTransformer,
            metadata: result.metadata,
        });
    }
    async update(updateUserDto, req, res) {
        updateUserDto.user_id = req.user.id;
        const result = await this.usersService.updateUser(updateUserDto);
        if (result.status === 400) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("خطا. آیتم موردنظر موجود نمیباشد.");
        }
        else if (result.status === 403) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("خطا. اجازه ادامه کار را ندارد.");
        }
        else if (result.status === 409) {
            throw new conflictErrorHandler_1.ConflictErrorHandler("خطا. ایمیل وارد شده تکراری میباشد.");
        }
        else if (result.status === 500) {
            throw new InternalServerErrorSchema_1.default();
        }
        return this.responseHandler.send(res, 200, "بروزرسانی با موفقیت انجام شد");
    }
    async updateUserRoles(updateUserDto, req, res) {
        updateUserDto.user_id = req.user.id;
        const result = await this.usersService.updateRoles(updateUserDto);
        if (result.status === 400) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("خطا. آیتم موردنظر موجود نمیباشد.");
        }
        else if (result.status === 403) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("خطا. اجازه ادامه کار را ندارد.");
        }
        else if (result.status === 409) {
            throw new conflictErrorHandler_1.ConflictErrorHandler("خطا. ایمیل وارد شده تکراری میباشد.");
        }
        else if (result.status === 500) {
            throw new InternalServerErrorSchema_1.default();
        }
        return this.responseHandler.send(res, 200, "بروزرسانی با موفقیت انجام شد.");
    }
    async removeUser(user_id, req, res) {
        const result = await this.usersService.removeUser(user_id);
        if (result.status === 403) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("خطا. اجازه ادامه کار را ندارد.");
        }
        else if (result.status === 400) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("خطا. آیتم موردنظر موجود نمیباشد.");
        }
        else if (result.status === 500) {
            throw new InternalServerErrorSchema_1.default();
        }
        return this.responseHandler.send(res, 200, "عملیات حذف با موفقیت انجام شد.");
    }
    async changePassword(changePasswordDto, req, res) {
        changePasswordDto.token_id = req.user.id;
        const result = await this.usersService.changePassword(changePasswordDto);
        if (result.status === 403) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("خطا. اجازه ادامه کار را ندارد.");
        }
        else if (result.status === 400) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("خطا. آیتم موردنظر موجود نمیباشد.");
        }
        else if (result.status === 500) {
            throw new InternalServerErrorSchema_1.default();
        }
        return this.responseHandler.send(res, 200, "پسورد کاربر با موفقیت بروزرسانی شد.");
    }
    async updateProfile(updateUserDto, req, res) {
        updateUserDto.user_id = req.user.id;
        const result = await this.usersService.updateUserProfile(updateUserDto);
        if (result.status === 403) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("خطا. اجازه ادامه کار را ندارد.");
        }
        else if (result.status === 400) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("خطا. آیتم موردنظر موجود نمیباشد.");
        }
        else if (result.status === 500) {
            throw new InternalServerErrorSchema_1.default();
        }
        return this.responseHandler.send(res, 200, "بروزرسانی با موفقیت انجام شد");
    }
};
__decorate([
    (0, swagger_1.ApiCreatedResponse)({
        description: "کاربر جدید با موفقیت ایجاد شد.",
    }),
    (0, swagger_1.ApiConflictResponse)({
        description: "خطا. ایمیل ارسالی تکراری میباشد.",
    }),
    (0, common_1.UseGuards)(AdminTokenAuthGuard_1.default),
    (0, swagger_1.ApiSecurity)("JWT-auth"),
    (0, common_1.Post)("register"),
    (0, swagger_1.ApiOperation)({ summary: "ایجاد کاربر" }),
    (0, swagger_1.ApiBody)({ type: create_user_dto_1.CreateUserDto }),
    (0, nestjs_form_data_1.FormDataRequest)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "مشخصات کاربر موردنظر در دسترس است.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "number", example: 200 },
                message: {
                    type: "string",
                    example: "مشخصات کاربر موردنظر در دسترس است.",
                },
                error: { type: "string", example: "" },
                data: {
                    type: "object",
                    properties: {
                        statusCode: { type: "number", example: 201 },
                        message: {
                            type: "string",
                            example: "کاربر جدید با موفقیت ایجاد شد.",
                        },
                        error: { type: "string", example: "" },
                        data: {
                            type: "object",
                            properties: {
                                id: { type: "number" },
                                name: { type: "string" },
                                email: { type: "string" },
                                uniq_key: { type: "string" },
                                phone: { type: "string" },
                                avatar: { type: "string" },
                                token: { type: "string" },
                                refresh_token: { type: "string" },
                                status: { type: "string", example: "active, inactive" },
                                created_at: { type: "string" },
                                roles: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            id: { type: "string" },
                                            title: { type: "string" },
                                            description: { type: "string" },
                                            key: { type: "string" },
                                            categories: {
                                                type: "array",
                                                items: {
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
                                                                },
                                                            },
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: "خطا. آیتم موردنظر موجود نمیباشد.",
        type: ForbiddenSchema_1.default,
        schema: {
            $ref: (0, swagger_1.getSchemaPath)(BadRequestSchema_1.default),
        },
    }),
    (0, swagger_1.ApiForbiddenResponse)({
        description: "خطا. اجازه ادامه کار را ندارید.",
        type: ForbiddenSchema_1.default,
        schema: {
            $ref: (0, swagger_1.getSchemaPath)(ForbiddenSchema_1.default),
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "دریافت اطلاعات کاربر پنل" }),
    (0, common_1.UseGuards)(AdminTokenAuthGuard_1.default),
    (0, swagger_1.ApiSecurity)("JWT-auth"),
    (0, common_1.Get)("/info/:user_key"),
    __param(0, (0, common_1.Param)("user_key")),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "userInfo", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "با موفقیت وارد شدید.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "number", example: 200 },
                message: { type: "string", example: "با موفقیت وارد شدید." },
                error: { type: "string", example: "" },
                data: {
                    type: "object",
                    properties: {
                        statusCode: { type: "number", example: 201 },
                        message: {
                            type: "string",
                            example: "کاربر جدید با موفقیت ایجاد شد.",
                        },
                        error: { type: "string", example: "" },
                        data: {
                            type: "object",
                            properties: {
                                id: { type: "number" },
                                name: { type: "string" },
                                email: { type: "string" },
                                uniq_key: { type: "string" },
                                phone: { type: "string" },
                                avatar: { type: "string" },
                                token: { type: "string" },
                                refresh_token: { type: "string" },
                                status: { type: "string", example: "active, inactive" },
                                roles: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            id: { type: "string" },
                                            title: { type: "string" },
                                            description: { type: "string" },
                                            key: { type: "string" },
                                            categories: {
                                                type: "array",
                                                items: {
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
                                                                },
                                                            },
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        type: BadRequestSchema_1.default,
        description: "خطا. ایمیل یا کلمه عبور صحیح نمیباشد.",
    }),
    (0, swagger_1.ApiOperation)({ summary: "لاگین کاربر به داشبورد" }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, nestjs_form_data_1.FormDataRequest)(),
    (0, swagger_1.ApiBody)({ type: login_user_dto_1.LoginUserDto }),
    (0, common_1.Post)("/login"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_user_dto_1.LoginUserDto, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "login", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "اعتبار سنجی با موفقیت انجام شد.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "number", example: 200 },
                message: { type: "string", example: "اعتبار سنجی با موفقیت انجام شد." },
                error: { type: "string", example: "" },
                data: {
                    type: "object",
                    properties: {
                        id: { type: "number" },
                        name: { type: "string" },
                        email: { type: "string" },
                        uniq_key: { type: "string" },
                        phone: { type: "string" },
                        avatar: { type: "string" },
                        token: { type: "string" },
                        refresh_token: { type: "string" },
                        status: { type: "string", example: "active, inactive" },
                        created_at: { type: "string" },
                        roles: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    id: { type: "string" },
                                    title: { type: "string" },
                                    description: { type: "string" },
                                    key: { type: "string" },
                                    categories: {
                                        type: "array",
                                        items: {
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
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
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
    (0, swagger_1.ApiOperation)({ summary: "اعتبار سنجی توکن " }),
    (0, common_1.UseGuards)(AdminTokenAuthGuard_1.default),
    (0, swagger_1.ApiSecurity)("JWT-auth"),
    (0, common_1.Post)("/auth"),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "tokenValidaion", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "لیست کاربران پنل در دسترس است.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "number", example: 200 },
                message: { type: "string", example: "لیست کاربران پنل در دسترس است." },
                error: { type: "string", example: "" },
                data: {
                    type: "object",
                    properties: {
                        data: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    id: { type: "number" },
                                    name: { type: "string" },
                                    email: { type: "string" },
                                    uniq_key: { type: "string" },
                                    phone: { type: "string" },
                                    avatar: { type: "string" },
                                    token: { type: "string" },
                                    refresh_token: { type: "string" },
                                    status: { type: "string", example: "active, inactive" },
                                    created_at: { type: "string" },
                                    roles: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                id: { type: "string" },
                                                title: { type: "string" },
                                                description: { type: "string" },
                                                key: { type: "string" },
                                                categories: {
                                                    type: "array",
                                                    items: {
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
                                                                    },
                                                                },
                                                            },
                                                        },
                                                    },
                                                },
                                            },
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
    (0, swagger_1.ApiOperation)({ summary: "لیست کاربران پنل" }),
    (0, common_1.UseGuards)(AdminTokenAuthGuard_1.default),
    (0, swagger_1.ApiSecurity)("JWT-auth"),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Pagination_dto_1.PaginationDto, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "ویرایش با موفقیت انجام شد.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "number", example: 200 },
                message: {
                    type: "string",
                    example: "ویرایش با موفقیت انجام شد.",
                },
                error: { type: "string", example: "" },
                data: {
                    type: "object",
                    properties: {
                        id: { type: "number" },
                        name: { type: "string" },
                        email: { type: "string" },
                        uniq_key: { type: "string" },
                        phone: { type: "string" },
                        avatar: { type: "string" },
                        token: { type: "string" },
                        refresh_token: { type: "string" },
                        status: { type: "string", example: "active || inactive" },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: "خطا. آیتم موردنظر موجود نمیباشد.",
        type: ForbiddenSchema_1.default,
        schema: {
            $ref: (0, swagger_1.getSchemaPath)(BadRequestSchema_1.default),
        },
    }),
    (0, swagger_1.ApiConflictResponse)({
        description: "خطا. ایمیل وارد شده تکراری میباشد.",
    }),
    (0, swagger_1.ApiForbiddenResponse)({
        description: "خطا. اجازه ادامه کار را ندارید.",
        type: ForbiddenSchema_1.default,
        schema: {
            $ref: (0, swagger_1.getSchemaPath)(ForbiddenSchema_1.default),
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "ویرایش کاربران پنل" }),
    (0, swagger_1.ApiBody)({ type: update_user_dto_1.UpdateUserDto }),
    (0, nestjs_form_data_1.FormDataRequest)(),
    (0, common_1.UseGuards)(AdminTokenAuthGuard_1.default),
    (0, swagger_1.ApiSecurity)("JWT-auth"),
    (0, common_1.Patch)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_user_dto_1.UpdateUserDto, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "بروزرسانی با موفقیت انجام شد.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "number", example: 200 },
                message: {
                    type: "string",
                    example: "ویرایش با موفقیت انجام شد.",
                },
                error: { type: "string", example: "" },
                data: {
                    type: "object",
                    properties: {
                        id: { type: "number" },
                        name: { type: "string" },
                        email: { type: "string" },
                        uniq_key: { type: "string" },
                        phone: { type: "string" },
                        avatar: { type: "string" },
                        token: { type: "string" },
                        refresh_token: { type: "string" },
                        status: { type: "string", example: "active || inactive" },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: "بروزرسانی با موفقیت انجام شد.",
        type: ForbiddenSchema_1.default,
        schema: {
            $ref: (0, swagger_1.getSchemaPath)(BadRequestSchema_1.default),
        },
    }),
    (0, swagger_1.ApiForbiddenResponse)({
        description: "خطا. اجازه ادامه کار را ندارید.",
        type: ForbiddenSchema_1.default,
        schema: {
            $ref: (0, swagger_1.getSchemaPath)(ForbiddenSchema_1.default),
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "بروزرسانی نقش ها" }),
    (0, common_1.UseGuards)(AdminTokenAuthGuard_1.default),
    (0, swagger_1.ApiSecurity)("JWT-auth"),
    (0, common_1.Patch)("roles"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_user_roles_dto_1.UpdateUserRolesDto, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateUserRoles", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "عملیات حذف با موفقیت انجام شد.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "number", example: 200 },
                message: {
                    type: "string",
                    example: "عملیات حذف با موفقیت انجام شد.",
                },
                error: { type: "string", example: "" },
                data: {
                    type: "object",
                    properties: {},
                },
            },
        },
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: "خطا. آیتم موردنظر موجود نمیباشد.",
        type: ForbiddenSchema_1.default,
        schema: {
            $ref: (0, swagger_1.getSchemaPath)(BadRequestSchema_1.default),
        },
    }),
    (0, swagger_1.ApiForbiddenResponse)({
        description: "خطا. اجازه ادامه کار را ندارید.",
        type: ForbiddenSchema_1.default,
        schema: {
            $ref: (0, swagger_1.getSchemaPath)(ForbiddenSchema_1.default),
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "حذف کاربر" }),
    (0, common_1.UseGuards)(AdminTokenAuthGuard_1.default),
    (0, swagger_1.ApiSecurity)("JWT-auth"),
    (0, common_1.Delete)(":user_id"),
    __param(0, (0, common_1.Param)("user_id")),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "removeUser", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "پسورد کاربر با موفقیت بروزرسانی شد.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "number", example: 200 },
                message: {
                    type: "string",
                    example: "پسورد کاربر با موفقیت بروزرسانی شد.",
                },
                error: { type: "string", example: "" },
                data: {
                    type: "object",
                    properties: {},
                },
            },
        },
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: "خطا. آیتم موردنظر موجود نمیباشد.",
        type: ForbiddenSchema_1.default,
        schema: {
            $ref: (0, swagger_1.getSchemaPath)(BadRequestSchema_1.default),
        },
    }),
    (0, swagger_1.ApiForbiddenResponse)({
        description: "خطا. اجازه ادامه کار را ندارید.",
        type: ForbiddenSchema_1.default,
        schema: {
            $ref: (0, swagger_1.getSchemaPath)(ForbiddenSchema_1.default),
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "تغییر پسورد" }),
    (0, common_1.UseGuards)(AdminTokenAuthGuard_1.default),
    (0, swagger_1.ApiSecurity)("JWT-auth"),
    (0, nestjs_form_data_1.FormDataRequest)(),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, common_1.Post)("/change_password"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_change_password_dto_1.UserChangePasswordDto, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "changePassword", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "ویرایش با موفقیت انجام شد.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "number", example: 200 },
                message: {
                    type: "string",
                    example: "ویرایش با موفقیت انجام شد.",
                },
                error: { type: "string", example: "" },
                data: {
                    type: "object",
                    properties: {},
                },
            },
        },
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: "خطا. آیتم موردنظر موجود نمیباشد.",
        type: ForbiddenSchema_1.default,
        schema: {
            $ref: (0, swagger_1.getSchemaPath)(BadRequestSchema_1.default),
        },
    }),
    (0, swagger_1.ApiForbiddenResponse)({
        description: "خطا. اجازه ادامه کار را ندارید.",
        type: ForbiddenSchema_1.default,
        schema: {
            $ref: (0, swagger_1.getSchemaPath)(ForbiddenSchema_1.default),
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "ویرایش پروفایل توسط کاربر پنل" }),
    (0, swagger_1.ApiBody)({ type: update_user_profile_dto_copy_1.UpdateUserProfileDto }),
    (0, nestjs_form_data_1.FormDataRequest)(),
    (0, common_1.UseGuards)(AdminTokenAuthGuard_1.default),
    (0, swagger_1.ApiSecurity)("JWT-auth"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_user_profile_dto_copy_1.UpdateUserProfileDto, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateProfile", null);
UsersController = __decorate([
    (0, swagger_1.ApiTags)("v1/dashboard-users"),
    (0, common_1.Controller)("v1/admin/users"),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        Transformer_1.default])
], UsersController);
exports.UsersController = UsersController;
//# sourceMappingURL=users.controller.js.map