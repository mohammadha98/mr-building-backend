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
exports.TermsOfServicesController = void 0;
const common_1 = require("@nestjs/common");
const terms_of_services_service_1 = require("./terms-of-services.service");
const httpResponsehandler_1 = require("../../../services/httpResponseHandler/httpResponsehandler");
const swagger_1 = require("@nestjs/swagger");
const Transformer_1 = require("./Transformer");
let TermsOfServicesController = class TermsOfServicesController {
    constructor(termsOfServicesService, termsOfServicetarnsformer, httpResponsehandler) {
        this.termsOfServicesService = termsOfServicesService;
        this.termsOfServicetarnsformer = termsOfServicetarnsformer;
        this.httpResponsehandler = httpResponsehandler;
    }
    async findAll(req, res) {
        const result = await this.termsOfServicesService.findAll();
        const transformer = this.termsOfServicetarnsformer.transform(result.result);
        this.httpResponsehandler.send(res, 200, "قوانین در دسترس است.", transformer);
    }
};
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "قوانین در دسترس است.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "قوانین در دسترس است.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {
                        content: { type: "string" },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "دریافت  قوانین" }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TermsOfServicesController.prototype, "findAll", null);
TermsOfServicesController = __decorate([
    (0, swagger_1.ApiTags)("v2/terms-of-services"),
    (0, common_1.Controller)("v2/terms-of-services"),
    __metadata("design:paramtypes", [terms_of_services_service_1.TermsOfServicesService,
        Transformer_1.default,
        httpResponsehandler_1.HttpResponsehandler])
], TermsOfServicesController);
exports.TermsOfServicesController = TermsOfServicesController;
//# sourceMappingURL=terms-of-services.controller.js.map