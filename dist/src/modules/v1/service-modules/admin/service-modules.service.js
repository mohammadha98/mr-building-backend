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
exports.ServiceModulesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../../prisma/prisma.service");
const UploadService_1 = require("../../../services/UploadService");
let ServiceModulesService = class ServiceModulesService {
    constructor(prismaService) {
        this.prismaService = prismaService;
        this.uploadService = new UploadService_1.default();
    }
    async saveServiceInfo(body) {
        try {
            let result;
            const isExistService = await this.prismaService.services.findFirst({
                where: {
                    type: body.type,
                },
                select: {
                    id: true,
                    type: true,
                    description: true,
                },
            });
            if (!isExistService) {
                result = await this.prismaService.services.create({
                    data: {
                        type: body.type,
                        description: body.description,
                    },
                    select: {
                        id: true,
                        type: true,
                        description: true,
                    },
                });
            }
            else {
                result = await this.prismaService.services.update({
                    where: {
                        id: isExistService.id,
                    },
                    data: {
                        description: body.description,
                    },
                    select: {
                        id: true,
                        type: true,
                        description: true,
                    },
                });
            }
            return { status: 201, result };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async create(body) {
        try {
            const result = await this.prismaService.servicesMedia.create({
                data: {
                    type: body.type,
                    fileType: body.file_type,
                    file: body.file,
                    creatorID: body.user_id,
                },
                select: {
                    id: true,
                    type: true,
                    fileType: true,
                    file: true,
                },
            });
            if (result) {
                this.uploadService.moveFile(body.file, "temp/services", `services/${body.type}/`);
            }
            return { status: 201, result };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async findAll(query) {
        try {
            const info = await this.prismaService.services.findFirst({
                where: {
                    type: query.type,
                },
                select: {
                    id: true,
                    description: true,
                },
            });
            if (!info) {
                return { status: 400 };
            }
            const media = await this.prismaService.servicesMedia.findMany({
                where: {
                    type: query.type,
                },
                select: {
                    id: true,
                    type: true,
                    fileType: true,
                    file: true,
                },
            });
            return { status: 201, service: { info, media } };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async remove(id) {
        try {
            const result = await this.prismaService.servicesMedia.findFirst({
                where: {
                    id,
                },
            });
            if (!result) {
                return { status: 400 };
            }
            this.uploadService.removeFile(result.file, `services/${result.type}/`);
            await this.prismaService.servicesMedia.delete({
                where: {
                    id,
                },
            });
            return { status: 201, result };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
};
ServiceModulesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ServiceModulesService);
exports.ServiceModulesService = ServiceModulesService;
//# sourceMappingURL=service-modules.service.js.map