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
exports.HomePageController = void 0;
const common_1 = require("@nestjs/common");
const home_page_service_1 = require("./home-page.service");
const httpResponsehandler_1 = require("../../services/httpResponseHandler/httpResponsehandler");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../jwt-auth/jwt-auth.guard");
const forbiddenErrorHandler_1 = require("../../services/httpResponseHandler/forbiddenErrorHandler");
const internalServerErrorHandler_1 = require("../../services/httpResponseHandler/internalServerErrorHandler");
const Transformer_1 = require("./Transformer");
const create_home_page_dto_1 = require("./dto/create-home-page.dto");
let HomePageController = class HomePageController {
    constructor(homePageService, homePageTransformer, responseHandler) {
        this.homePageService = homePageService;
        this.homePageTransformer = homePageTransformer;
        this.responseHandler = responseHandler;
    }
    async findAll(query, req, res) {
        query.client_id = req.user.id;
        console.log("*** GetHomePageDto ***");
        console.log(query);
        const result = await this.homePageService.homePage(query);
        if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        const homePageTransformer = this.homePageTransformer.transform(result.result);
        return this.responseHandler.send(res, 200, "صفحه اصلی در دسترس است", homePageTransformer);
    }
};
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_home_page_dto_1.GetHomePageDto, Object, Object]),
    __metadata("design:returntype", Promise)
], HomePageController.prototype, "findAll", null);
HomePageController = __decorate([
    (0, swagger_1.ApiTags)("v1/homePage"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiSecurity)("JWT-auth"),
    (0, common_1.Controller)("v1/app/home-page"),
    __metadata("design:paramtypes", [home_page_service_1.HomePageService,
        Transformer_1.default,
        httpResponsehandler_1.HttpResponsehandler])
], HomePageController);
exports.HomePageController = HomePageController;
//# sourceMappingURL=home-page.controller.js.map