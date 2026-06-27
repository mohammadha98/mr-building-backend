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
const Transformer_1 = require("./Transformer");
const swagger_1 = require("@nestjs/swagger");
const BadRequestSchema_1 = require("../../../../commons/contracts/swaggerDefinations/BadRequestSchema");
const InternalServerErrorSchema_1 = require("../../../../commons/contracts/swaggerDefinations/InternalServerErrorSchema");
const UnProcessableEntitySchema_1 = require("../../../../commons/contracts/swaggerDefinations/UnProcessableEntitySchema");
const NotFoundSchema_1 = require("../../../../commons/contracts/swaggerDefinations/NotFoundSchema");
const ForbiddenSchema_1 = require("../../../../commons/contracts/swaggerDefinations/ForbiddenSchema");
const UnAuthorizedSchema_1 = require("../../../../commons/contracts/swaggerDefinations/UnAuthorizedSchema");
const delete_webinar_dto_ts_1 = require("./dto/delete-webinar.dto.ts");
const forbiddenErrorHandler_1 = require("../../../services/httpResponseHandler/forbiddenErrorHandler");
const InvitedClientsIntoWebinarDto_1 = require("./dto/InvitedClientsIntoWebinarDto");
const Pagination_dto_1 = require("../../../../commons/contracts/Pagination.dto");
const AdminTokenAuthGuard_1 = require("../../jwt-auth/AdminTokenAuthGuard");
let WebinarController = class WebinarController {
    constructor(weninarService) {
        this.weninarService = weninarService;
        this.responsehandler = new httpResponsehandler_1.HttpResponsehandler();
        this.webinarTransformer = new Transformer_1.default();
    }
    async finWebinars(query, req, res) {
        query.user_id = req.user.id;
        const result = await this.weninarService.findAllWebinars(query);
        const webinarTransformer = this.webinarTransformer.collection(result.webinars);
        return this.responsehandler.send(res, 200, "لیست وبینارها در دسترس است.", {
            data: webinarTransformer,
            metadata: result.metadata,
        });
    }
    async findInvitedWebinars(query, res) {
        const data = await this.weninarService.findInvitedWebinars(query.webinar_id);
        const webinarTransformer = this.webinarTransformer.guestCollection(data);
        return this.responsehandler.send(res, 200, "لیست کاربران دعوت شده به وبینار در دسترس است.", webinarTransformer);
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
};
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "دریافت وبینار ها",
        description: "دریافت وبینار های ثبت شده",
    }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, swagger_1.ApiOkResponse)({
        description: "لیست وبینارها در دسترس است.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "لیست وبینارها در دسترس است.",
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
    (0, swagger_1.ApiInternalServerErrorResponse)({
        type: InternalServerErrorSchema_1.default,
        description: "خطای سرور. لطفا کمی بعد تلاش کنید",
        schema: {
            $ref: (0, swagger_1.getSchemaPath)(InternalServerErrorSchema_1.default),
        },
    }),
    (0, swagger_1.ApiQuery)({ type: Pagination_dto_1.PaginationDto }),
    (0, common_1.Get)("/list"),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], WebinarController.prototype, "finWebinars", null);
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
    (0, swagger_1.ApiBadRequestResponse)({
        type: BadRequestSchema_1.default,
        description: "خطا. درخواست به درستی ارسال نشده است. لطفا اطلاعات ارسالی را بررسی کنید.",
        schema: {
            $ref: (0, swagger_1.getSchemaPath)(BadRequestSchema_1.default),
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
    (0, swagger_1.ApiUnprocessableEntityResponse)({
        description: "خطا. مقادیر ارسالی اشتباه هستند. در فیلد مسیج مقادیر اشتباه قرار دارند.",
        type: UnProcessableEntitySchema_1.default,
        schema: {
            $ref: (0, swagger_1.getSchemaPath)(UnProcessableEntitySchema_1.default),
        },
    }),
    (0, swagger_1.ApiInternalServerErrorResponse)({
        type: InternalServerErrorSchema_1.default,
        description: "خطای سرور. لطفا کمی بعد تلاش کنید",
        schema: {
            $ref: (0, swagger_1.getSchemaPath)(InternalServerErrorSchema_1.default),
        },
    }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [InvitedClientsIntoWebinarDto_1.InvitedClientsIntoWebinarDto, Object]),
    __metadata("design:returntype", Promise)
], WebinarController.prototype, "findInvitedWebinars", null);
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
    (0, swagger_1.ApiUnprocessableEntityResponse)({
        description: "خطا. مقادیر ارسالی اشتباه هستند. در فیلد مسیج مقادیر اشتباه قرار دارند.",
        type: UnProcessableEntitySchema_1.default,
        schema: {
            $ref: (0, swagger_1.getSchemaPath)(UnProcessableEntitySchema_1.default),
        },
    }),
    (0, swagger_1.ApiInternalServerErrorResponse)({
        type: InternalServerErrorSchema_1.default,
        description: "خطای سرور. لطفا کمی بعد تلاش کنید",
        schema: {
            $ref: (0, swagger_1.getSchemaPath)(InternalServerErrorSchema_1.default),
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "حذف وبینار" }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [delete_webinar_dto_ts_1.DeleteWebinarDto, Object, Object]),
    __metadata("design:returntype", Promise)
], WebinarController.prototype, "deleteWebinar", null);
WebinarController = __decorate([
    (0, common_1.UseGuards)(AdminTokenAuthGuard_1.default),
    (0, swagger_1.ApiSecurity)("JWT-auth"),
    (0, swagger_1.ApiTags)("v1/admin-webinar"),
    (0, common_1.Controller)("v1/admin/webinars"),
    __metadata("design:paramtypes", [webinar_service_1.WebinarService])
], WebinarController);
exports.WebinarController = WebinarController;
//# sourceMappingURL=webinar.controller.js.map