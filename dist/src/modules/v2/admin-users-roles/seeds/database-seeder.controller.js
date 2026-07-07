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
exports.DatabaseSeederController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const database_seeder_service_1 = require("../seeds/database-seeder.service");
let DatabaseSeederController = class DatabaseSeederController {
    constructor(seederService) {
        this.seederService = seederService;
    }
    async initializeDatabase() {
        return this.seederService.seedDatabase();
    }
};
__decorate([
    (0, common_1.Post)("initialize"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: "Initialize database with seed data",
        description: "Seeds the database with test roles, permissions, and admin users. This can be run after migrations.",
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Database seeding completed successfully",
        schema: {
            example: {
                success: true,
                message: "Database seeding completed successfully",
                data: {
                    categoriesCreated: 5,
                    permissionsCreated: 17,
                    rolesCreated: 5,
                    usersCreated: 5,
                    users: [
                        {
                            id: 1,
                            name: "Super Admin",
                            email: "superadmin@mrbuilding.local",
                            phone: "989999999999",
                            role: "super_admin",
                            password: "SuperAdmin@123",
                        },
                    ],
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: "Seeding failed",
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DatabaseSeederController.prototype, "initializeDatabase", null);
DatabaseSeederController = __decorate([
    (0, swagger_1.ApiTags)("Admin - Database Seeding"),
    (0, common_1.Controller)("v2/admin/seed"),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [database_seeder_service_1.DatabaseSeederService])
], DatabaseSeederController);
exports.DatabaseSeederController = DatabaseSeederController;
//# sourceMappingURL=database-seeder.controller.js.map