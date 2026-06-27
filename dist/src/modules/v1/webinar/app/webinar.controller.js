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
exports.WebinarController = void 0;
const common_1 = require("@nestjs/common");
const webinar_service_1 = require("./webinar.service");
const httpResponsehandler_1 = require("../../../services/httpResponseHandler/httpResponsehandler");
const jwt_auth_guard_1 = require("../../jwt-auth/jwt-auth.guard");
const Transformer_1 = require("./Transformer");
const swagger_1 = require("@nestjs/swagger");
const InternalServerErrorSchema_1 = require("../../../../commons/contracts/swaggerDefinations/InternalServerErrorSchema");
const EventService_1 = require("../provider/EventService");
const create_webinar_dto_1 = require("./dto/create-webinar.dto");
const nestjs_form_data_1 = require("nestjs-form-data");
const SaveProceedingDto_1 = require("./dto/SaveProceedingDto");
const delete_webinar_dto_ts_1 = require("./dto/delete-webinar.dto.ts");
const forbiddenErrorHandler_1 = require("../../../services/httpResponseHandler/forbiddenErrorHandler");
const update_webinar_dto_1 = require("./dto/update-webinar.dto");
const InviteContactDto_1 = require("./dto/InviteContactDto");
const ClientWebinarsDto_1 = require("./dto/ClientWebinarsDto");
const InvitedClientsIntoWebinarDto_1 = require("./dto/InvitedClientsIntoWebinarDto");
const Pagination_dto_1 = require("../../../../commons/contracts/Pagination.dto");
const common_2 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
const tooManyRequestErrorHandler_1 = require("../../../services/httpResponseHandler/tooManyRequestErrorHandler");
let WebinarController = class WebinarController {
    constructor(weninarService, cacheManager) {
        this.weninarService = weninarService;
        this.cacheManager = cacheManager;
        this.responsehandler = new httpResponsehandler_1.HttpResponsehandler();
        this.webinarTransformer = new Transformer_1.default();
        this.eventService = new EventService_1.default();
    }
    async store(createWebinarDto, req, res) {
        createWebinarDto.user_id = req.user.id;
        const result = await this.weninarService.store(createWebinarDto);
        if (result.status === 500) {
            throw new InternalServerErrorSchema_1.default();
        }
        const transformer = this.webinarTransformer.transform(result.webinar, result.client);
        return this.responsehandler.send(res, 201, "وبینار جدید با موفقیت ثبت شد.", transformer);
    }
    async findAllMyOwnWebinars(query, req, res) {
        query.user_id = req.user.id;
        const weninars = await this.weninarService.findAllMyOwnWebinars(query);
        if (weninars.status === 500) {
            throw new InternalServerErrorSchema_1.default();
        }
        else if (weninars.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        const webinarTransformer = this.webinarTransformer.collection(weninars.list, weninars.client_info);
        return this.responsehandler.send(res, 200, "لیست وبینارهای کاربر در دسترس است.", {
            data: webinarTransformer,
            metadata: weninars.metadata,
        });
    }
    async findAllMyWebinars(query, req, res) {
        console.log("*** Get Webinar/user ***");
        query.client_id = req.user.id;
        const result = await this.weninarService.findAllMyWebinars(query);
        if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        return this.responsehandler.send(res, 200, "لیست وبینارهای کاربر در دسترس است.", result.data.presentedWebinars);
    }
    async CustomRateLimitRequest(req, method, route, client_id, params) {
        console.log("*** CustomRateLimitRequest ***");
        const ip = this.getUserIP(req);
        const key = this.generateCacheKey(ip, method, route, client_id, params);
        console.log({ key });
        const rateLimit = await this.cacheManager.get(key);
        if (!rateLimit) {
            await this.cacheManager.set(key, { created_at: new Date(Date.now()) });
        }
        else {
            throw new tooManyRequestErrorHandler_1.tooManyRequestErrorHandler();
        }
    }
    getUserIP(req) {
        return (req.headers["x-forwarded-for"] ||
            req.socket.remoteAddress);
    }
    generateCacheKey(ip, method, route, client_id, params) {
        const paramsKeys = Object.keys(params);
        const paramsList = paramsKeys
            .map((param) => param + "_" + params[param])
            .join("_");
        return `${method}/${route}___client_id_${client_id}_${paramsList}__ip_address_${ip}`;
    }
    async findInvitedWebinars(query, req, res) {
        const data = await this.weninarService.findInvitedWebinars(query.webinar_id);
        const webinarTransformer = this.webinarTransformer.guestCollection(data);
        return this.responsehandler.send(res, 200, "لیست کاربران دعوت شده به وبینار در دسترس است.", webinarTransformer);
    }
    async saveProceeding(saveProceeding, req, res) {
        saveProceeding.user_id = req.user.id;
        const result = await this.weninarService.saveProceeding(saveProceeding);
        if (!result) {
            throw new InternalServerErrorSchema_1.default();
        }
        return this.responsehandler.send(res, 201, "صورتجلسه با موفقیت ذخیره شد.");
    }
    async deleteWebinar(deleteWebinarDto, req, res) {
        deleteWebinarDto.user_id = req.user.id;
        const result = await this.weninarService.deleteWebinar(deleteWebinarDto);
        if (result.status === 500) {
            throw new InternalServerErrorSchema_1.default();
        }
        else if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        return this.responsehandler.send(res, 200, "وبینار موردنظر با موفقیت حذف شد.");
    }
    async inActive(deleteWebinarDto, req, res) {
        deleteWebinarDto.user_id = req.user.id;
        const result = await this.weninarService.webinarStatusInactived(deleteWebinarDto);
        if (result.status === 500) {
            throw new InternalServerErrorSchema_1.default();
        }
        else if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        return this.responsehandler.send(res, 200, "وبینار موردنظر با موفقیت غیرفعال شد.");
    }
    async updateWbinar(updateWebinarDto, req, res) {
        updateWebinarDto.user_id = req.user.id;
        const result = await this.weninarService.updateWebinar(updateWebinarDto);
        if (result.status === 500) {
            throw new InternalServerErrorSchema_1.default();
        }
        else if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        const transformer = this.webinarTransformer.transform(result.webinar, result.client);
        return this.responsehandler.send(res, 200, "وبینار موردنظر با موفقیت حذف شد.", transformer);
    }
    async inviteContactToWebinar(inviteContactDto, req, res) {
        inviteContactDto.user_id = req.user.id;
        console.log("*** invite ***");
        console.log(inviteContactDto);
        const result = await this.weninarService.inviteContactToWebinar(inviteContactDto);
        if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        if (result.status === 500) {
            throw new InternalServerErrorSchema_1.default();
        }
        return this.responsehandler.send(res, 200, "مخاطبین شما به وبینار اضافه شدند.");
    }
};
__decorate([
    (0, swagger_1.ApiCreatedResponse)({
        description: "وبینار جدید با موفقیت ثبت شد.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 201 },
                message: {
                    type: "string",
                    example: "وبینار جدید با موفقیت ثبت شد.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 1 },
                        is_owner: { type: "boolean", example: false },
                        title: { type: "string" },
                        description: { type: "string" },
                        type: {
                            type: "string",
                            example: "نوع وبنیار: private, public",
                        },
                        tag: { type: "string" },
                        event_link: { type: "string" },
                        status: {
                            type: "string",
                            example: "وضعیت به 2 حالت ثبت میشود: active, inactive,",
                        },
                        proceeding: { type: "string", example: "متن صورتجلسه" },
                        guest_access: {
                            type: "string",
                            example: "اگر مقدار 1 داشته باشد یعنی کاربران مهمان اجازه دسترسی به وبینار را دارند.",
                        },
                        guest_count: {
                            type: "integer",
                            example: "در صورتیکه کاربران مهمان مجاز به شرکت در وبینار باشد عدد آن بیشتر از 0 است و اگر کاربران مهمان مجاز نباشند عدد آن 0 است.",
                        },
                        created_at: { type: "string" },
                        started_at: { type: "string" },
                        start_time: { type: "string" },
                        end_time: { type: "string" },
                        login_info: {
                            type: "object",
                            properties: {
                                username: { type: "string" },
                                password: { type: "string" },
                            },
                        },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiBody)({ type: create_webinar_dto_1.CreateWebinarDto }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, swagger_1.ApiOperation)({ summary: "ایجاد وبینار توسط کاربران" }),
    (0, nestjs_form_data_1.FormDataRequest)(),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_webinar_dto_1.CreateWebinarDto, Object, Object]),
    __metadata("design:returntype", Promise)
], WebinarController.prototype, "store", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "لیست وبینارها",
        description: "صفحه بندی وجود دارد.",
    }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, swagger_1.ApiOkResponse)({
        description: "لیست وبینارهای کاربر در دسترس است.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "لیست وبینارهای کاربر در دسترس است.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {
                        data: {
                            type: "array",
                            items: {
                                properties: {
                                    id: { type: "integer", example: 1 },
                                    is_owner: { type: "boolean", example: false },
                                    title: { type: "string" },
                                    description: { type: "string" },
                                    type: {
                                        type: "string",
                                        example: "private, public",
                                    },
                                    tag: { type: "string" },
                                    event_link: { type: "string" },
                                    status: {
                                        type: "string",
                                        example: "وضعیت به 2 حالت ثبت میشود: active, inactive,",
                                    },
                                    proceeding: { type: "string", example: "متن صورتجلسه" },
                                    guest_access: {
                                        type: "string",
                                        example: "اگر مقدار 1 داشته باشد یعنی کاربران مهمان اجازه دسترسی به وبینار را دارند.",
                                    },
                                    guest_count: {
                                        type: "integer",
                                        example: "در صورتیکه کاربران مهمان مجاز به شرکت در وبینار باشد عدد آن بیشتر از 0 است و اگر کاربران مهمان مجاز نباشند عدد آن 0 است.",
                                    },
                                    created_at: { type: "string" },
                                    started_at: { type: "string" },
                                    start_time: { type: "string" },
                                    end_time: { type: "string" },
                                    login_info: {
                                        type: "object",
                                        properties: {
                                            username: { type: "string" },
                                            password: { type: "string" },
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
    (0, common_1.Get)("/list"),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Pagination_dto_1.PaginationDto, Object, Object]),
    __metadata("design:returntype", Promise)
], WebinarController.prototype, "findAllMyOwnWebinars", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "دریافت وبینار های کاربر",
        description: "لیست وبینار های کاربر بر اساس ماه و سال جاری ارسال میشود. \n \nماه و سال به میلادی و به صورت عددی ارسال شود",
    }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, swagger_1.ApiOkResponse)({
        description: "لیست وبینارهای کاربر در دسترس است.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "لیست وبینارهای کاربر در دسترس است.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {
                        1: {
                            type: "array",
                            items: {
                                properties: {
                                    id: { type: "integer", example: 1 },
                                    is_owner: { type: "boolean", example: false },
                                    title: { type: "string" },
                                    description: { type: "string" },
                                    type: {
                                        type: "string",
                                        example: "private, public",
                                    },
                                    tag: { type: "string" },
                                    event_link: { type: "string" },
                                    status: {
                                        type: "string",
                                        example: "وضعیت به 2 حالت ثبت میشود: active, inactive,",
                                    },
                                    proceeding: { type: "string", example: "متن صورتجلسه" },
                                    guest_access: {
                                        type: "string",
                                        example: "اگر مقدار 1 داشته باشد یعنی کاربران مهمان اجازه دسترسی به وبینار را دارند.",
                                    },
                                    guest_count: {
                                        type: "integer",
                                        example: "در صورتیکه کاربران مهمان مجاز به شرکت در وبینار باشد عدد آن بیشتر از 0 است و اگر کاربران مهمان مجاز نباشند عدد آن 0 است.",
                                    },
                                    created_at: { type: "string" },
                                    started_at: { type: "string" },
                                    start_time: { type: "string" },
                                    end_time: { type: "string" },
                                    login_info: {
                                        type: "object",
                                        properties: {
                                            username: { type: "string" },
                                            password: { type: "string" },
                                        },
                                    },
                                },
                            },
                        },
                        2: {
                            type: "array",
                            items: {
                                properties: {
                                    id: { type: "integer", example: 1 },
                                    is_owner: { type: "boolean", example: false },
                                    title: { type: "string" },
                                    description: { type: "string" },
                                    type: {
                                        type: "string",
                                        example: "private, public",
                                    },
                                    tag: { type: "string" },
                                    event_link: { type: "string" },
                                    status: {
                                        type: "string",
                                        example: "وضعیت به 2 حالت ثبت میشود: active, inactive,",
                                    },
                                    proceeding: { type: "string", example: "متن صورتجلسه" },
                                    guest_access: {
                                        type: "string",
                                        example: "اگر مقدار 1 داشته باشد یعنی کاربران مهمان اجازه دسترسی به وبینار را دارند.",
                                    },
                                    guest_count: {
                                        type: "integer",
                                        example: "در صورتیکه کاربران مهمان مجاز به شرکت در وبینار باشد عدد آن بیشتر از 0 است و اگر کاربران مهمان مجاز نباشند عدد آن 0 است.",
                                    },
                                    created_at: { type: "string" },
                                    started_at: { type: "string" },
                                    start_time: { type: "string" },
                                    end_time: { type: "string" },
                                    login_info: {
                                        type: "object",
                                        properties: {
                                            username: { type: "string" },
                                            password: { type: "string" },
                                        },
                                    },
                                },
                            },
                        },
                        3: {
                            type: "array",
                            items: {
                                properties: {
                                    id: { type: "integer", example: 1 },
                                    is_owner: { type: "boolean", example: false },
                                    title: { type: "string" },
                                    description: { type: "string" },
                                    type: {
                                        type: "string",
                                        example: "private, public",
                                    },
                                    tag: { type: "string" },
                                    event_link: { type: "string" },
                                    status: {
                                        type: "string",
                                        example: "وضعیت به 2 حالت ثبت میشود: active, inactive,",
                                    },
                                    proceeding: { type: "string", example: "متن صورتجلسه" },
                                    guest_access: {
                                        type: "string",
                                        example: "اگر مقدار 1 داشته باشد یعنی کاربران مهمان اجازه دسترسی به وبینار را دارند.",
                                    },
                                    guest_count: {
                                        type: "integer",
                                        example: "در صورتیکه کاربران مهمان مجاز به شرکت در وبینار باشد عدد آن بیشتر از 0 است و اگر کاربران مهمان مجاز نباشند عدد آن 0 است.",
                                    },
                                    created_at: { type: "string" },
                                    started_at: { type: "string" },
                                    start_time: { type: "string" },
                                    end_time: { type: "string" },
                                    login_info: {
                                        type: "object",
                                        properties: {
                                            username: { type: "string" },
                                            password: { type: "string" },
                                        },
                                    },
                                },
                            },
                        },
                        4: {
                            type: "array",
                            items: {
                                properties: {
                                    id: { type: "integer", example: 1 },
                                    is_owner: { type: "boolean", example: false },
                                    title: { type: "string" },
                                    description: { type: "string" },
                                    type: {
                                        type: "string",
                                        example: "private, public",
                                    },
                                    tag: { type: "string" },
                                    event_link: { type: "string" },
                                    status: {
                                        type: "string",
                                        example: "وضعیت به 2 حالت ثبت میشود: active, inactive,",
                                    },
                                    proceeding: { type: "string", example: "متن صورتجلسه" },
                                    guest_access: {
                                        type: "string",
                                        example: "اگر مقدار 1 داشته باشد یعنی کاربران مهمان اجازه دسترسی به وبینار را دارند.",
                                    },
                                    guest_count: {
                                        type: "integer",
                                        example: "در صورتیکه کاربران مهمان مجاز به شرکت در وبینار باشد عدد آن بیشتر از 0 است و اگر کاربران مهمان مجاز نباشند عدد آن 0 است.",
                                    },
                                    created_at: { type: "string" },
                                    started_at: { type: "string" },
                                    start_time: { type: "string" },
                                    end_time: { type: "string" },
                                    login_info: {
                                        type: "object",
                                        properties: {
                                            username: { type: "string" },
                                            password: { type: "string" },
                                        },
                                    },
                                },
                            },
                        },
                        5: {
                            type: "array",
                            items: {
                                properties: {
                                    id: { type: "integer", example: 1 },
                                    is_owner: { type: "boolean", example: false },
                                    title: { type: "string" },
                                    description: { type: "string" },
                                    type: {
                                        type: "string",
                                        example: "private, public",
                                    },
                                    tag: { type: "string" },
                                    event_link: { type: "string" },
                                    status: {
                                        type: "string",
                                        example: "وضعیت به 2 حالت ثبت میشود: active, inactive,",
                                    },
                                    proceeding: { type: "string", example: "متن صورتجلسه" },
                                    guest_access: {
                                        type: "string",
                                        example: "اگر مقدار 1 داشته باشد یعنی کاربران مهمان اجازه دسترسی به وبینار را دارند.",
                                    },
                                    guest_count: {
                                        type: "integer",
                                        example: "در صورتیکه کاربران مهمان مجاز به شرکت در وبینار باشد عدد آن بیشتر از 0 است و اگر کاربران مهمان مجاز نباشند عدد آن 0 است.",
                                    },
                                    created_at: { type: "string" },
                                    started_at: { type: "string" },
                                    start_time: { type: "string" },
                                    end_time: { type: "string" },
                                    login_info: {
                                        type: "object",
                                        properties: {
                                            username: { type: "string" },
                                            password: { type: "string" },
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
    (0, swagger_1.ApiQuery)({ type: ClientWebinarsDto_1.ClientWebinarsDto }),
    (0, common_1.Get)("/user"),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], WebinarController.prototype, "findAllMyWebinars", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: " لیست کاربران دعوت شده به وبینار",
        description: "دریافت لیست کاربران دعوت شده به وبینار",
    }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, swagger_1.ApiOkResponse)({
        description: "لیست کاربران دعوت شده به وبینار در دسترس است.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "لیست کاربران دعوت شده به وبینار در دسترس است.",
                },
                error: { type: "string" },
                data: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            client_id: { type: "integer", example: 12 },
                            userid: { type: "integer", example: 12 },
                            display_name: {
                                type: "strint",
                                example: "پوریا میرخباز",
                            },
                            phone: { type: "string", example: "09183372684" },
                            role: { type: "string", example: "teacher" },
                        },
                    },
                },
            },
        },
    }),
    (0, common_1.Get)("/members"),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [InvitedClientsIntoWebinarDto_1.InvitedClientsIntoWebinarDto, Object, Object]),
    __metadata("design:returntype", Promise)
], WebinarController.prototype, "findInvitedWebinars", null);
__decorate([
    (0, swagger_1.ApiCreatedResponse)({
        description: "صورتجلسه با موفقیت ذخیره شد.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 201 },
                message: {
                    type: "string",
                    example: "صورتجلسه با موفقیت ذخیره شد.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {},
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({
        summary: "ثبت صورتجلسه برای وبینار",
        description: "برای ثبت و ویرایش صورتجلسه میتوان از این \n\n API \n\n استفاده کرد.",
    }),
    (0, swagger_1.ApiBody)({ type: SaveProceedingDto_1.SaveProceedingDto }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, common_1.Post)("/proceeding"),
    (0, nestjs_form_data_1.FormDataRequest)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SaveProceedingDto_1.SaveProceedingDto, Object, Object]),
    __metadata("design:returntype", Promise)
], WebinarController.prototype, "saveProceeding", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "وبینار موردنظر با موفقیت حذف شد.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "وبینار موردنظر با موفقیت حذف شد.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {},
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "حذف وبینار" }),
    (0, common_1.Delete)(":webinar_id"),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [delete_webinar_dto_ts_1.DeleteWebinarDto, Object, Object]),
    __metadata("design:returntype", Promise)
], WebinarController.prototype, "deleteWebinar", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "وبینار موردنظر با موفقیت غیرفعال شد.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "وبینار موردنظر با موفقیت غیرفعال شد.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {},
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "غیرفعال کردن وبینار" }),
    (0, common_1.Delete)("/inactive/:webinar_id"),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [delete_webinar_dto_ts_1.DeleteWebinarDto, Object, Object]),
    __metadata("design:returntype", Promise)
], WebinarController.prototype, "inActive", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "وبینار با موفقیت ویرایش شد.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "وبینار با موفقیت ویرایش شد.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 1 },
                        is_owner: { type: "boolean", example: false },
                        title: { type: "string" },
                        description: { type: "string" },
                        type: {
                            type: "string",
                            example: "نوع وبنیار: private, public",
                        },
                        tag: { type: "string" },
                        event_link: { type: "string" },
                        status: {
                            type: "string",
                            example: "وضعیت به 2 حالت ثبت میشود: active, inactive,",
                        },
                        proceeding: { type: "string", example: "متن صورتجلسه" },
                        guest_access: {
                            type: "string",
                            example: "اگر مقدار 1 داشته باشد یعنی کاربران مهمان اجازه دسترسی به وبینار را دارند.",
                        },
                        guest_count: {
                            type: "integer",
                            example: "در صورتیکه کاربران مهمان مجاز به شرکت در وبینار باشد عدد آن بیشتر از 0 است و اگر کاربران مهمان مجاز نباشند عدد آن 0 است.",
                        },
                        created_at: { type: "string" },
                        started_at: { type: "string" },
                        start_time: { type: "string" },
                        end_time: { type: "string" },
                        login_info: {
                            type: "object",
                            properties: {
                                username: { type: "string" },
                                password: { type: "string" },
                            },
                        },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "ویرایش وبینار" }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, nestjs_form_data_1.FormDataRequest)(),
    (0, common_1.Patch)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_webinar_dto_1.UpdateWebinarDto, Object, Object]),
    __metadata("design:returntype", Promise)
], WebinarController.prototype, "updateWbinar", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "افزودن مخاطبین به وبینار",
        description: "مخاطبین خود را به وبینار دعوت کنید.",
    }),
    (0, swagger_1.ApiOkResponse)({
        description: "مخاطبین شما به وبینار اضافه شدند.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "مخاطبین شما به وبینار اضافه شدند.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {},
                },
            },
        },
    }),
    (0, common_1.Post)("/invite"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [InviteContactDto_1.InviteContactDto, Object, Object]),
    __metadata("design:returntype", Promise)
], WebinarController.prototype, "inviteContactToWebinar", null);
WebinarController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiSecurity)("JWT-auth"),
    (0, swagger_1.ApiTags)("v1/app-webinar"),
    (0, common_1.Controller)("v1/app/webinar"),
    __param(1, (0, common_2.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [webinar_service_1.WebinarService, Object])
], WebinarController);
exports.WebinarController = WebinarController;
//# sourceMappingURL=webinar.controller.js.map