"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
let EventRoomsTransformer = class EventRoomsTransformer {
    transform(webinar, client_info) {
        return {
            id: webinar.id,
            is_owner: webinar.owner_id === client_info.id,
            title: webinar.title,
            type: webinar.type,
            tag: webinar.tag,
            guest_count: webinar.guest_count,
            event_link: webinar.event_link,
            status: webinar.status,
            created_at: webinar.created_at,
            login_info: this.loginInfo(client_info),
        };
    }
    collection(webinars, client_info) {
        return webinars.map((webinar) => this.transform(webinar, client_info));
    }
    loginInfo(client) {
        return {
            username: client.username,
            password: client.password,
        };
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
EventRoomsTransformer = __decorate([
    (0, common_1.Injectable)()
], EventRoomsTransformer);
exports.default = EventRoomsTransformer;
//# sourceMappingURL=Transformer.js.map