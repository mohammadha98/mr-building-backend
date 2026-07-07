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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbBackupService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../prisma/prisma.service");
const child_process_1 = require("child_process");
const process = require("process");
const list_storefront_dto_1 = require("../marketplace-storefront/app/dto/list-storefront.dto");
const Transformer_1 = require("./Transformer");
const messages_1 = require("../../../commons/enums/messages");
const fs = require("node:fs");
const internalServerErrorHandler_1 = require("../../services/httpResponseHandler/internalServerErrorHandler");
const core_1 = require("@nestjs/core");
let DbBackupService = class DbBackupService {
    constructor(request, prismaService, backupTransFormer) {
        this.request = request;
        this.prismaService = prismaService;
        this.backupTransFormer = backupTransFormer;
    }
    async saveBackup() {
        const userInfo = this.request.user;
        let result = null;
        const dbName = process.env.APP_MODE === "develop" ? "postgres" : "persiangulf_project";
        const dbUser = process.env.APP_MODE === "develop" ? "root" : "p3rshainglf";
        const filename = `${Date.now()}_backup.dump`;
        const backupAddr = process.cwd() + `/public/contents/backups/${filename}`;
        const command = `pg_dump -h ${process.env.DATABASE_HOST || 'localhost'} -U ${dbUser} -d ${dbName} -F c -f  "${backupAddr}"`;
        console.log("createBackup");
        console.log(command);
        let status = await this.executeCommand(command);
        console.log({ status });
        if (status !== 201) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        result = await this.prismaService.dbBackups.create({
            data: {
                userId: userInfo === null || userInfo === void 0 ? void 0 : userInfo.id,
                filename,
            },
            select: {
                id: true,
                filename: true,
                createdAt: true,
                userId: true,
            },
        });
        const transformer = this.backupTransFormer.transform(result);
        if (fs.existsSync(backupAddr)) {
            console.log("File exists and is ready to attach.");
        }
        else {
            console.log("File not found or inaccessible.");
        }
        return {
            status: common_1.HttpStatus.OK,
            message: messages_1.PublicMessage.OkResponse,
            data: transformer,
        };
    }
    async executeCommand(command) {
        return new Promise((resolve) => {
            (0, child_process_1.exec)(command, (error, stdout, stderr) => {
                let returnValue;
                if (error) {
                    console.error(`Process failed: ${error.message}`);
                    returnValue = 500;
                    resolve(returnValue);
                }
                if (stderr) {
                    console.error(`Process failed: ${stderr}`);
                    returnValue = 500;
                    resolve(returnValue);
                }
                console.log("Process successfully!");
                console.log(stdout);
                returnValue = 201;
                resolve(returnValue);
            });
        });
    }
    async getBackupList(query) {
        try {
            const count = await this.prismaService.dbBackups.count({});
            const total = this.getTotalPageNumber(Number(count), Number(query.per_page));
            const paginationValue = this.makePagination(Number(query.page), Number(query.per_page));
            let orderBy = {};
            if (query.sort == list_storefront_dto_1.MarketplaceStorefrontSort.newest) {
                orderBy = {
                    createdAt: "desc",
                };
            }
            else if (query.sort == list_storefront_dto_1.MarketplaceStorefrontSort.oldest) {
                orderBy = {
                    createdAt: "asc",
                };
            }
            const result = await this.prismaService.dbBackups.findMany({
                select: {
                    id: true,
                    filename: true,
                    createdAt: true,
                    userId: true,
                },
                orderBy,
                skip: paginationValue.offset,
                take: paginationValue.per_page,
            });
            return {
                status: 200,
                result,
                metadata: this.makeMetadata(Number(query.page), Number(query.per_page), Number(total)),
            };
        }
        catch (error) {
            console.error(`Error: get Backup`);
            console.log(error);
            return { status: 500 };
        }
    }
    async createZipPublicDir(user_id) {
        const filename = `${Date.now()}_public_backup.zip`;
        const sourceDir = process.cwd() + `/public/*`;
        const distDir = process.cwd() + `/public/contents/backups/${filename}`;
        const command = `zip -R ${distDir} ${sourceDir}`;
        console.log("createZipPublicDir");
        console.log(filename);
        console.log(command);
        let resultDB = null;
        let status = null;
        try {
            let result = await this.executeCommand(command);
            console.log({ result });
            if (result !== 500) {
                console.log(result);
                status = 201;
            }
            else {
                console.log("Error in Generate Backup");
                status = 500;
            }
            return { status, result: resultDB };
        }
        catch (error) {
            console.error(`Error: Backup process`);
            console.log(error);
            return { status: 500 };
        }
    }
    makeMetadata(page, per_page, total_page) {
        return {
            page,
            total_page,
            per_page: per_page,
            next: page < total_page,
            back: page > 1,
        };
    }
    makePagination(page, per_page) {
        return {
            offset: (page - 1) * per_page,
            per_page,
        };
    }
    getTotalPageNumber(total_number, per_page) {
        return Math.ceil(total_number / per_page);
    }
};
DbBackupService = __decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.REQUEST }),
    __param(0, (0, common_1.Inject)(core_1.REQUEST)),
    __metadata("design:paramtypes", [Object, prisma_service_1.PrismaService,
        Transformer_1.default])
], DbBackupService);
exports.DbBackupService = DbBackupService;
//# sourceMappingURL=dbBackup.service.js.map