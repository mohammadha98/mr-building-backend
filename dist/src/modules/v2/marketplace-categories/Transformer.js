"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
let MarketplaceCategoriesTransformer = class MarketplaceCategoriesTransformer {
    transform(item) {
        let formItems = [];
        if (item.items.length) {
            item.items.map((item) => {
                const subCategory = {
                    id: item.id,
                    title: item.title,
                    form_items: item.form ? item.form.items : [],
                };
                formItems = [...formItems, subCategory];
            });
        }
        return {
            id: item.id,
            title: item.title,
            thumbnail: item.thumbnail
                ? `${process.env.APP_CONTENT_PATH}/marketplace/categories/${item.thumbnail}`
                : null,
            sub_categories: formItems,
        };
    }
    collection(items) {
        return items.map((item) => this.transform(item));
    }
};
MarketplaceCategoriesTransformer = __decorate([
    (0, common_1.Injectable)()
], MarketplaceCategoriesTransformer);
exports.default = MarketplaceCategoriesTransformer;
//# sourceMappingURL=Transformer.js.map