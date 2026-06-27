"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventGroupsModule = void 0;
const common_1 = require("@nestjs/common");
const event_groups_service_1 = require("./event-groups.service");
const nestjs_form_data_1 = require("nestjs-form-data");
const event_groups_controller_1 = require("./event-groups.controller");
const MrBuildingMailerService_1 = require("../../../../services/notifications/mailer/providers/MrBuildingMailerService");
const mailerService_1 = require("../../../../services/notifications/mailer/mailerService");
let EventGroupsModule = class EventGroupsModule {
};
EventGroupsModule = __decorate([
    (0, common_1.Module)({
        controllers: [event_groups_controller_1.EventsGroupController],
        imports: [nestjs_form_data_1.NestjsFormDataModule],
        providers: [
            event_groups_service_1.eventGroupsService,
            mailerService_1.default,
            MrBuildingMailerService_1.default,
        ],
    })
], EventGroupsModule);
exports.EventGroupsModule = EventGroupsModule;
//# sourceMappingURL=event-groups.module.js.map