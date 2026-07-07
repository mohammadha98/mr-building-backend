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
exports.AdminReportsController = void 0;
const common_1 = require("@nestjs/common");
const admin_reports_service_1 = require("./admin-reports.service");
const admin_reports_dto_1 = require("./dto/admin-reports.dto");
const AdminTokenAuthGuard_1 = require("../jwt-auth/AdminTokenAuthGuard");
const swagger_1 = require("@nestjs/swagger");
const swagger_consumes_1 = require("../../../commons/enums/swagger.consumes");
const getInActiveClients_1 = require("./dto/getInActiveClients");
let AdminReportsController = class AdminReportsController {
    constructor(adminReportsService) {
        this.adminReportsService = adminReportsService;
    }
    generateAdsReports(reportDto) {
        return this.adminReportsService.generateAdsReports(reportDto);
    }
    generateClientReports(reportDto) {
        return this.adminReportsService.generateClientReports(reportDto);
    }
    generateRealEstateReports(reportDto) {
        return this.adminReportsService.generateRealEstateReports(reportDto);
    }
    getInActiveClients(body) {
        return this.adminReportsService.getInActiveClients(body);
    }
};
__decorate([
    (0, swagger_1.ApiConsumes)(swagger_consumes_1.SwaggerConsumes.Json),
    (0, swagger_1.ApiOperation)({ summary: "گزارش آمار آگهی ها" }),
    (0, common_1.Get)("/ads"),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_reports_dto_1.AdminReportsDto]),
    __metadata("design:returntype", void 0)
], AdminReportsController.prototype, "generateAdsReports", null);
__decorate([
    (0, swagger_1.ApiConsumes)(swagger_consumes_1.SwaggerConsumes.Json),
    (0, swagger_1.ApiOperation)({ summary: "گزارش آمار کلاینت ها" }),
    (0, common_1.Get)("/clients"),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_reports_dto_1.AdminReportsDto]),
    __metadata("design:returntype", void 0)
], AdminReportsController.prototype, "generateClientReports", null);
__decorate([
    (0, swagger_1.ApiConsumes)(swagger_consumes_1.SwaggerConsumes.Json),
    (0, swagger_1.ApiOperation)({ summary: "گزارش آمار مشاوران املاک" }),
    (0, common_1.Get)("/real-estates"),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_reports_dto_1.AdminReportsDto]),
    __metadata("design:returntype", void 0)
], AdminReportsController.prototype, "generateRealEstateReports", null);
__decorate([
    (0, swagger_1.ApiConsumes)(swagger_consumes_1.SwaggerConsumes.Json),
    (0, swagger_1.ApiOperation)({ summary: "لیست کاربران غیر فعال بر اساس بازه زمانی" }),
    (0, common_1.Post)("/clients/inactive"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [getInActiveClients_1.GetInActiveClients]),
    __metadata("design:returntype", void 0)
], AdminReportsController.prototype, "getInActiveClients", null);
AdminReportsController = __decorate([
    (0, swagger_1.ApiTags)("v1/admin/admin-reports"),
    (0, common_1.Controller)("v1/admin/admin-reports"),
    (0, common_1.UseGuards)(AdminTokenAuthGuard_1.default),
    (0, swagger_1.ApiSecurity)("JWT-auth"),
    __metadata("design:paramtypes", [admin_reports_service_1.AdminReportsService])
], AdminReportsController);
exports.AdminReportsController = AdminReportsController;
//# sourceMappingURL=admin-reports.controller.js.map