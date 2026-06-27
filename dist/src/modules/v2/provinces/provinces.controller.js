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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProvincesController = void 0;
const common_1 = require("@nestjs/common");
const provinces_service_1 = require("./provinces.service");
const swagger_1 = require("@nestjs/swagger");
const httpResponsehandler_1 = require("../../services/httpResponseHandler/httpResponsehandler");
let ProvincesController = class ProvincesController {
    constructor(provincesService) {
        this.provincesService = provincesService;
        this.responseHandler = new httpResponsehandler_1.HttpResponsehandler();
    }
    async findAll() {
        const result = await this.provincesService.findAll();
        return {
            statusCode: 200,
            message: "لیست استان ها و شهرتان ها  در دسترس است.",
            data: result,
        };
    }
    async findProvinces() {
        const result = await this.provincesService.findProvinces();
        return {
            statusCode: 200,
            message: "لیست  استان ها  در دسترس است.",
            data: result,
        };
    }
};
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "لیست استان ها و شهرتان ها  در دسترس است.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "لیست استان ها و شهرتان ها  در دسترس است.",
                },
                error: { type: "string" },
                data: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: { type: "integer", example: 1 },
                            name: { type: "String", example: "title" },
                            cities: {
                                type: "object",
                                properties: {
                                    id: { type: "integer", example: 1 },
                                    name: { type: "String", example: "title" },
                                },
                            },
                        },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "لیست استان ها و شهرتان ها" }),
    (0, common_1.Get)("/all"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProvincesController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "لیست  استان ها  در دسترس است.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "لیست  استان ها  در دسترس است.",
                },
                error: { type: "string" },
                data: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: { type: "integer", example: 1 },
                            name: { type: "String", example: "title" },
                        },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "لیست استان ها   " }),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProvincesController.prototype, "findProvinces", null);
ProvincesController = __decorate([
    (0, common_1.Controller)("v2/provinces"),
    (0, swagger_1.ApiTags)("v2/provinces"),
    __metadata("design:paramtypes", [provinces_service_1.ProvincesService])
], ProvincesController);
exports.ProvincesController = ProvincesController;
//# sourceMappingURL=provinces.controller.js.map