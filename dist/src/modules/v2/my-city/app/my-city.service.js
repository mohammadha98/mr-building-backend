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
const UploaderFileTypes_1 = require("../../../../commons/contracts/UploaderFileTypes");
const ffmpeg = require("fluent-ffmpeg");
const SharpPipe_1 = require("../../../../commons/pipes/SharpPipe");
const UploadService_1 = require("../../../services/UploadService");
const myCity_files_enum_1 = require("./enums/myCity.files.enum");
const Transformer_1 = require("./Transformer");
const axios_1 = require("axios");
const Statuses_1 = require("../../../../commons/contracts/Statuses");
const myCity_category_enum_1 = require("./enums/myCity.category.enum");
const pagination_util_1 = require("../../../../commons/utils/pagination.util");
let MyCityService = class MyCityService {
    constructor(request, prismaService, uploadService, myCityTransformer) {
        this.request = request;
        this.prismaService = prismaService;
        this.uploadService = uploadService;
        this.myCityTransformer = myCityTransformer;
    }
    async UploadFile(body) {
        let dirname = "";
        let thumbnail = "";
        let result;
        if (body.type === "temp") {
            dirname = "temp/mycity/";
            if (body.file_type === UploaderFileTypes_1.default.video) {
                thumbnail = await this.generateThumbnailForVideo(body.file, dirname);
            }
            else {
                console.log({ dirname });
                const { path } = await this.generateThumbnailForImage(body.file, dirname);
                thumbnail = path;
            }
            result = await this.prismaService.myCityMedia.create({
                data: {
                    file_name: body.file,
                    file_type: body.file_type,
                    thumbnail,
                    tag: body.tag,
                },
            });
        }
        else {
            const source = `/temp/mycity/`;
            dirname = `/mycity/${body.id}/`;
            if (body.file_type === UploaderFileTypes_1.default.video) {
                thumbnail = await this.generateThumbnailForVideo(body.file, source);
            }
            else {
                const { path } = await this.generateThumbnailForImage(body.file, source);
                thumbnail = path;
            }
            const { path: file_name } = await this.uploadService.moveFile(body.file, "temp/mycity/", dirname);
            const path = await this.uploadService.moveFile(thumbnail.split("/").pop(), "temp/mycity/", dirname);
            thumbnail = path.path;
            if (body.priority === myCity_files_enum_1.MyCityFilePriorities.primary) {
                await this.prismaService.myCityMedia.updateMany({
                    where: { priority: myCity_files_enum_1.MyCityFilePriorities.primary },
                    data: { priority: myCity_files_enum_1.MyCityFilePriorities.normal },
                });
            }
            result = await this.prismaService.myCityMedia.create({
                data: {
                    file_name,
                    file_type: body.file_type,
                    thumbnail,
                    tag: "file",
                    myCity: { connect: { id: body.id } },
                },
            });
        }
        const transformer = this.myCityTransformer.transformFile(result);
        return {
            statusCode: axios_1.HttpStatusCode.Ok,
            message: messages_1.PublicMessage.OkResponse,
            data: transformer,
        };
    }
    async create(createGeolocationDto) {
        const { category, title, description, size, year_built, number_of_rooms, renovation_tax, latitude, longitude, province_id, city_id, files, } = createGeolocationDto;
        const result = await this.prismaService.myCityModel.create({
            data: {
                category,
                title,
                description,
                year_built,
                size,
                number_of_rooms,
                renovation_tax,
                latitude,
                longitude,
                province: {
                    connect: { id: province_id },
                },
                city: {
                    connect: { id: city_id },
                },
                client: {
                    connect: {
                        id: this.request.client.id,
                    },
                },
            },
            select: {
                id: true,
            },
        });
        if (files.length > 0) {
            files.map(async (item) => {
                const { path: file_name } = await this.uploadService.moveFile(item.file_name, "temp/mycity/", `/mycity/${result.id}/`);
                const { path: thumbnail } = await this.uploadService.moveFile(item.thumbnail.split("/").pop(), "temp/mycity/", `/mycity/${result.id}/`);
                await this.prismaService.myCityMedia.update({
                    where: { id: item.id },
                    data: {
                        file_name,
                        thumbnail,
                        priority: item.priority,
                        type: "file",
                        myCity: { connect: { id: result.id } },
                    },
                });
            });
        }
        return {
            statusCode: axios_1.HttpStatusCode.Created,
            message: messages_1.PublicMessage.Created,
        };
    }
    async findAll(query) {
        const { keyword, category, city_id, province_id } = query;
        const where = {
            status: Statuses_1.default.active,
            city_id: +city_id,
            province_id: +province_id,
        };
        if (keyword) {
            where.title = {
                contains: query.keyword,
                mode: "insensitive",
            };
        }
        if (category !== myCity_category_enum_1.MyCityCategoriesEnum.all) {
            where.category = category;
        }
        const count = await this.prismaService.myCityModel.count({
            where,
        });
        const { skip, page, per_page } = (0, pagination_util_1.PaginationSolver)(query);
        const list = await this.prismaService.myCityModel.findMany({
            where,
            include: {
                province: true,
                city: true,
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
        const { id: clientId } = this.request.client;
        const location = await this.getDetails(id, clientId);
        const tramsformer = this.myCityTransformer.localtionDetails(location);
        return {
            statusCode: axios_1.HttpStatusCode.Ok,
            message: messages_1.PublicMessage.OkResponse,
            data: tramsformer,
        };
    }
    async findNearLocations(mayNearDto) {
        console.log("findNear");
        console.log({ mayNearDto });
        const { distanceInMeters, latitude, longitude } = mayNearDto;
        let category = ` `;
        if (mayNearDto.category !== myCity_category_enum_1.MyCityCategoriesEnum.all) {
            category = ` AND category = '${mayNearDto.category}' `;
        }
        const query = `
      SELECT * FROM "MyCityModel"
      WHERE status = 'active' ${category} AND
            ST_DWithin(
              ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography, 
              ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography, 
              ${distanceInMeters}
            );
    `;
        const nearbyLocations = await this.prismaService.$queryRawUnsafe(query);
        const tramsformer = this.myCityTransformer.collection(nearbyLocations);
        return {
            statusCode: axios_1.HttpStatusCode.Ok,
            message: messages_1.PublicMessage.OkResponse,
            data: tramsformer,
        };
    }
    async myLocations(query) {
        const { id: clientId } = this.request.client;
        const count = await this.prismaService.myCityModel.count({
            where: { clientId },
        });
        const { skip, page, per_page } = (0, pagination_util_1.PaginationSolver)(query);
        const list = await this.prismaService.myCityModel.findMany({
            where: { clientId },
            include: {
                province: true,
                city: true,
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
    async findOne(id) {
        const location = await this.prismaService.myCityModel.findFirst({
            where: { id, status: Statuses_1.default.active },
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
    async getDetails(id, client_id) {
        const location = await this.prismaService.myCityModel.findFirst({
            where: { id, status: Statuses_1.default.active },
            include: {
                media: true,
                province: true,
                city: true,
                bookmarks: { where: { client_id }, take: 1 },
            },
        });
        if (!location) {
            throw new common_1.NotFoundException(messages_1.NotFoundMessage.NotFoundLocation);
        }
        return location;
    }
    async update(id, updateGeolocationDto) {
        const { category, title, description, size, year_built, number_of_rooms, status, renovation_tax, latitude, longitude, province_id, city_id, } = updateGeolocationDto;
        const location = (await this.findOne(id));
        await this.prismaService.myCityModel.update({
            where: { id: location.id },
            data: {
                category,
                title,
                description,
                size,
                year_built,
                number_of_rooms,
                status,
                renovation_tax,
                latitude,
                longitude,
                province: {
                    connect: { id: province_id },
                },
                city: {
                    connect: { id: city_id },
                },
            },
        });
        return true;
    }
    async updateLocationInMyCity(id, body) {
        const location = await this.findOne(id);
        const { id: clientId } = this.request.client;
        if (location.clientId === clientId) {
            await this.prismaService.myCityModel.update({
                where: { id: location.id },
                data: {
                    category: body.category,
                    title: body.title,
                    description: body.description,
                    size: body.size,
                    year_built: body.year_built,
                    number_of_rooms: body.number_of_rooms,
                    renovation_tax: body.renovation_tax,
                    latitude: body.latitude,
                    longitude: body.longitude,
                    province: {
                        connect: { id: body.province_id },
                    },
                    city: {
                        connect: { id: body.city_id },
                    },
                },
            });
        }
        return {
            statusCode: axios_1.HttpStatusCode.Ok,
            message: messages_1.PublicMessage.OkResponse,
        };
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
    async removeFile(id) {
        const file = await this.prismaService.myCityMedia.findFirst({
            where: { id },
        });
        if (!file) {
            throw new common_1.NotFoundException(messages_1.NotFoundMessage.NotFoundFile);
        }
        await this.uploadService.removeFile(file.file_name, "mycity");
        await this.prismaService.myCityMedia.delete({
            where: { id },
        });
        return {
            statusCode: axios_1.HttpStatusCode.Ok,
            message: messages_1.PublicMessage.Deleted,
        };
    }
    async changePriorityFile(id) {
        const file = await this.prismaService.myCityMedia.findFirst({
            where: { id },
        });
        if (!file) {
            throw new common_1.NotFoundException(messages_1.NotFoundMessage.NotFoundFile);
        }
        await this.prismaService.myCityMedia.updateMany({
            where: { myCityId: file.myCityId },
            data: { priority: myCity_files_enum_1.MyCityFilePriorities.normal },
        });
        await this.prismaService.myCityMedia.updateMany({
            where: { id },
            data: { priority: myCity_files_enum_1.MyCityFilePriorities.primary },
        });
        return {
            statusCode: axios_1.HttpStatusCode.Ok,
            message: messages_1.PublicMessage.OkResponse,
        };
    }
    async generateThumbnailForVideo(file, dir) {
        const path = this.uploadService.getPath();
        const filename = Date.now() + "-thumb.png";
        ffmpeg({ source: `${path}/${dir}/${file}` }).takeScreenshots({
            count: 1,
            timemarks: [0],
            filename,
        }, `${path}/${dir}/`);
        return `/${dir}/${filename}`;
    }
    async generateThumbnailForImage(file, dir) {
        const { path } = await (0, SharpPipe_1.default)(file, `/${dir}/`);
        return { path };
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