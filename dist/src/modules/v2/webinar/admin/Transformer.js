"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
let WebinarTransformer = class WebinarTransformer {
    transform(webinar) {
        return {
            id: webinar.id,
            title: webinar.title,
            description: webinar.description,
            type: webinar.type,
            tag: webinar.tag,
            event_link: webinar.event_link,
            status: webinar.status,
            proceeding: webinar.proceeding,
            guest_count: webinar.guest_count,
            guest_access: webinar.guest_access,
            created_at: webinar.created_at,
            started_at: webinar.started_at,
            start_time: webinar.start_time,
            end_time: webinar.end_time,
        };
    }
    collection(webinars) {
        return webinars.map((webinar) => this.transform(webinar));
    }
    guestTransform(guest) {
        return {
            client_id: guest.client_id,
            userid: guest.userid,
            display_name: guest.display_name,
            phone: guest.phone,
            role: guest.role,
        };
    }
    guestCollection(guests) {
        if (guests) {
            return guests.map((guest) => this.guestTransform(guest));
        }
        return [];
    }
};
WebinarTransformer = __decorate([
    (0, common_1.Injectable)()
], WebinarTransformer);
exports.default = WebinarTransformer;
//# sourceMappingURL=Transformer.js.map