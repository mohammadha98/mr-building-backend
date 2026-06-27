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
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const Transformer_1 = require("../../admin-users-roles/public/Transformer");
let UserTransformer = class UserTransformer {
    constructor(adminUserRolesTransformer) {
        this.adminUserRolesTransformer = adminUserRolesTransformer;
    }
    transform(user) {
        let roleInfo = {};
        user.roles.map(({ role }) => {
            roleInfo[role.id] = {
                id: role.id,
                title: role.title,
                description: role.description,
                key: role.key,
                categories: [],
            };
            let categories = {};
            role.permissions.map(({ category }) => {
                const categoryInfo = category.category;
                categories[categoryInfo.id] = {
                    role_id: role.id,
                    id: categoryInfo.id,
                    title: categoryInfo.title,
                    key: categoryInfo.key,
                    permissions: [],
                };
            });
            role.permissions.map(({ permission }) => {
                const permissionInfo = permission;
                categories[permissionInfo.category.id] = Object.assign(Object.assign({}, categories[permissionInfo.category.id]), { permissions: [
                        ...categories[permissionInfo.category.id].permissions,
                        {
                            id: permissionInfo.id,
                            title: permissionInfo.title,
                            key: permissionInfo.key,
                        },
                    ] });
            });
            Object.keys(categories).map((item) => {
                roleInfo[categories[item].role_id] = Object.assign(Object.assign({}, roleInfo[categories[item].role_id]), { categories: [
                        ...roleInfo[categories[item].role_id].categories,
                        categories[item],
                    ] });
                delete categories[item].role_id;
            });
        });
        let userRoles = [];
        Object.keys(roleInfo).map((item) => {
            userRoles = [...userRoles, roleInfo[item]];
        });
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            uniq_key: user.uniqKey,
            phone: user.phone,
            avatar: user.avatar
                ? `${process.env.APP_CONTENT_PATH}/avatars/users/avatars/${user.avatar}`
                : "",
            token: user.token,
            refresh_token: user.refresh_token,
            status: user.status,
            created_at: user.created_at,
            roles: userRoles,
        };
    }
    collection(users) {
        return users.map((user) => this.transform(user));
    }
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
    transformUserRole(tem) {
        const role = tem.role;
        let userPermissions = {};
        role.permissions.map((item) => {
            const key = item.category.category.key;
            if (userPermissions[key] === undefined) {
                userPermissions[key] = {
                    category: {
                        id: item.category.category.id,
                        title: item.category.category.title,
                        key,
                    },
                    permissions: [
                        Object.assign({}, item.permission),
                    ],
                };
            }
            else {
                userPermissions[key] = Object.assign(Object.assign({}, userPermissions[key]), { permissions: [
                        ...userPermissions[key].permissions,
                        Object.assign({}, item.permission),
                    ] });
            }
        });
        const permissions = [];
        Object.keys(userPermissions).map((key) => {
            permissions.push(userPermissions[key]);
        });
        return {
            role_id: role.id,
            title: role.title,
            key: role.key,
            permissions,
        };
    }
    collectionUserRole(roles) {
        return roles.map((item) => this.transformUserRole(item));
    }
};
UserTransformer = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Transformer_1.default])
], UserTransformer);
exports.default = UserTransformer;
//# sourceMappingURL=Transformer.js.map