"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
let adminUserRolesTransformer = class adminUserRolesTransformer {
    transformCategoryRoles(category) {
        console.log({ category });
        return {
            id: category.id,
            title: category.title,
            key: category.key,
            permissions: this.collectionPermissionCategoryRoles(category.permissions),
        };
    }
    collectionCategoryRoles(categories) {
        return categories.map((item) => this.transformCategoryRoles(item));
    }
    transformPermissionCategoryRoles(permission) {
        return {
            id: permission.id,
            title: permission.title,
            key: permission.key,
            category_id: permission.categoryID,
        };
    }
    collectionPermissionCategoryRoles(permissions) {
        return permissions.map((item) => this.transformPermissionCategoryRoles(item));
    }
};
adminUserRolesTransformer = __decorate([
    (0, common_1.Injectable)()
], adminUserRolesTransformer);
exports.default = adminUserRolesTransformer;
//# sourceMappingURL=Transformer.js.map