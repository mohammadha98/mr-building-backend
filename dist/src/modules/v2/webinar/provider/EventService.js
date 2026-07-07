"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Alocom_1 = require("./providers/Alocom");
class EventService {
    constructor() {
        this.defaultProvider = new Alocom_1.default();
    }
    async login() {
        return await this.defaultProvider.login();
    }
    async registerUser(user) {
        return await this.defaultProvider.registerUser(user);
    }
    async createNewEvent(eventInfo) {
        return await this.defaultProvider.createNewEvent(eventInfo);
    }
    async addUsersToEvent(event_id, users) {
        return await this.defaultProvider.addUsersToEvent(event_id, users);
    }
    async deleteWebinar(webinar_id) {
        return await this.defaultProvider.deleteWebinar(webinar_id);
    }
    async updateWebinar(werbinarInfo) {
        return await this.defaultProvider.updateWebinar(werbinarInfo);
    }
    async updateUser(userInfo) {
        return await this.defaultProvider.updateUser(userInfo);
    }
    async removeUser(agentUser) {
        return await this.defaultProvider.removeUser(agentUser);
    }
}
exports.default = EventService;
//# sourceMappingURL=EventService.js.map