"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseSeederModule = void 0;
const common_1 = require("@nestjs/common");
const database_seeder_service_1 = require("./database-seeder.service");
const database_seeder_controller_1 = require("./database-seeder.controller");
const prisma_service_1 = require("../../../../../prisma/prisma.service");
let DatabaseSeederModule = class DatabaseSeederModule {
};
DatabaseSeederModule = __decorate([
    (0, common_1.Module)({
        imports: [],
        controllers: [database_seeder_controller_1.DatabaseSeederController],
        providers: [database_seeder_service_1.DatabaseSeederService, prisma_service_1.PrismaService],
        exports: [database_seeder_service_1.DatabaseSeederService],
    })
], DatabaseSeederModule);
exports.DatabaseSeederModule = DatabaseSeederModule;
//# sourceMappingURL=database-seeder.module.js.map