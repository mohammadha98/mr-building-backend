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
exports.MyCityBookmarksController = void 0;
const common_1 = require("@nestjs/common");
const my_city_bookmarks_service_1 = require("./my-city-bookmarks.service");
const create_my_city_bookmark_dto_1 = require("./dto/create-my-city-bookmark.dto");
const swagger_1 = require("@nestjs/swagger");
const swagger_consumes_1 = require("../../../commons/enums/swagger.consumes");
const TokenAuthGuardClient_1 = require("../jwt-auth/TokenAuthGuardClient");
let MyCityBookmarksController = class MyCityBookmarksController {
    constructor(myCityBookmarksService) {
        this.myCityBookmarksService = myCityBookmarksService;
    }
    create(createBookmarkDto) {
        return this.myCityBookmarksService.create(createBookmarkDto);
    }
    findAll() {
        return this.myCityBookmarksService.findAll();
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiConsumes)(swagger_consumes_1.SwaggerConsumes.Json),
    (0, swagger_1.ApiOperation)({ summary: " بوکمارک کردن لوکیشن  " }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_my_city_bookmark_dto_1.CreateMyCityBookmarkDto]),
    __metadata("design:returntype", void 0)
], MyCityBookmarksController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiConsumes)(swagger_consumes_1.SwaggerConsumes.Json),
    (0, swagger_1.ApiOperation)({ summary: " لوکیشن های مورد علاقه کاربر " }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MyCityBookmarksController.prototype, "findAll", null);
MyCityBookmarksController = __decorate([
    (0, common_1.UseGuards)(TokenAuthGuardClient_1.default),
    (0, swagger_1.ApiSecurity)("JWT-auth"),
    (0, swagger_1.ApiTags)("v2/app/my-city/bookmarks"),
    (0, common_1.Controller)("v2/app/my-city/bookmarks"),
    __metadata("design:paramtypes", [my_city_bookmarks_service_1.MyCityBookmarksService])
], MyCityBookmarksController);
exports.MyCityBookmarksController = MyCityBookmarksController;
//# sourceMappingURL=my-city-bookmarks.controller.js.map