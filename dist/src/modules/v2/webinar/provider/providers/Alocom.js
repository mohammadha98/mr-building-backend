"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WebService_1 = require("../../../../services/WebService");
class AlocomWebinarProvider {
    constructor() {
        this.endpoint = "https://pnlapi.alocom.co";
        this.username = "persian_gulf";
        this.password = "test@123";
        this.webService = new WebService_1.default();
        this.registerUser = this.registerUser.bind(this);
    }
    async login() {
        console.log("*** Login In Alocom ***");
        const value = {
            username: this.username,
            password: this.password,
            "remembr me": 1,
        };
        try {
            return await this.webService
                .post(`${this.endpoint}/api/v2/auth/login`, value)
                .then(async (response) => {
                this.token = `Bearer ${response.data.token}`;
                await this.getActiveService();
                return true;
            })
                .catch((error) => {
                console.log("*** Error Login in Alocom  *** ");
                console.log(error.response.status);
            });
        }
        catch (error) {
            console.log("*** Catch Error Login in Alocom  *** ");
            console.log(error.response.status);
            return false;
        }
    }
    async registerUser(user) {
        console.log(user);
        return await this.login().then(async (data) => {
            return await this.webService
                .post(`${this.endpoint}/api/v2/agents/users`, user, {
                headers: {
                    Authorization: this.token,
                },
            })
                .then((data) => {
                return data;
            })
                .catch(async (error) => {
                console.log("*** Error register User in Alocom  *** ");
                console.log(error.response.data);
            });
        });
    }
    async updateUser(userInfo) {
        return await this.login().then(async (data) => {
            return await this.webService
                .patch(`${this.endpoint}/api/v2/agents/users/${userInfo.agentUser}`, userInfo, {
                headers: {
                    Authorization: this.token,
                },
            })
                .then((data) => {
                return data;
            })
                .catch(async (error) => {
                console.log("*** Error Update User in Alocom  *** ");
                console.log(error.response.status);
            });
        });
    }
    async removeUser(agentUser) {
        return await this.login().then(async (data) => {
            return await this.webService
                .delete(`${this.endpoint}/api/v2/agents/users/${agentUser}`, {
                headers: {
                    Authorization: this.token,
                },
            })
                .then((data) => {
                return data;
            })
                .catch(async (error) => {
                console.log("*** Error Update User in Alocom  *** ");
                console.log(error.response.status);
            });
        });
    }
    async getActiveService() {
        console.log("*** getActiveService ***");
        return await this.webService
            .get(`${this.endpoint}/api/v2/agents/services/active-services`, {
            headers: {
                Authorization: this.token,
            },
        })
            .then(async (data) => {
            if (data.status === 200) {
                const result = data.data.activeServices[0];
                this.serviceInfo = {
                    agent_service_id: result.agent_service_id,
                    max_online_user: result.max_online_user,
                };
                return;
            }
        })
            .catch(async (error) => {
            console.log("*** Error getActiveService in Alocom  *** ");
            console.log("Catch Error ");
            console.log(error.response.status);
            if (error.response.status === 401) {
                await this.login();
                await this.getActiveService();
                return;
            }
            return false;
        });
    }
    async createNewEvent(eventInfo) {
        await this.login();
        const data = {
            title: eventInfo.title + "-" + this.generateTimeStamp(),
            agent_service_id: this.serviceInfo.agent_service_id,
            slug: eventInfo.slug,
            max_user: this.serviceInfo.max_online_user,
            status: "1",
            is_unlimited: "1",
            warning_time: 300,
            start_by_admin: 0,
            guest_access: eventInfo.guest_access,
            language: "fa",
        };
        return await this.webService
            .post(`${this.endpoint}/api/v2/agents/events`, data, {
            headers: {
                Authorization: this.token,
            },
        })
            .then((data) => {
            console.log("*** SuccessFully Created Event in Alocom *** ");
            return data.data.event;
        })
            .catch(async (error) => {
            console.log("*** Error Create New Event in Alocom  *** ");
            console.log(error.response.data.errors);
        });
    }
    async addUsersToEvent(event_id, users) {
        console.log("*** add Users To Event ***");
        await this.login();
        return await this.webService
            .post(`${this.endpoint}/api/v2/agents/events/${event_id}/add-users`, users, {
            headers: {
                Authorization: this.token,
            },
        })
            .then((data) => {
            console.log("*** Admin Creattor Webinar Added to Event users with teacher role *** ");
            return data.data.event;
        })
            .catch(async (error) => {
            console.log("*** Error add User To Event_teacherRole in Alocom  *** ");
            console.log(error.response.status);
            console.log(error.response.data);
        });
    }
    async deleteWebinar(webinar_id) {
        console.log("*** Delete Webinar in Alocom *** ");
        await this.login();
        await this.webService
            .delete(`${this.endpoint}/api/v2/agents/events/${webinar_id}`, {
            headers: { Authorization: this.token },
        })
            .then((data) => {
            return true;
        })
            .catch(async (error) => {
            console.log("*** Error Delete Webinar in Alocom *** ");
        });
    }
    async getEventInfo(webinar_id) {
        console.log("*** Get Webinar Info from Alocom *** ");
        await this.login();
        return await this.webService
            .get(`${this.endpoint}/api/v2/agents/events/${webinar_id}`, {
            headers: { Authorization: this.token },
        })
            .then((data) => {
            return data;
        })
            .catch(async (error) => {
            console.log("*** Error: Get Event Info *** ");
            console.log(error.response.status);
            if (error.response.status === 401) {
                return await this.login().then(async () => {
                    await this.deleteWebinar(webinar_id);
                    return;
                });
            }
            else {
                return false;
            }
        });
    }
    async updateWebinar(werbinarInfo) {
        console.log("*** Update Webinar in Alocom *** ");
        await this.login();
        const data = {
            title: werbinarInfo.title + "-" + this.generateTimeStamp(),
            agent_service_id: this.serviceInfo.agent_service_id,
            slug: werbinarInfo.slug,
            max_user: this.serviceInfo.max_online_user,
            status: "1",
            is_unlimited: "1",
            warning_time: 300,
            start_by_admin: 0,
            guest_access: werbinarInfo.guest_access,
            language: "fa",
        };
        return await this.webService
            .patch(`${this.endpoint}/api/v2/agents/events/${werbinarInfo.webinar_provider_id}`, data, {
            headers: { Authorization: this.token },
        })
            .then(async (data) => {
            if (data.status === 200) {
                return await this.getEventInfo(werbinarInfo.webinar_provider_id);
            }
            return data;
        })
            .catch(async (error) => {
            console.log("*** Error in Update Webinar *** ");
            console.log(error.response.status);
            if (error.response.status === 409) {
                return false;
            }
            else if (error.response.status === 422) {
                return false;
            }
            else {
                return false;
            }
        });
    }
    generateTimeStamp() {
        return new Date().getTime().toString();
    }
}
exports.default = AlocomWebinarProvider;
//# sourceMappingURL=Alocom.js.map