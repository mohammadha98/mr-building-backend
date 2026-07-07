"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyCityBookmarksModule = void 0;
const common_1 = require("@nestjs/common");
const my_city_bookmarks_service_1 = require("./my-city-bookmarks.service");
const my_city_bookmarks_controller_1 = require("./my-city-bookmarks.controller");
const my_city_service_1 = require("../my-city/app/my-city.service");
const my_city_module_1 = require("../my-city/app/my-city.module");
const bookmark_factory_1 = require("./factories/bookmark.factory");
const Transformer_1 = require("./Transformer");
let MyCityBookmarksModule = class MyCityBookmarksModule {
};
MyCityBookmarksModule = __decorate([
    (0, common_1.Module)({
        imports: [my_city_module_1.MyCityAppModule],
        controllers: [my_city_bookmarks_controller_1.MyCityBookmarksController],
        providers: [
            my_city_bookmarks_service_1.MyCityBookmarksService,
            bookmark_factory_1.BookmarkMyCityFactory,
            my_city_service_1.MyCityService,
            Transformer_1.default,
        ],
    })
], MyCityBookmarksModule);
exports.MyCityBookmarksModule = MyCityBookmarksModule;
//# sourceMappingURL=my-city-bookmarks.module.js.map