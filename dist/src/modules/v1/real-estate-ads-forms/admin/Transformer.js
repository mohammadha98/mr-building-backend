"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
let RealEstateAdFormsTransformer = class RealEstateAdFormsTransformer {
    transformItem(item) {
        return {
            id: item.id,
            field_name: item.field_name,
            type: item.type,
            is_active: item.is_active,
            required: item.required,
            field_type: item.field_type,
            values: item.values,
            sort_number: item.sort_number,
            status: item.status,
            icon: process.env.APP_CONTENT_PATH +
                "/real_estate_ad_forms/icons/" +
                item.icon,
            key: item.key,
        };
    }
    collectionItem(items) {
        return items.map((item) => this.transformItem(item));
    }
    transform(item) {
        return {
            id: item.id,
            title: item.title,
            description: item.description,
        };
    }
    collection(items) {
        return items.map((item) => this.transform(item));
    }
};
RealEstateAdFormsTransformer = __decorate([
    (0, common_1.Injectable)()
], RealEstateAdFormsTransformer);
exports.default = RealEstateAdFormsTransformer;
//# sourceMappingURL=Transformer.js.map