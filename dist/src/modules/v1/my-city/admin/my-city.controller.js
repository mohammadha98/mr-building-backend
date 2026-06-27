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
exports.MyCityController = void 0;
const common_1 = require("@nestjs/common");
const my_city_service_1 = require("./my-city.service");
const swagger_1 = require("@nestjs/swagger");
const swagger_consumes_1 = require("../../../../commons/enums/swagger.consumes");
const pagination_decorator_1 = require("../../../../commons/decorators/pagination.decorator");
const query_geolocation_dto_1 = require("./dto/query-geolocation.dto");
const AdminTokenAuthGuard_1 = require("../../jwt-auth/AdminTokenAuthGuard");
let MyCityController = class MyCityController {
    constructor(myCityService) {
        this.myCityService = myCityService;
    }
    findAll(query) {
        console.log("GetLocaionInMyCity: ADMIN");
        console.log({ query });
        return this.myCityService.findAll(query);
    }
    locationDetails(id) {
        return this.myCityService.locationDetails(id);
    }
    remove(id) {
        return this.myCityService.remove(id);
    }
    changePriorityFile(id, status) {
        return this.myCityService.changeStatus(id, status);
    }
};
__decorate([
    (0, swagger_1.ApiConsumes)(swagger_consumes_1.SwaggerConsumes.Json),
    (0, swagger_1.ApiOperation)({ summary: "لیست لوکیشن" }),
    (0, common_1.Get)(),
    (0, pagination_decorator_1.Pagination)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_geolocation_dto_1.GetLocaionInMyCity]),
    __metadata("design:returntype", void 0)
], MyCityController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiConsumes)(swagger_consumes_1.SwaggerConsumes.Json),
    (0, swagger_1.ApiOperation)({ summary: "مشخصات لوکیشن" }),
    (0, common_1.Get)("details/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MyCityController.prototype, "locationDetails", null);
__decorate([
    (0, swagger_1.ApiConsumes)(swagger_consumes_1.SwaggerConsumes.Json),
    (0, swagger_1.ApiOperation)({ summary: " حذف لوکیشن  " }),
    (0, common_1.Delete)("location/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MyCityController.prototype, "remove", null);
__decorate([
    (0, swagger_1.ApiConsumes)(swagger_consumes_1.SwaggerConsumes.Json),
    (0, swagger_1.ApiOperation)({ summary: "تغییر وضعیت" }),
    (0, common_1.Patch)("location/:id/:status"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Param)("status")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], MyCityController.prototype, "changePriorityFile", null);
MyCityController = __decorate([
    (0, common_1.UseGuards)(AdminTokenAuthGuard_1.default),
    (0, swagger_1.ApiSecurity)("JWT-auth"),
    (0, swagger_1.ApiTags)("v1/admin/my-city"),
    (0, common_1.Controller)("v1/admin/my-city"),
    __metadata("design:paramtypes", [my_city_service_1.MyCityService])
], MyCityController);
exports.MyCityController = MyCityController;
//# sourceMappingURL=my-city.controller.js.map