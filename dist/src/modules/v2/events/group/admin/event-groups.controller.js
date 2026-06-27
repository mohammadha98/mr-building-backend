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
exports.EventsGroupController = void 0;
const common_1 = require("@nestjs/common");
const httpResponsehandler_1 = require("../../../../services/httpResponseHandler/httpResponsehandler");
const Transformer_1 = require("./Transformer");
const swagger_1 = require("@nestjs/swagger");
const InternalServerErrorSchema_1 = require("../../../../../commons/contracts/swaggerDefinations/InternalServerErrorSchema");
const delete_event_groupdto_ts_1 = require("./dto/delete-event-groupdto.ts");
const forbiddenErrorHandler_1 = require("../../../../services/httpResponseHandler/forbiddenErrorHandler");
const Client_events_groups_dto_1 = require("./dto/Client-events-groups.dto");
const EventService_1 = require("../../../webinar/provider/EventService");
const Event_group_pagination_dto_1 = require("./dto/Event-group-pagination.dto");
const event_groups_service_1 = require("./event-groups.service");
const AdminTokenAuthGuard_1 = require("../../../jwt-auth/AdminTokenAuthGuard");
let EventsGroupController = class EventsGroupController {
    constructor(groupsService) {
        this.groupsService = groupsService;
        this.responsehandler = new httpResponsehandler_1.HttpResponsehandler();
        this.Transformer = new Transformer_1.default();
        this.eventService = new EventService_1.default();
    }
    async findGroups(query, req, res) {
        query.client_id = req.user.id;
        const result = await this.groupsService.findAllGroups(query);
        if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        const Transformer = this.Transformer.collection(result.groups);
        return this.responsehandler.send(res, 200, "لیست گروههای کاربر در دسترس است.", { data: Transformer, metadata: result.metadata });
    }
    async deleteWebinar(group_id, req, res) {
        group_id.user_id = req.user.id;
        const result = await this.groupsService.deleteWebinar(group_id);
        if (result.status === 500) {
            throw new InternalServerErrorSchema_1.default();
        }
        else if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        return this.responsehandler.send(res, 200, "گروه موردنظر با موفقیت حذف شد.");
    }
};
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "دریافت گروه های کاربر",
    }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, swagger_1.ApiOkResponse)({
        description: "لیست گروههای کاربر در دسترس است.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "لیست گروههای کاربر در دسترس است.",
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
                                    title: { type: "string" },
                                    tag: { type: "string" },
                                    event_link: { type: "string" },
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
    (0, swagger_1.ApiQuery)({ type: Client_events_groups_dto_1.ClientEventsGroupsDto }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Event_group_pagination_dto_1.EventGroupPaginationDto, Object, Object]),
    __metadata("design:returntype", Promise)
], EventsGroupController.prototype, "findGroups", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "گروه موردنظر با موفقیت حذف شد.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "گروه موردنظر با موفقیت حذف شد.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {},
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "حذف گروه" }),
    (0, common_1.Delete)(":group_id"),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [delete_event_groupdto_ts_1.DeleteEventGroupDto, Object, Object]),
    __metadata("design:returntype", Promise)
], EventsGroupController.prototype, "deleteWebinar", null);
EventsGroupController = __decorate([
    (0, common_1.UseGuards)(AdminTokenAuthGuard_1.default),
    (0, swagger_1.ApiSecurity)("JWT-auth"),
    (0, swagger_1.ApiTags)("v2/admin-events-groups"),
    (0, common_1.Controller)("v2/admin/events/groups"),
    __metadata("design:paramtypes", [event_groups_service_1.eventGroupsService])
], EventsGroupController);
exports.EventsGroupController = EventsGroupController;
//# sourceMappingURL=event-groups.controller.js.map