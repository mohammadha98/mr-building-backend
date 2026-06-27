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
exports.SliderService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../prisma/prisma.service");
const UploadService_1 = require("../../services/UploadService");
const Statuses_1 = require("../../../commons/contracts/Statuses");
const transformer_app_1 = require("./contracts/transformer-app");
let SliderService = class SliderService {
    constructor(prisma, sliderTransformer) {
        this.prisma = prisma;
        this.sliderTransformer = sliderTransformer;
        this.uploaderService = new UploadService_1.default();
    }
    async create(createSliderDto) {
        try {
            return await this.prisma.slider.create({
                data: {
                    title: createSliderDto.title,
                    thumbnail: createSliderDto.thumbnail,
                    tag: createSliderDto.tag,
                },
                select: {
                    id: true,
                    title: true,
                    tag: true,
                    thumbnail: true,
                    created_at: true,
                },
            });
        }
        catch (error) {
            return false;
        }
    }
    async findAll(pagination) {
        const count = await this.prisma.slider.count();
        const total = this.getTotalPageNumber(Number(count), Number(pagination.per_page));
        const paginationValue = this.makePagination(Number(pagination.page), Number(pagination.per_page));
        const sliders = await this.prisma.slider.findMany({
            orderBy: { id: "desc" },
            skip: paginationValue.offset,
            take: paginationValue.per_page,
        });
        return {
            sliders,
            metadata: this.makeMetadata(Number(pagination.page), Number(pagination.per_page), Number(total)),
        };
    }
    async update(body) {
        try {
            const info = await this.prisma.slider.findUnique({
                where: { id: Number(body.item_id) },
            });
            let file_name = info.thumbnail;
            if (body.file) {
                await this.uploaderService.removeFile(file_name, "sliders");
                file_name = body.file;
            }
            else {
                file_name = info.thumbnail;
            }
            const result = await this.prisma.slider.update({
                where: { id: Number(body.item_id) },
                data: { thumbnail: file_name, tag: body.tag },
                select: { id: true, title: true, thumbnail: true },
            });
            return { status: 200, result };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async remove(id) {
        try {
            const info = await this.prisma.slider.findUnique({
                where: { id: Number(id) },
            });
            const file_name = info.thumbnail;
            await this.uploaderService.removeFile(file_name, "sliders");
            await this.prisma.slider.delete({ where: { id: Number(id) } });
            return { status: 200 };
        }
        catch (error) {
            return { status: 500 };
        }
    }
    async getSliders(tag) {
        const sliders = await this.prisma.slider.findMany({
            orderBy: { id: "desc" },
            where: { status: Statuses_1.default.active, tag },
        });
        return this.sliderTransformer.collection(sliders);
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
SliderService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        transformer_app_1.default])
], SliderService);
exports.SliderService = SliderService;
//# sourceMappingURL=slider.service.js.map