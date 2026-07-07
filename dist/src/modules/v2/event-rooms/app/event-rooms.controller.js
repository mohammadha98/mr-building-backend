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
const swagger_1 = require("@nestjs/swagger");
const Create_event_room_dto_1 = require("./dto/Create-event-room.dto");
const nestjs_form_data_1 = require("nestjs-form-data");
const delete_event_rooms_dto_ts_1 = require("./dto/delete-event-rooms.dto.ts");
const update_event_room_dto_1 = require("./dto/update-event-room.dto");
const InviteContactDto_1 = require("./dto/InviteContactDto");
const Client_events_room_dto_1 = require("./dto/Client-events-room.dto");
const InvitedClientsInto_event_room_dto_1 = require("./dto/InvitedClientsInto-event-room.dto");
const Event_room_pagination_dto_1 = require("./dto/Event-room-pagination.dto");
const TokenAuthGuardClient_1 = require("../../jwt-auth/TokenAuthGuardClient");
let EventRoomsController = class EventRoomsController {
    constructor(weninarService) {
        this.weninarService = weninarService;
    }
    async store(createEventRoomDto) {
        return await this.weninarService.store(createEventRoomDto);
    }
    async findAllMyOwnWebinars() {
        return await this.weninarService.findAllMyOwnWebinars();
    }
    async findAllMyRooms(query) {
        return await this.weninarService.findAllMyRooms(query);
    }
    async findInvitedWebinars(query) {
        return await this.weninarService.findInvitedWebinars(query.room_id);
    }
    async deleteWebinar(deleteWebinarDto) {
        return this.weninarService.deleteWebinar(deleteWebinarDto);
    }
    async updateWbinar(updateWebinarDto) {
        return await this.weninarService.updateWebinar(updateWebinarDto);
    }
    async inviteContactToEventRoom(inviteContactDto, res) {
        return await this.weninarService.inviteContactToEventRoom(inviteContactDto, res);
    }
};
__decorate([
    (0, swagger_1.ApiCreatedResponse)({
        description: "اتاق جدید با موفقیت ایجاد شد.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 201 },
                message: {
                    type: "string",
                    example: "اتاق جدید با موفقیت ایجاد شد.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 1 },
                        is_owner: { type: "boolean", example: false },
                        title: { type: "string" },
                        type: {
                            type: "string",
                            example: "نوع وبنیار: private",
                        },
                        tag: { type: "string" },
                        guest_count: { type: "number" },
                        event_link: { type: "string" },
                        status: {
                            type: "string",
                            example: "وضعیت به 2 حالت ثبت میشود: active, inactive,",
                        },
                        created_at: { type: "string" },
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
    (0, swagger_1.ApiBody)({ type: Create_event_room_dto_1.CreateEventRoomDto }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, swagger_1.ApiOperation)({ summary: "ایجاد اتاق جلسه" }),
    (0, nestjs_form_data_1.FormDataRequest)(),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Create_event_room_dto_1.CreateEventRoomDto]),
    __metadata("design:returntype", Promise)
], EventRoomsController.prototype, "store", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "دریافت اتاق های ایجاد شده توسط کاربر",
        description: "در این بخش لیست اتاق های ایجاد شده توسط کاربر ارسال میشود",
    }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, swagger_1.ApiOkResponse)({
        description: "لیست اتاقهای کاربر در دسترس است.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "لیست اتاقهای کاربر در دسترس است.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 1 },
                        is_owner: { type: "boolean", example: false },
                        title: { type: "string" },
                        type: {
                            type: "string",
                            example: "نوع وبنیار: private",
                        },
                        tag: { type: "string" },
                        guest_count: { type: "number" },
                        event_link: { type: "string" },
                        status: {
                            type: "string",
                            example: "وضعیت به 2 حالت ثبت میشود: active, inactive,",
                        },
                        created_at: { type: "string" },
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
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EventRoomsController.prototype, "findAllMyOwnWebinars", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "دریافت اتاق های کاربر",
        description: "لیست اتاق های کاربر بر اساس ماه و سال جاری ارسال میشود. \n \nماه و سال به میلادی و به صورت عددی ارسال شود",
    }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, swagger_1.ApiOkResponse)({
        description: "لیست اتاقهای کاربر در دسترس است.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "لیست اتاقهای کاربر در دسترس است.",
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
                                    type: {
                                        type: "string",
                                        example: "نوع وبنیار: private",
                                    },
                                    tag: { type: "string" },
                                    guest_count: { type: "number" },
                                    event_link: { type: "string" },
                                    status: {
                                        type: "string",
                                        example: "وضعیت به 2 حالت ثبت میشود: active, inactive,",
                                    },
                                    created_at: { type: "string" },
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
    (0, swagger_1.ApiQuery)({ type: Client_events_room_dto_1.ClientEventsRoomsDto }),
    (0, common_1.Get)("/me"),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Event_room_pagination_dto_1.EventRoomPaginationDto]),
    __metadata("design:returntype", Promise)
], EventRoomsController.prototype, "findAllMyRooms", null);
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
    (0, common_1.Get)("/users"),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [InvitedClientsInto_event_room_dto_1.InvitedClientsIntoEventRoomDto]),
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
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [delete_event_rooms_dto_ts_1.DeleteEventRoomDto]),
    __metadata("design:returntype", Promise)
], EventRoomsController.prototype, "deleteWebinar", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "اتاق با موفقیت ویرایش شد.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "اتاق با موفقیت ویرایش شد.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 1 },
                        is_owner: { type: "boolean", example: false },
                        title: { type: "string" },
                        type: {
                            type: "string",
                            example: "نوع وبنیار: private",
                        },
                        tag: { type: "string" },
                        guest_count: { type: "number" },
                        event_link: { type: "string" },
                        status: {
                            type: "string",
                            example: "وضعیت به 2 حالت ثبت میشود: active, inactive,",
                        },
                        created_at: { type: "string" },
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
    (0, swagger_1.ApiOperation)({ summary: "ویرایش اتاق" }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, nestjs_form_data_1.FormDataRequest)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_event_room_dto_1.UpdateEventRoomDto]),
    __metadata("design:returntype", Promise)
], EventRoomsController.prototype, "updateWbinar", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "افزودن مخاطبین به اتاق",
        description: "مخاطبین خود را به اتاق دعوت کنید.",
    }),
    (0, swagger_1.ApiOkResponse)({
        description: "مخاطبین شما به اتاق اضافه شدند.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "مخاطبین شما به اتاق اضافه شدند.",
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
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [InviteContactDto_1.InviteContactDto, Object]),
    __metadata("design:returntype", Promise)
], EventRoomsController.prototype, "inviteContactToEventRoom", null);
EventRoomsController = __decorate([
    (0, common_1.UseGuards)(TokenAuthGuardClient_1.default),
    (0, swagger_1.ApiSecurity)("JWT-auth"),
    (0, swagger_1.ApiTags)("v2/app-webinar-rooms"),
    (0, common_1.Controller)("v2/app/webinar/rooms"),
    __metadata("design:paramtypes", [event_rooms_service_1.EventRoomsService])
], EventRoomsController);
exports.EventRoomsController = EventRoomsController;
//# sourceMappingURL=event-rooms.controller.js.map