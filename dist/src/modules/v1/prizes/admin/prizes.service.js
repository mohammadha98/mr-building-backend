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
exports.PrizesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../../prisma/prisma.service");
const internalServerErrorHandler_1 = require("../../../services/httpResponseHandler/internalServerErrorHandler");
const users_service_1 = require("../../users/admin/users.service");
const forbiddenErrorHandler_1 = require("../../../services/httpResponseHandler/forbiddenErrorHandler");
const UploadService_1 = require("../../../services/UploadService");
const Statuses_1 = require("../../../../commons/contracts/Statuses");
let PrizesService = class PrizesService {
    constructor(prismaService, userService) {
        this.prismaService = prismaService;
        this.userService = userService;
        this.UploadService = new UploadService_1.default();
    }
    async create(body) {
        try {
            const user = await this.userService.validateWithID(body.user_id);
            if (!user) {
                throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
            }
            const prizeInfo = await this.prismaService.prizes.findFirst({
                where: { id: Number(body.item_id) },
            });
            let result;
            if (!prizeInfo) {
                result = await this.prismaService.prizes.create({
                    data: {
                        creator_id: body.user_id,
                        title: body.title,
                        description: body.description,
                        point: Number(body.point),
                        thumbnail: body.thumbnail,
                        url: body.url,
                    },
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        point: true,
                        thumbnail: true,
                        status: true,
                        created_at: true,
                        url: true,
                        expired_at: true,
                    },
                });
                await this.prismaService.prizeCoupons.createMany({
                    data: body.coupons.map((item) => {
                        return {
                            status: Statuses_1.default.active,
                            coupon: item,
                            prizeId: result.id,
                        };
                    }),
                });
            }
            else {
                const thumbnail = body.thumbnail ? body.thumbnail : prizeInfo.thumbnail;
                result = await this.prismaService.prizes.update({
                    where: { id: Number(body.item_id) },
                    data: {
                        creator_id: body.user_id,
                        title: body.title,
                        description: body.description,
                        url: body.url,
                        point: Number(body.point),
                        thumbnail,
                    },
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        point: true,
                        thumbnail: true,
                        url: true,
                        status: true,
                        created_at: true,
                        expired_at: true,
                    },
                });
            }
            return result;
        }
        catch (error) {
            console.log(error);
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
    }
    async getPrizes(query) {
        try {
            const user = await this.userService.validateWithID(query.user_id);
            if (!user) {
                throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
            }
            const count = await this.prismaService.prizes.count();
            const total = this.getTotalPageNumber(Number(count), Number(query.per_page));
            const paginationValue = this.makePagination(Number(query.page), Number(query.per_page));
            const prizes = await this.prismaService.prizes.findMany({
                skip: paginationValue.offset,
                take: paginationValue.per_page,
                orderBy: { id: "desc" },
                select: {
                    id: true,
                    title: true,
                    status: true,
                    description: true,
                    created_at: true,
                    thumbnail: true,
                    point: true,
                    url: true,
                    coupons: {
                        select: {
                            id: true,
                            coupon: true,
                            status: true,
                        },
                    },
                    creator_id: true,
                    expired_at: true,
                },
            });
            return {
                prizes,
                metadata: this.makeMetadata(Number(query.page), Number(query.per_page), Number(total)),
            };
        }
        catch (error) {
            console.log(error);
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
    }
    async changeStatus(body) {
        try {
            const user = await this.userService.validateWithID(body.user_id);
            if (!user) {
                throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
            }
            await this.prismaService.prizes.update({
                where: {
                    id: Number(body.item_id),
                },
                data: {
                    status: body.status,
                },
            });
        }
        catch (error) {
            console.log(error);
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
    }
    async deletePrize(body) {
        try {
            const user = await this.userService.validateWithID(body.user_id);
            if (!user) {
                throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
            }
            const itemInfo = await this.prismaService.prizes.findFirst({
                where: { id: Number(body.item_id) },
            });
            if (itemInfo) {
                await this.prismaService.prizeCoupons.deleteMany({
                    where: {
                        prizeId: Number(body.item_id),
                    },
                });
                await this.prismaService.prizes.deleteMany({
                    where: {
                        id: Number(body.item_id),
                    },
                });
                await this.UploadService.removeFile(itemInfo.thumbnail, "prizes");
            }
        }
        catch (error) {
            console.log(error);
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
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
PrizesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        users_service_1.UsersService])
], PrizesService);
exports.PrizesService = PrizesService;
//# sourceMappingURL=prizes.service.js.map