"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminUsersRolesModule = void 0;
const common_1 = require("@nestjs/common");
const admin_users_roles_module_1 = require("./private/admin-users-roles.module");
const admin_users_roles_module_2 = require("./public/admin-users-roles.module");
let AdminUsersRolesModule = class AdminUsersRolesModule {
};
AdminUsersRolesModule = __decorate([
    (0, common_1.Module)({
        imports: [admin_users_roles_module_1.AdminUsersRolesPrivateModule, admin_users_roles_module_2.AdminUsersRolesPublicModule],
    })
], AdminUsersRolesModule);
exports.AdminUsersRolesModule = AdminUsersRolesModule;
//# sourceMappingURL=channel-real-estate.module.js.map