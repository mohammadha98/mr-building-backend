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
const Statuses_1 = require("../../../../commons/contracts/Statuses");
let ServiceModulesService = class ServiceModulesService {
    constructor(prismaService) {
        this.prismaService = prismaService;
        this.uploadService = new UploadService_1.default();
    }
    async saveServiceInfo(body) {
        try {
            const isExistService = await this.prismaService.services.findFirst({
                where: {
                    id: body.service_id,
                },
            });
            if (!isExistService) {
                return { status: 400 };
            }
            if (body.reply_to_id.length > 0) {
                const checkValidReplyID = await this.prismaService.servicesComments.findFirst({
                    where: {
                        id: body.reply_to_id,
                    },
                });
                if (!checkValidReplyID) {
                    return { status: 400 };
                }
            }
            const result = await this.prismaService.servicesComments.create({
                data: {
                    client: { connect: { id: body.user_id } },
                    is_replied: body.reply_to_id.length > 0 ? true : false,
                    content: body.content,
                    status: Statuses_1.default.approved,
                    service: { connect: { id: body.service_id } },
                },
                select: {
                    id: true,
                    content: true,
                    is_replied: false,
                    client: { select: { id: true, name: true, surname: true } },
                    replied_by: {
                        select: {
                            id: true,
                            content: true,
                            is_replied: true,
                            client: { select: { id: true, name: true, surname: true } },
                        },
                    },
                },
            });
            if (body.reply_to_id.length > 0) {
                await this.prismaService.servicesComments.update({
                    where: { id: body.reply_to_id },
                    data: {
                        replied_by: { connect: { id: result.id } },
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
    async getComments(query) {
        try {
            const isExistService = await this.prismaService.services.findFirst({
                where: {
                    id: query.service_id,
                },
            });
            if (!isExistService) {
                return { status: 400 };
            }
            else {
                const count = await this.prismaService.services.count({
                    where: { id: query.service_id },
                });
                const total = this.getTotalPageNumber(Number(count), Number(query.per_page));
                const paginationValue = this.makePagination(Number(query.page), Number(query.per_page));
                const result = await this.prismaService.servicesComments.findMany({
                    where: { serviceID: query.service_id, is_replied: false },
                    orderBy: { createdAt: "desc" },
                    skip: paginationValue.offset,
                    take: paginationValue.per_page,
                    select: {
                        id: true,
                        content: true,
                        ServicesCommentLikes: { select: { clientID: true } },
                        is_replied: true,
                        client: { select: { id: true, name: true, surname: true } },
                        replied_by: {
                            select: {
                                id: true,
                                content: true,
                                is_replied: true,
                                client: { select: { id: true, name: true, surname: true } },
                                ServicesCommentLikes: { select: { clientID: true } },
                                replied_by: {
                                    select: {
                                        id: true,
                                        content: true,
                                        is_replied: true,
                                        client: { select: { id: true, name: true, surname: true } },
                                        ServicesCommentLikes: { select: { clientID: true } },
                                        replied_by: {
                                            select: {
                                                id: true,
                                                content: true,
                                                is_replied: true,
                                                client: {
                                                    select: { id: true, name: true, surname: true },
                                                },
                                                ServicesCommentLikes: { select: { clientID: true } },
                                                replied_by: {
                                                    select: {
                                                        id: true,
                                                        content: true,
                                                        is_replied: true,
                                                        client: {
                                                            select: { id: true, name: true, surname: true },
                                                        },
                                                        ServicesCommentLikes: {
                                                            select: { clientID: true },
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                });
                return {
                    status: 201,
                    result,
                    metadata: this.makeMetadata(Number(query.page), Number(query.per_page), Number(total)),
                };
            }
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async actionForComment(comment_id, client_id) {
        try {
            const checkValidComment = await this.prismaService.servicesComments.findFirst({
                where: { id: comment_id },
            });
            if (!checkValidComment) {
                return { status: 400 };
            }
            const isExistService = await this.prismaService.servicesCommentLikes.findFirst({
                where: {
                    commentID: comment_id,
                    clientID: Number(client_id),
                },
            });
            if (!isExistService) {
                await this.prismaService.servicesCommentLikes.create({
                    data: {
                        commentID: comment_id,
                        clientID: Number(client_id),
                    },
                });
                return {
                    status: 201,
                };
            }
            else {
                await this.prismaService.servicesCommentLikes.deleteMany({
                    where: {
                        commentID: comment_id,
                        clientID: Number(client_id),
                    },
                });
                return {
                    status: 200,
                };
            }
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
            const total_comments = await this.prismaService.servicesComments.count({
                where: {
                    serviceID: info.id,
                },
            });
            return { status: 201, service: { info, media, total_comments } };
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
ServiceModulesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ServiceModulesService);
exports.ServiceModulesService = ServiceModulesService;
//# sourceMappingURL=service-modules.service.js.map