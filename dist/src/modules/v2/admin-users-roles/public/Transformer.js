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
    transformRole(role) {
        let categories = {};
        role.category.map((item) => {
            const category = item.category;
            if (categories[category.key] === undefined) {
                categories[category.key] = {
                    cat_id: category.id,
                    cat_title: category.title,
                    cat_key: category.key,
                    permissions: [],
                };
            }
            else {
                categories[category.key] = Object.assign({}, categories[category.key]);
            }
        });
        role.permissions.map((item) => {
            let permissions = item.permission;
            let category = item.permission.category;
            if (categories[category.key] !== undefined) {
                categories[category.key].permissions = [
                    ...categories[category.key].permissions,
                    {
                        id: permissions.id,
                        title: permissions.title,
                        key: permissions.key,
                    },
                ];
            }
        });
        const presentedCategories = [];
        Object.keys(categories).map((item) => {
            presentedCategories.push(categories[item]);
        });
        return {
            id: role.id,
            title: role.title,
            description: role.description,
            key: role.key,
            categories: presentedCategories,
        };
    }
    collectionRoles(categories) {
        return categories.map((item) => this.transformRole(item));
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