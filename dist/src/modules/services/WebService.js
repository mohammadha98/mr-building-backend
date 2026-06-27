"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
class WebService {
    constructor() { }
    async get(endpoint, config = {}) {
        const data = await axios_1.default.get(`${endpoint}`, config);
        return data;
    }
    async post(endpoint, data, config) {
        return await axios_1.default.post(`${endpoint}`, data, config);
    }
    async patch(endpoint, dataObj, config) {
        const data = await axios_1.default.patch(`${endpoint}`, dataObj, config);
        return data;
    }
    async delete(endpoint, config) {
        const data = await axios_1.default.delete(`${endpoint}`, config);
        return data;
    }
}
exports.default = WebService;
//# sourceMappingURL=WebService.js.map