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
exports.MyCityBookmarksService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../prisma/prisma.service");
const core_1 = require("@nestjs/core");
const bookmark_factory_1 = require("./factories/bookmark.factory");
const axios_1 = require("axios");
const messages_1 = require("../../../commons/enums/messages");
const Transformer_1 = require("./Transformer");
let MyCityBookmarksService = class MyCityBookmarksService {
    constructor(request, prismaService, bookmarkFactory, bookmarkTransformer) {
        this.request = request;
        this.prismaService = prismaService;
        this.bookmarkFactory = bookmarkFactory;
        this.bookmarkTransformer = bookmarkTransformer;
    }
    async create(createBookmarkDto) {
        const { location_id } = createBookmarkDto;
        await this.bookmarkFactory.findOneLocationById(location_id);
        const { id: client_id } = this.request.client;
        const exist = await this.findExist(location_id, client_id);
        if (exist) {
            await this.prismaService.bookmarkMyCityLocation.delete({
                where: { id: exist.id },
            });
        }
        else {
            await this.prismaService.bookmarkMyCityLocation.create({
                data: { myCityId: location_id, client_id },
            });
        }
        return {
            statusCode: axios_1.HttpStatusCode.Ok,
            message: messages_1.PublicMessage.OkResponse,
        };
    }
    async findAll() {
        const { id: client_id } = this.request.client;
        const list = await this.prismaService.bookmarkMyCityLocation.findMany({
            where: { client_id },
            select: {
                id: true,
                myCity: {
                    select: {
                        id: true,
                        category: true,
                        province: true,
                        city: true,
                        title: true,
                        latitude: true,
                        longitude: true,
                    },
                },
            },
        });
        const transformer = this.bookmarkTransformer.collection(list);
        return {
            statusCode: axios_1.HttpStatusCode.Ok,
            message: messages_1.PublicMessage.OkResponse,
            data: transformer,
        };
    }
    async findExist(myCityId, client_id) {
        return await this.prismaService.bookmarkMyCityLocation.findFirst({
            where: { client_id, myCityId },
            include: {
                myCity: true,
            },
        });
    }
};
MyCityBookmarksService = __decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.REQUEST }),
    __param(0, (0, common_1.Inject)(core_1.REQUEST)),
    __metadata("design:paramtypes", [Object, prisma_service_1.PrismaService,
        bookmark_factory_1.BookmarkMyCityFactory,
        Transformer_1.default])
], MyCityBookmarksService);
exports.MyCityBookmarksService = MyCityBookmarksService;
//# sourceMappingURL=my-city-bookmarks.service.js.map