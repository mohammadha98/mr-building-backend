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
exports.MyCityService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../../prisma/prisma.service");
const messages_1 = require("../../../../commons/enums/messages");
const core_1 = require("@nestjs/core");
const UploadService_1 = require("../../../services/UploadService");
const Transformer_1 = require("./Transformer");
const axios_1 = require("axios");
const myCity_category_enum_1 = require("./enums/myCity.category.enum");
const pagination_util_1 = require("../../../../commons/utils/pagination.util");
let MyCityService = class MyCityService {
    constructor(request, prismaService, uploadService, myCityTransformer) {
        this.request = request;
        this.prismaService = prismaService;
        this.uploadService = uploadService;
        this.myCityTransformer = myCityTransformer;
    }
    async findAll(query) {
        const { keyword, category, city_id, province_id, status } = query;
        const where = {};
        if (keyword) {
            where.title = {
                contains: query.keyword,
                mode: "insensitive",
            };
        }
        if (category !== myCity_category_enum_1.MyCityCategoriesEnum.all) {
            where.category = category;
        }
        if (province_id) {
            where.province_id = province_id;
        }
        if (city_id) {
            where.city_id = city_id;
        }
        if (status !== "all") {
            where.status = status;
        }
        console.log({ where });
        const count = await this.prismaService.myCityModel.count({
            where,
        });
        const { skip, page, per_page } = (0, pagination_util_1.PaginationSolver)(query);
        const list = await this.prismaService.myCityModel.findMany({
            where,
            include: {
                province: true,
                city: true,
                client: true,
            },
            skip,
            take: per_page,
        });
        const tramsformer = this.myCityTransformer.collection(list);
        return {
            statusCode: axios_1.HttpStatusCode.Ok,
            message: messages_1.PublicMessage.OkResponse,
            data: {
                data: tramsformer,
                metadata: (0, pagination_util_1.PaginationGenerator)(query.page, per_page, count),
            },
        };
    }
    async locationDetails(id) {
        console.log("locationDetails");
        const location = await this.getDetails(id);
        const tramsformer = this.myCityTransformer.localtionDetails(location);
        return {
            statusCode: axios_1.HttpStatusCode.Ok,
            message: messages_1.PublicMessage.OkResponse,
            data: tramsformer,
        };
    }
    async findOne(id) {
        const location = await this.prismaService.myCityModel.findFirst({
            where: { id },
            include: {
                media: true,
                province: true,
                city: true,
            },
        });
        if (!location) {
            throw new common_1.NotFoundException(messages_1.NotFoundMessage.NotFoundLocation);
        }
        return location;
    }
    async getDetails(id) {
        const location = await this.prismaService.myCityModel.findFirst({
            where: { id },
            include: {
                media: true,
                province: true,
                city: true,
                client: true,
            },
        });
        if (!location) {
            throw new common_1.NotFoundException(messages_1.NotFoundMessage.NotFoundLocation);
        }
        return location;
    }
    async remove(id) {
        const location = (await this.findOne(id));
        const files = await this.prismaService.myCityMedia.findMany({
            where: { myCityId: location.id },
        });
        files.map(async (item) => {
            await this.uploadService.removeFile(item.file_name, "mycity");
        });
        await this.prismaService.myCityMedia.deleteMany({
            where: { myCityId: location.id },
        });
        await this.prismaService.myCityModel.delete({
            where: { id: location.id },
        });
        return {
            statusCode: axios_1.HttpStatusCode.Ok,
            message: messages_1.PublicMessage.Deleted,
        };
    }
    async changeStatus(id, status) {
        await this.findOne(id);
        await this.prismaService.myCityModel.update({
            where: { id },
            data: { status },
        });
        return {
            statusCode: axios_1.HttpStatusCode.Ok,
            message: messages_1.PublicMessage.OkResponse,
        };
    }
};
MyCityService = __decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.REQUEST }),
    __param(0, (0, common_1.Inject)(core_1.REQUEST)),
    __metadata("design:paramtypes", [Object, prisma_service_1.PrismaService,
        UploadService_1.default,
        Transformer_1.default])
], MyCityService);
exports.MyCityService = MyCityService;
//# sourceMappingURL=my-city.service.js.map