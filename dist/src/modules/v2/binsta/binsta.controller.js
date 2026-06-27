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
exports.BinstaController = void 0;
const common_1 = require("@nestjs/common");
const binsta_service_1 = require("./binsta.service");
const update_binsta_dto_1 = require("./dto/update-binsta.dto");
const jwt_auth_guard_1 = require("../jwt-auth/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
const validate_username_dto_1 = require("./dto/validate-username.dto");
const httpResponsehandler_1 = require("../../services/httpResponseHandler/httpResponsehandler");
const forbiddenErrorHandler_1 = require("../../services/httpResponseHandler/forbiddenErrorHandler");
const unProcessableEntity_1 = require("../../services/httpResponseHandler/unProcessableEntity");
const internalServerErrorHandler_1 = require("../../services/httpResponseHandler/internalServerErrorHandler");
let BinstaController = class BinstaController {
    constructor(binstaService, responseHandler) {
        this.binstaService = binstaService;
        this.responseHandler = responseHandler;
    }
    async validateUsername(body, req, res) {
        body.client_id = req.user.id;
        console.log("*** validate Username: Binsta App ***");
        console.log({ body });
        const result = await this.binstaService.validateUsername(body);
        if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 422) {
            throw new unProcessableEntity_1.UnProcessableEntity("خطا. نام کاربری وارد شده تکراری میباشد.");
        }
        else if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        return this.responseHandler.send(res, 200, "نام کاربری وارد شده معتبر میباشد.");
    }
    findAll() {
        return this.binstaService.findAll();
    }
    findOne(id) {
        return this.binstaService.findOne(+id);
    }
    update(id, updateBinstaDto) {
        return this.binstaService.update(+id, updateBinstaDto);
    }
    remove(id) {
        return this.binstaService.remove(+id);
    }
};
__decorate([
    (0, common_1.Post)("check"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [validate_username_dto_1.ValidateUsernameBinstaDto, Object, Object]),
    __metadata("design:returntype", Promise)
], BinstaController.prototype, "validateUsername", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BinstaController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BinstaController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_binsta_dto_1.UpdateBinstaDto]),
    __metadata("design:returntype", void 0)
], BinstaController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BinstaController.prototype, "remove", null);
BinstaController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiSecurity)("JWT-auth"),
    (0, swagger_1.ApiTags)("v2/app-binsta"),
    (0, common_1.Controller)("v2/app/binsta"),
    __metadata("design:paramtypes", [binsta_service_1.BinstaService,
        httpResponsehandler_1.HttpResponsehandler])
], BinstaController);
exports.BinstaController = BinstaController;
//# sourceMappingURL=binsta.controller.js.map