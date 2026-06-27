"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
let BannerTransformerAdmin = class BannerTransformerAdmin {
    transform(banner) {
        if (!banner) {
            return null;
        }
        return {
            id: banner.id,
            title: banner.title,
            tag: banner.tag,
            url: banner.url,
            thumbnail: `${process.env.APP_CONTENT_PATH}/banners/${banner.thumbnail}`,
            created_at: banner.createdAt,
        };
    }
    collection(banners) {
        return banners.map((banner) => this.transform(banner));
    }
};
BannerTransformerAdmin = __decorate([
    (0, common_1.Injectable)()
], BannerTransformerAdmin);
exports.default = BannerTransformerAdmin;
//# sourceMappingURL=transformer-admin.js.map