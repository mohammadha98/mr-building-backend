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
exports.BannerService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../prisma/prisma.service");
const UploadService_1 = require("../../services/UploadService");
const transformer_admin_1 = require("./contracts/transformer-admin");
const messages_1 = require("../../../commons/enums/messages");
const pagination_util_1 = require("../../../commons/utils/pagination.util");
let BannerService = class BannerService {
    constructor(prisma, bannerTransformer) {
        this.prisma = prisma;
        this.bannerTransformer = bannerTransformer;
        this.uploaderService = new UploadService_1.default();
    }
    async create(createSliderDto) {
        const result = await this.prisma.banners.create({
            data: {
                title: createSliderDto.title,
                thumbnail: createSliderDto.thumbnail,
                url: createSliderDto.url,
                tag: createSliderDto.tag,
            },
            select: {
                id: true,
                title: true,
                tag: true,
                thumbnail: true,
                url: true,
                created_at: true,
            },
        });
        const transformer = this.bannerTransformer.transform(result);
        return {
            statusCode: common_1.HttpStatus.CREATED,
            message: messages_1.PublicMessage.Created,
            data: transformer,
        };
    }
    async findAll(pagination) {
        const { page, per_page, skip } = (0, pagination_util_1.PaginationSolver)(pagination);
        const count = await this.prisma.banners.count();
        const result = await this.prisma.banners.findMany({
            orderBy: { id: "desc" },
            skip,
            take: per_page,
        });
        const banners = this.bannerTransformer.collection(result);
        return {
            banners,
            metadata: (0, pagination_util_1.PaginationGenerator)(page, per_page, count),
        };
    }
    async update(body) {
        const info = await this.prisma.banners.findUnique({
            where: { id: Number(body.item_id) },
        });
        if (!info) {
            throw new common_1.BadRequestException();
        }
        let file_name = info.thumbnail;
        if (body.file) {
            await this.uploaderService.removeFile(file_name, "sliders");
            file_name = body.file;
        }
        else {
            file_name = info.thumbnail;
        }
        const result = await this.prisma.banners.update({
            where: { id: Number(body.item_id) },
            data: {
                thumbnail: file_name,
                tag: body.tag,
                url: body.url,
                title: body.title,
            },
            select: { id: true, title: true, thumbnail: true, url: true, tag: true },
        });
        const response = this.bannerTransformer.transform(result);
        return {
            statusCode: 200,
            message: messages_1.PublicMessage.OkResponse,
            data: response,
        };
    }
    async remove(id) {
        const info = await this.prisma.banners.findUnique({
            where: { id: Number(id) },
        });
        if (!info) {
            throw new common_1.BadRequestException();
        }
        const file_name = info.thumbnail;
        await this.uploaderService.removeFile(file_name, "sliders");
        await this.prisma.banners.delete({ where: { id: Number(id) } });
        return { statusCode: 200, message: messages_1.PublicMessage.Deleted };
    }
};
BannerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        transformer_admin_1.default])
], BannerService);
exports.BannerService = BannerService;
//# sourceMappingURL=banner.service.js.map