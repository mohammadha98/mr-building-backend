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
exports.EventRoomsController = void 0;
const common_1 = require("@nestjs/common");
const event_rooms_service_1 = require("./event-rooms.service");
const httpResponsehandler_1 = require("../../../services/httpResponseHandler/httpResponsehandler");
const Transformer_1 = require("./Transformer");
const swagger_1 = require("@nestjs/swagger");
const InternalServerErrorSchema_1 = require("../../../../commons/contracts/swaggerDefinations/InternalServerErrorSchema");
const delete_event_rooms_dto_ts_1 = require("./dto/delete-event-rooms.dto.ts");
const forbiddenErrorHandler_1 = require("../../../services/httpResponseHandler/forbiddenErrorHandler");
const InvitedClientsInto_event_room_dto_1 = require("./dto/InvitedClientsInto-event-room.dto");
const EventService_1 = require("../../webinar/provider/EventService");
const Pagination_dto_1 = require("../../../../commons/contracts/Pagination.dto");
const AdminTokenAuthGuard_1 = require("../../jwt-auth/AdminTokenAuthGuard");
let EventRoomsController = class EventRoomsController {
    constructor(weninarService) {
        this.weninarService = weninarService;
        this.responsehandler = new httpResponsehandler_1.HttpResponsehandler();
        this.roomTransformer = new Transformer_1.default();
        this.eventService = new EventService_1.default();
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
        const webinarTransformer = this.roomTransformer.collection(weninars.list, weninars.client_info);
        return this.responsehandler.send(res, 200, "لیست اتاق های جلسه در دسترس است.", {
            data: webinarTransformer,
            metadata: weninars.metadata,
        });
    }
    async findInvitedWebinars(query, res) {
        const data = await this.weninarService.findInvitedWebinars(query.room_id);
        const roomTransformer = this.roomTransformer.guestCollection(data);
        return this.responsehandler.send(res, 200, "لیست کاربران دعوت شده به اتاق در دسترس است.", roomTransformer);
    }
    async deleteWebinar(deleteWebinarDto, req, res) {
        deleteWebinarDto.user_id = req.user.id;
        const result = await this.weninarService.deleteRoom(deleteWebinarDto);
        if (result.status === 500) {
            throw new InternalServerErrorSchema_1.default();
        }
        else if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        return this.responsehandler.send(res, 200, "اتاق موردنظر با موفقیت حذف شد.");
    }
};
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
], EventRoomsController.prototype, "findAllMyOwnWebinars", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: " لیست کاربران دعوت شده به اتاق",
        description: "دریافت لیست کاربران دعوت شده به اتاق",
    }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, swagger_1.ApiOkResponse)({
        description: "لیست کاربران دعوت شده به اتاق در دسترس است.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "لیست کاربران دعوت شده به اتاق در دسترس است.",
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
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [InvitedClientsInto_event_room_dto_1.InvitedClientsIntoEventRoomDto, Object]),
    __metadata("design:returntype", Promise)
], EventRoomsController.prototype, "findInvitedWebinars", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "اتاق موردنظر با موفقیت حذف شد.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "اتاق موردنظر با موفقیت حذف شد.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {},
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "حذف اتاق" }),
    (0, common_1.Delete)(":room_id"),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [delete_event_rooms_dto_ts_1.DeleteEventRoomDto, Object, Object]),
    __metadata("design:returntype", Promise)
], EventRoomsController.prototype, "deleteWebinar", null);
EventRoomsController = __decorate([
    (0, common_1.UseGuards)(AdminTokenAuthGuard_1.default),
    (0, swagger_1.ApiSecurity)("JWT-auth"),
    (0, swagger_1.ApiTags)("v1/admin-webinar-rooms"),
    (0, common_1.Controller)("v1/admin/webinar/rooms"),
    __metadata("design:paramtypes", [event_rooms_service_1.EventRoomsService])
], EventRoomsController);
exports.EventRoomsController = EventRoomsController;
//# sourceMappingURL=event-rooms.controller.js.map