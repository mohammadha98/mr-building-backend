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
exports.StorefrontService = void 0;
const common_1 = require("@nestjs/common");
const client_service_1 = require("../../client/app/client.service");
const Statuses_1 = require("../../../../commons/contracts/Statuses");
const list_storefront_dto_1 = require("./dto/list-storefront.dto");
const StorefrontPostgresqlRepository_1 = require("../repositories/StorefrontPostgresqlRepository");
const prisma_service_1 = require("../../../../../prisma/prisma.service");
const UploadService_1 = require("../../../services/UploadService");
const marketplace_categories_service_1 = require("../../marketplace-categories/marketplace-categories.service");
const marketplace_brands_service_1 = require("../../marketplace-brands/marketplace-brands.service");
const delete_media_item_dto_1 = require("../../real-estate-ads/app/dto/delete-media-item.dto");
const RealEstateAdMediaTypePriorities_1 = require("../../../../commons/contracts/RealEstateAdMediaTypePriorities");
const RealEstateAdMediaType_1 = require("../../../../commons/contracts/RealEstateAdMediaType");
const get_product_dto_1 = require("./dto/get-product.dto");
const SortingTypes_1 = require("../../../../commons/contracts/SortingTypes");
const SortingTypes_2 = require("../../../../commons/contracts/SortingTypes");
const mailerService_1 = require("../../../services/notifications/mailer/mailerService");
const core_1 = require("@nestjs/core");
const Transformer_1 = require("./Transformer");
const Transformer_2 = require("../../marketplace-categories/Transformer");
const Transformer_3 = require("../../marketplace-brands/Transformer");
const StorefrontUnitSales_1 = require("./dto/StorefrontUnitSales");
const messages_1 = require("../../../../commons/enums/messages");
const UploaderFileTypes_1 = require("../../../../commons/contracts/UploaderFileTypes");
const get_products_dto_1 = require("../../marketplace/app/dto/get-products.dto");
const pagination_util_1 = require("../../../../commons/utils/pagination.util");
const SharpPipe_1 = require("../../../../commons/pipes/SharpPipe");
const delete_media_item_products_dto_1 = require("./dto/delete-media-item-products.dto");
const UploaderFileTypes_2 = require("../../../../commons/contracts/UploaderFileTypes");
const ffmpeg = require("fluent-ffmpeg");
const FcmNotificationService_1 = require("../../../services/notifications/fcm/FcmNotificationService");
const axios_1 = require("axios");
let StorefrontService = class StorefrontService {
    constructor(request, prismaService, storefrontTransformer, storefrontPostgresRepository, marketplaceCategoriesService, marketplaceBrandsService, clientService, uploadService, mailerService, marketplaceCategoriesTransformer, marketplaceBrandsTransformer, notificationService) {
        this.request = request;
        this.prismaService = prismaService;
        this.storefrontTransformer = storefrontTransformer;
        this.storefrontPostgresRepository = storefrontPostgresRepository;
        this.marketplaceCategoriesService = marketplaceCategoriesService;
        this.marketplaceBrandsService = marketplaceBrandsService;
        this.clientService = clientService;
        this.uploadService = uploadService;
        this.mailerService = mailerService;
        this.marketplaceCategoriesTransformer = marketplaceCategoriesTransformer;
        this.marketplaceBrandsTransformer = marketplaceBrandsTransformer;
        this.notificationService = notificationService;
    }
    async SaveNewProduct(body) {
        body.client_id = this.request.client.id;
        const storefrontInfo = await this.prismaService.storefront.findFirst({
            where: { client_id: body.client_id },
        });
        if (!storefrontInfo) {
            throw new common_1.BadRequestException(messages_1.NotFoundMessage.NotFoundStorefront);
        }
        body.storefront_id = storefrontInfo.id;
        body.tracking_code = await this.generateTrackingCode("product_");
        const newItem = await this.storefrontPostgresRepository.saveProduct(body);
        if (body.items.length) {
            body.items.map(async (item) => {
                await this.storefrontPostgresRepository.createItem({
                    data: {
                        product: { connect: { id: newItem.id } },
                        feature: { connect: { id: item.id } },
                        value: item.value,
                    },
                });
            });
        }
        if (body.media.length) {
            body.media.map(async (item) => {
                const fileInfo = await this.storefrontPostgresRepository.getFileInfo(item.id);
                const filename = fileInfo === null || fileInfo === void 0 ? void 0 : fileInfo.file_name.split("/").pop();
                const { path } = await this.uploadService.moveFile(filename, "/marketplace/temp_file/", `/marketplace/products/${newItem.id}/`);
                const { path: thumbnail } = await (0, SharpPipe_1.default)(filename, `/marketplace/products/${newItem.id}/`);
                item.file_name = path;
                await this.prismaService.marketplaceMediaFiles.update({
                    where: { id: item.id },
                    data: {
                        file_name: path,
                        priority: item.priority,
                        thumbnail,
                        product: { connect: { id: newItem.id } },
                        type: "normal",
                    },
                });
            });
        }
        return {
            statusCode: 200,
            message: "ویرایش با موفقیت انجام شد.",
            data: { product_id: newItem.id },
        };
    }
    async updateProduct(body) {
        body.client_id = this.request.client.id;
        const details = await this.storefrontPostgresRepository.findProductById(body.product_id);
        if (!details) {
            throw new common_1.BadRequestException(messages_1.NotFoundMessage.NotFoundStorefrontProduct);
        }
        await this.storefrontPostgresRepository.removeItems(body.product_id);
        if (body.items.length) {
            body.items.map(async (item) => {
                await this.storefrontPostgresRepository.createItem({
                    data: {
                        product: { connect: { id: details.id } },
                        feature: { connect: { id: item.id } },
                        value: item.value,
                    },
                });
            });
        }
        await this.storefrontPostgresRepository.updateProductById({ id: body.product_id }, body);
        return {
            statusCode: 201,
            message: "ویرایش با موفقیت انجام شد.",
            data: { product_id: body.product_id },
        };
    }
    async findStorefrontProducts(body) {
        body.client_id = this.request.client.id;
        const storefrontInfo = await this.prismaService.storefront.findFirst({
            where: { id: body.storefront_id },
        });
        if (!storefrontInfo) {
            throw new common_1.BadRequestException(messages_1.NotFoundMessage.NotFoundStorefront);
        }
        let condition = { storefrontId: body.storefront_id };
        if (body.status !== Statuses_1.default.all) {
            condition = Object.assign(Object.assign({}, condition), { status: body.status });
        }
        if (body.type === get_product_dto_1.GetProductTypes.search) {
            condition = Object.assign(Object.assign({}, condition), { title: {
                    contains: body.keyword,
                    mode: "insensitive",
                } });
        }
        const count = await this.storefrontPostgresRepository.countProduct(condition);
        const total = this.getTotalPageNumber(Number(count), Number(body.per_page));
        const paginationValue = this.makePagination(Number(body.page), Number(body.per_page));
        let orderBy = { createdAt: "desc" };
        if (body.sort === SortingTypes_1.default.newest) {
            orderBy = { createdAt: "desc" };
        }
        else if (body.sort === SortingTypes_1.default.oldest) {
            orderBy = { createdAt: "asc" };
        }
        else if (body.sort === SortingTypes_1.default.most_expensive) {
            orderBy = { price: "desc" };
        }
        else if (body.sort === SortingTypes_1.default.cheapest) {
            orderBy = { price: "asc" };
        }
        console.log({ condition });
        console.log({ orderBy });
        const list = await this.storefrontPostgresRepository.findManyProducts({
            where: Object.assign({}, condition),
            select: {
                id: true,
                category: { select: { id: true, title: true } },
                subCategory: { select: { id: true, title: true } },
                brand: { select: { id: true, title: true } },
                trackingCode: true,
                title: true,
                description: true,
                status: true,
                price: true,
                unitOfSales: true,
                hasDiscount: true,
                discountedPrice: true,
                colors: true,
                storefront: {
                    select: {
                        id: true,
                        name: true,
                        avatar_thumbnail: true,
                        avatar: true,
                        license: true,
                        phone: true,
                        province: { select: { id: true, name: true } },
                        city: { select: { id: true, name: true } },
                    },
                },
                files: {
                    where: {
                        file_type: RealEstateAdMediaType_1.default.image,
                        priority: RealEstateAdMediaTypePriorities_1.default.primary,
                    },
                    select: {
                        id: true,
                        file_name: true,
                        thumbnail: true,
                        file_type: true,
                        sort_number: true,
                        priority: true,
                    },
                },
            },
            orderBy,
            skip: paginationValue.offset,
            take: paginationValue.per_page,
        });
        const transform = this.storefrontTransformer.collectionProduct(list);
        return {
            statusCode: 201,
            message: "محصولات فروشگاه در دسترس است.",
            data: {
                data: transform,
                metadata: (0, pagination_util_1.PaginationGenerator)(body.page, body.per_page, count),
            },
        };
    }
    async changeStatusProduct(body) {
        body.client_id = this.request.client.id;
        const storefrontInfo = await this.storefrontPostgresRepository.findProductById(body.product_id);
        if (!storefrontInfo) {
            throw new common_1.BadRequestException(messages_1.NotFoundMessage.NotFoundStorefront);
        }
        await this.storefrontPostgresRepository.changeStatusProduct({
            id: body.product_id,
        }, { status: body.status });
        return {
            statusCode: 200,
            message: "وضعیت با موفقیت ثبت شد.",
            data: {},
        };
    }
    async deleteProduct(product_id) {
        const storefrontInfo = await this.storefrontPostgresRepository.findProductById(product_id);
        if (!storefrontInfo) {
            throw new common_1.BadRequestException(messages_1.NotFoundMessage.NotFoundStorefrontProduct);
        }
        await this.storefrontPostgresRepository.deleteProduct({
            id: product_id,
        });
        this.uploadService.removeDir(`/marketplace/products/${product_id}`);
        return {
            statusCode: 200,
            message: messages_1.PublicMessage.Deleted,
            data: {},
        };
    }
    async addStorefrontIntoBookmark(storefront_id) {
        await this.storefrontPostgresRepository.bookmarkStorefront(storefront_id, this.request.client.id);
        return {
            statusCode: axios_1.HttpStatusCode.Created,
            message: messages_1.PublicMessage.Created,
            data: {},
        };
    }
    async getBookmarkedList() {
        const list = await this.storefrontPostgresRepository.getBookmarkList(this.request.client.id);
        const presentedStorefront = list.map((item) => item.storefront);
        const transform = this.storefrontTransformer.collection(presentedStorefront);
        return {
            statusCode: 200,
            message: messages_1.PublicMessage.OkResponse,
            data: transform,
        };
    }
    async storeRequest(body) {
        body.user_id = this.request.client.id;
        let result = await this.storefrontPostgresRepository.findOne({
            client_id: Number(body.user_id),
        });
        let avatar_thumbnail = null;
        if (!result) {
            const trackingCode = await this.generateTrackingCode("store_");
            result = await this.storefrontPostgresRepository.create({
                client_id: Number(body.user_id),
                trackingCode,
                name: body.name,
                description: body.description,
                color: body.color,
                avatar: body.avatar,
                license: body.license,
                categoryId: body.categoryId,
                province_id: Number(body.province_id),
                city_id: Number(body.city_id),
            });
            if (body.avatar) {
                await this.moveFile(body.avatar, "temp/storefronts", `/storefronts/${result.id}/avatars/`);
                const { path } = await (0, SharpPipe_1.default)(body.avatar, `/storefronts/${result.id}/avatars/`);
                avatar_thumbnail = path;
            }
            if (body.license) {
                await this.moveFile(body.license, "temp/storefronts", `/storefronts/${result.id}/licenses/`);
            }
            result = await this.storefrontPostgresRepository.updateOne({ id: result.id }, {
                avatar_thumbnail,
            });
            const notificationTokens = await this.prismaService.clientNotificaionTokens.findMany({
                where: { client_id: body.user_id },
            });
            let tokens = [];
            notificationTokens.map((item) => tokens.push(item.notification_token));
            await this.notificationService.subscribeToTopic(tokens, trackingCode);
        }
        else {
            if (!body.avatar) {
                body.avatar = result.avatar;
            }
            else {
                await this.moveFile(body.avatar, "temp/storefronts", `/storefronts/${result.id}/avatars/`);
                const { path } = await (0, SharpPipe_1.default)(body.avatar, `/storefronts/${result.id}/avatars/`);
                avatar_thumbnail = path;
            }
            if (!body.license) {
                body.license = result.license;
            }
            else {
                await this.moveFile(body.license, "temp/storefronts", `/storefronts/${result.id}/licenses/`);
            }
            result = await this.storefrontPostgresRepository.updateOne({ id: result.id }, {
                name: body.name,
                description: body.description,
                color: body.color,
                avatar: body.avatar,
                avatar_thumbnail,
                license: body.license,
                categoryId: body.categoryId,
                province_id: Number(body.province_id),
                city_id: Number(body.city_id),
            });
        }
        const response = await this.prismaService.storefront.findFirst({
            where: { id: result.id },
            select: {
                id: true,
                trackingCode: true,
                name: true,
                description: true,
                color: true,
                avatar: true,
                avatar_thumbnail: true,
                license: true,
                license_status: true,
                score: true,
                number_of_products: true,
                status: true,
                client_id: true,
                categoryId: true,
                province: { select: { id: true, name: true } },
                city: { select: { id: true, name: true } },
            },
        });
        const numberOfProducts = await this.prismaService.storefrontProducts.count({
            where: { storefrontId: response.id },
        });
        response.number_of_products = numberOfProducts;
        await this.sendEmailForAdmins();
        const transform = this.storefrontTransformer.transform(response);
        return {
            statusCode: 201,
            message: "درخواست شما با موفقیت ثبت شد. بعد تایید میتوانید از امکانات بخش موردنظر استفاده کنید.",
            data: transform,
        };
    }
    async generateTrackingCode(name) {
        const uniqueCode = name + (Math.random() * (100000000 - 1000000) + 100000000).toFixed(0);
        const isCodeUnique = await this.storefrontPostgresRepository.findOne({
            trackingCode: uniqueCode,
        });
        if (isCodeUnique) {
            return this.generateTrackingCode(name);
        }
        return uniqueCode;
    }
    async moveFile(filename, sourcePath, destPath) {
        return await this.uploadService.moveFile(filename, sourcePath, destPath);
    }
    async listOfStorefronts(query) {
        const count = await this.storefrontPostgresRepository.count({
            status: Statuses_1.default.active,
        });
        const total = this.getTotalPageNumber(Number(count), Number(query.per_page));
        const paginationValue = this.makePagination(Number(query.page), Number(query.per_page));
        let orderBy = {};
        if (query.sort == list_storefront_dto_1.MarketplaceStorefrontSort.newest) {
            orderBy = {
                created_at: "desc",
            };
        }
        else if (query.sort == list_storefront_dto_1.MarketplaceStorefrontSort.oldest) {
            orderBy = {
                created_at: "asc",
            };
        }
        else if (query.sort == list_storefront_dto_1.MarketplaceStorefrontSort.best_selling) {
            orderBy = {
                number_of_sales: "desc",
            };
        }
        else if (query.sort == list_storefront_dto_1.MarketplaceStorefrontSort.most_chosen) {
            orderBy = [
                {
                    number_of_sales: "desc",
                },
                {
                    total_score: "desc",
                },
            ];
        }
        let condition = {
            status: Statuses_1.default.active,
            province_id: Number(query.province_id),
        };
        if (query.category_id) {
            condition = Object.assign(Object.assign({}, condition), { categoryId: query.category_id });
        }
        if (query.city_id) {
            condition = Object.assign(Object.assign({}, condition), { city_id: query.city_id });
        }
        if (query.keyword) {
            condition = Object.assign(Object.assign({}, condition), { name: {
                    contains: query.keyword,
                    mode: "insensitive",
                } });
        }
        console.log({ condition });
        console.log({ orderBy });
        const list = await this.prismaService.storefront.findMany({
            where: Object.assign({}, condition),
            select: {
                id: true,
                trackingCode: true,
                name: true,
                color: true,
                description: true,
                avatar: true,
                avatar_thumbnail: true,
                status: true,
                score: true,
                client_id: true,
                products: {
                    where: { status: Statuses_1.default.active },
                    take: 4,
                    select: {
                        id: true,
                        files: {
                            where: {
                                file_type: UploaderFileTypes_1.default.image,
                                priority: RealEstateAdMediaTypePriorities_1.default.primary,
                            },
                            select: {
                                id: true,
                                file_name: true,
                                thumbnail: true,
                                file_type: true,
                                sort_number: true,
                                priority: true,
                            },
                            orderBy: { sort_number: "desc" },
                            take: 1,
                        },
                    },
                },
                province: { select: { id: true, name: true } },
                city: { select: { id: true, name: true } },
            },
            orderBy,
            skip: paginationValue.offset,
            take: paginationValue.per_page,
        });
        const transformer = this.storefrontTransformer.collection(list);
        return {
            statusCode: 200,
            message: "لیست فروشگاه در دسترس است.",
            data: {
                data: transformer,
                metadata: this.makeMetadata(Number(query.page), Number(query.per_page), Number(total)),
            },
        };
    }
    async storefrontDetails(storeId) {
        const details = await this.prismaService.storefront.findFirst({
            where: {
                id: storeId,
            },
            select: {
                id: true,
                trackingCode: true,
                client_id: true,
                description: true,
                color: true,
                name: true,
                avatar: true,
                avatar_thumbnail: true,
                license: true,
                license_status: true,
                status: true,
                score: true,
                number_of_products: true,
                province: { select: { id: true, name: true } },
                city: { select: { id: true, name: true } },
                categoryId: true,
            },
            orderBy: { id: "desc" },
        });
        const numberOfProducts = await this.prismaService.storefrontProducts.count({
            where: { storefrontId: details.id },
        });
        details.number_of_products = numberOfProducts;
        const transformer = this.storefrontTransformer.transform(details);
        const isBookmark = await this.storefrontPostgresRepository.getStorefrontIsBookmarked(this.request.client.id, storeId);
        console.log({ isBookmark });
        transformer.is_bookmark = !!isBookmark;
        console.log(transformer.is_bookmark);
        return {
            statusCode: 200,
            message: "جزییات فروشگاه در دسترس است.",
            data: transformer,
        };
    }
    async getCategories() {
        const categories = await this.marketplaceCategoriesService.getCategoriesForApp();
        const categoriesTransformer = this.marketplaceCategoriesTransformer.collection(categories);
        const brands = await this.getBrands();
        const brandsTransformer = this.marketplaceBrandsTransformer.collection(brands);
        return {
            statusCode: 200,
            message: "نیازمندی ها در دسترس است.",
            data: {
                categories: categoriesTransformer,
                brands: brandsTransformer,
                units: StorefrontUnitSales_1.default,
            },
        };
    }
    async getBrands() {
        return await this.marketplaceBrandsService.getBrandsForApp();
    }
    async findOne(id) {
        try {
            return await this.storefrontPostgresRepository.findOne({
                id,
            });
        }
        catch (error) {
            return { status: 500 };
        }
    }
    async findByClientId(client_id) {
        const result = await this.prismaService.storefront.findFirst({
            where: { client_id },
            select: {
                id: true,
                trackingCode: true,
                client_id: true,
                description: true,
                color: true,
                name: true,
                avatar: true,
                avatar_thumbnail: true,
                license: true,
                license_status: true,
                status: true,
                score: true,
                number_of_products: true,
                province: { select: { id: true, name: true } },
                city: { select: { id: true, name: true } },
                categoryId: true,
            },
        });
        if (!result) {
            return null;
        }
        const numberOfProducts = await this.prismaService.storefrontProducts.count({
            where: { storefrontId: result.id },
        });
        result.number_of_products = numberOfProducts;
        return this.storefrontTransformer.transform(result);
    }
    async updateScore(where, data) {
        try {
            return await this.storefrontPostgresRepository.updateOne(where, data);
        }
        catch (error) {
            return { status: 500 };
        }
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
    async UploadFile(body) {
        body.client_id = this.request.client.id;
        body.file = this.request.file.filename;
        console.log("*** UploadFile: Storefront Products ***");
        console.log({ body });
        let result;
        let source = "temp/products/files/";
        let destPath = "marketplace/temp_file/";
        if (body.product_id && body.type === delete_media_item_products_dto_1.MediaItemTypes.file) {
            destPath = `/marketplace/products/${body.product_id}/`;
            const { path } = await this.moveFile(body.file, source, destPath);
            if (body.file_type === UploaderFileTypes_2.default.video) {
                body.thumbnail = await this.generateThumbnailForVideo(body.file, destPath);
            }
            else {
                const { path } = await this.generateThumbnailForImage(body.file, destPath);
                body.thumbnail = path;
            }
            body.file = path;
            result = await this.prismaService.marketplaceMediaFiles.create({
                data: {
                    thumbnail: body.thumbnail,
                    type: "normal",
                    file_type: body.file_type,
                    file_name: body.file,
                    product: { connect: { id: body.product_id } },
                    priority: body.priority,
                },
                select: {
                    id: true,
                    file_name: true,
                    file_type: true,
                    thumbnail: true,
                    sort_number: true,
                    priority: true,
                },
            });
        }
        else {
            const { path } = await this.moveFile(body.file, source, destPath);
            if (body.file_type === UploaderFileTypes_2.default.video) {
                body.thumbnail = await this.generateThumbnailForVideo(body.file, destPath);
            }
            else {
                const { path } = await this.generateThumbnailForImage(body.file, destPath);
                body.thumbnail = path;
            }
            body.file = path;
            result = await this.prismaService.marketplaceMediaFiles.create({
                data: {
                    thumbnail: body.thumbnail,
                    file_type: body.file_type,
                    file_name: body.file,
                    priority: body.priority,
                },
                select: {
                    id: true,
                    file_name: true,
                    file_type: true,
                    thumbnail: true,
                    sort_number: true,
                    priority: true,
                },
            });
        }
        if (body.priority === RealEstateAdMediaTypePriorities_1.default.primary) {
            await this.prismaService.marketplaceMediaFiles.updateMany({
                where: {
                    productId: body.product_id,
                    priority: RealEstateAdMediaTypePriorities_1.default.primary,
                },
                data: { priority: RealEstateAdMediaTypePriorities_1.default.normal },
            });
        }
        const transformer = this.storefrontTransformer.transformFile(result);
        return {
            statusCode: 200,
            message: "فایل مورد نظر با موفقیت آپلود شد.",
            data: transformer,
        };
    }
    async removeFile(query) {
        query.client_id = this.request.client.id;
        const fileInfo = await this.storefrontPostgresRepository.getFileInfo(query.item_id);
        if (!fileInfo) {
            throw new common_1.BadRequestException(messages_1.BadRequestMessage.InvalidData);
        }
        if (query.type === delete_media_item_dto_1.RealEstateMediaItemTypes.file) {
            await this.storefrontPostgresRepository.removeMedia(Number(query.item_id));
            this.uploadService.removeFile(fileInfo.file_name, "marketplace/temp_file");
        }
        else {
            await this.storefrontPostgresRepository.deleteTempFile(Number(query.item_id));
            this.uploadService.removeFile(fileInfo.file_name, "marketplace/temp_file");
        }
        return {
            statusCode: 200,
            message: "فایل موردنظر با موفقیت حذف شد.",
        };
    }
    async changeCover(body) {
        body.client_id = this.request.client.id;
        const Info = await this.prismaService.storefrontProducts.findFirst({
            where: { id: body.product_id },
        });
        if (!Info) {
            throw new common_1.BadRequestException(messages_1.BadRequestMessage.InvalidData);
        }
        await this.prismaService.marketplaceMediaFiles.updateMany({
            where: { productId: body.product_id },
            data: { priority: RealEstateAdMediaTypePriorities_1.default.normal },
        });
        await this.prismaService.marketplaceMediaFiles.update({
            where: { id: Number(body.item_id) },
            data: { priority: RealEstateAdMediaTypePriorities_1.default.primary },
        });
        return {
            statusCode: 200,
            message: messages_1.PublicMessage.OkResponse,
        };
    }
    async getUserPermittedAds() {
        const result = await this.prismaService.adminUserRoleCategories.findMany({
            where: {
                key: "list_storefronts",
                assignedRoles: {
                    some: {
                        role: {
                            isNot: {
                                title: "سوپر ادمین",
                            },
                        },
                    },
                },
            },
            select: {
                assignedRoles: {
                    select: {
                        role: {
                            select: {
                                title: true,
                                userRoles: {
                                    select: {
                                        user: {
                                            select: {
                                                id: true,
                                                name: true,
                                                phone: true,
                                                email: true,
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
        let usersPermitted = [];
        result.map((item) => {
            item.assignedRoles.map((role) => {
                if (role.role.title !== "سوپر ادمین") {
                    role.role.userRoles.map((user) => {
                        usersPermitted = [...usersPermitted, user.user];
                    });
                }
            });
        });
        let emailList = [];
        usersPermitted.map((item) => {
            emailList = [...emailList, item.email];
        });
        return emailList;
    }
    async sendEmailForAdmins() {
        const usersPermitted = await this.getUserPermittedAds();
        await this.mailerService.sendBulk({
            body: "فروشگاه جدید در سیستم ثبت شده است. برای بررسی بیشتر به پنل مدیریت آقای ساختمان وارد شوید.",
            subject: "اطلاع رسانی - بررسی فروشگاه",
            to: usersPermitted,
        });
    }
    async findTopSales(query, page, per_page) {
        const list = await this.prismaService.storefrontProducts.findMany({
            where: {
                status: Statuses_1.default.active,
                storefront: {
                    province_id: Number(query.province_id),
                    city_id: Number(query.city_id),
                },
            },
            select: {
                id: true,
                category: { select: { id: true, title: true } },
                subCategory: { select: { id: true, title: true } },
                brand: { select: { id: true, title: true } },
                trackingCode: true,
                title: true,
                description: true,
                status: true,
                price: true,
                unitOfSales: true,
                hasDiscount: true,
                discountedPrice: true,
                colors: true,
                storefront: {
                    select: {
                        id: true,
                        name: true,
                        avatar_thumbnail: true,
                        avatar: true,
                        license: true,
                        phone: true,
                        province: { select: { id: true, name: true } },
                        city: { select: { id: true, name: true } },
                    },
                },
                updatedAt: true,
                files: {
                    where: {
                        file_type: RealEstateAdMediaType_1.default.image,
                        priority: RealEstateAdMediaTypePriorities_1.default.primary,
                    },
                    select: {
                        id: true,
                        file_name: true,
                        thumbnail: true,
                        file_type: true,
                        sort_number: true,
                        priority: true,
                    },
                },
            },
            orderBy: { numberOfSales: "desc" },
            skip: page,
            take: per_page,
        });
        return this.storefrontTransformer.collectionProduct(list);
    }
    async findTopStorefronts(query, page, per_page) {
        const list = await this.prismaService.storefront.findMany({
            where: {
                status: Statuses_1.default.active,
                province_id: Number(query.province_id),
                city_id: Number(query.city_id),
            },
            select: {
                id: true,
                trackingCode: true,
                name: true,
                color: true,
                description: true,
                avatar: true,
                avatar_thumbnail: true,
                status: true,
                score: true,
                client_id: true,
                products: {
                    where: { status: Statuses_1.default.active },
                    take: 4,
                    select: {
                        id: true,
                        files: {
                            where: {
                                file_type: UploaderFileTypes_1.default.image,
                                priority: RealEstateAdMediaTypePriorities_1.default.primary,
                            },
                            select: {
                                id: true,
                                file_name: true,
                                thumbnail: true,
                                file_type: true,
                                sort_number: true,
                                priority: true,
                            },
                            orderBy: { sort_number: "desc" },
                            take: 1,
                        },
                    },
                },
                province: { select: { id: true, name: true } },
                city: { select: { id: true, name: true } },
            },
            orderBy: [{ number_of_sales: "desc" }, { total_score: "desc" }],
            skip: page,
            take: per_page,
        });
        return this.storefrontTransformer.collectionTopStores(list);
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
    async getProducts(query) {
        let where = {
            status: Statuses_1.default.active,
            storefront: {
                province_id: +query.province_id,
            },
        };
        if (query.city_id) {
            where.storefront = Object.assign(Object.assign({}, where.sorefront), { city_id: +query.city_id });
        }
        console.log({ where });
        if (query.type === get_products_dto_1.GetProductMarketplaceTypes.category) {
            where.categoryId = query.item_id;
        }
        else if (query.type === get_products_dto_1.GetProductMarketplaceTypes.sub_category) {
            where.subCategoryId = query.item_id;
        }
        else if (query.type === get_products_dto_1.GetProductMarketplaceTypes.brand) {
            where.brandId = query.item_id;
        }
        if (query.action === get_product_dto_1.GetProductTypes.search) {
            where = Object.assign(Object.assign({}, where), { title: {
                    contains: query.keyword,
                    mode: "insensitive",
                } });
        }
        let orderBy = {};
        if (query.sort === SortingTypes_2.default.newest) {
            orderBy.id = "desc";
        }
        else if (query.sort === SortingTypes_2.default.oldest) {
            orderBy.id = "asc";
        }
        else if (query.sort === SortingTypes_2.default.most_expensive) {
            orderBy.price = "desc";
        }
        else if (query.sort === SortingTypes_2.default.cheapest) {
            orderBy.price = "asc";
        }
        else if (query.sort === SortingTypes_2.default.best_seller) {
            orderBy.numberOfSales = "desc";
        }
        const { page, per_page, skip } = (0, pagination_util_1.PaginationSolver)(query);
        const count = await this.prismaService.storefrontProducts.count({
            where,
        });
        const list = await this.prismaService.storefrontProducts.findMany({
            where,
            select: {
                id: true,
                category: { select: { id: true, title: true } },
                subCategory: { select: { id: true, title: true } },
                brand: { select: { id: true, title: true } },
                trackingCode: true,
                title: true,
                description: true,
                status: true,
                score: true,
                updatedAt: true,
                price: true,
                unitOfSales: true,
                hasDiscount: true,
                discountedPrice: true,
                colors: true,
                storefront: {
                    select: {
                        id: true,
                        name: true,
                        avatar_thumbnail: true,
                        avatar: true,
                        license: true,
                        phone: true,
                        province: { select: { id: true, name: true } },
                        city: { select: { id: true, name: true } },
                    },
                },
                files: {
                    where: {
                        file_type: RealEstateAdMediaType_1.default.image,
                        priority: RealEstateAdMediaTypePriorities_1.default.primary,
                    },
                    select: {
                        id: true,
                        file_name: true,
                        thumbnail: true,
                        file_type: true,
                        sort_number: true,
                        priority: true,
                    },
                },
            },
            orderBy,
            skip: page,
            take: per_page,
        });
        const transformer = this.storefrontTransformer.collectionProduct(list);
        return {
            products: transformer,
            metadata: (0, pagination_util_1.PaginationGenerator)(query.page, query.per_page, count),
        };
    }
    async filteredProducts(query) {
        let where = { status: Statuses_1.default.active };
        let orderBy = {};
        if (query.categoryId) {
            where.categoryId = query.categoryId;
        }
        if (query.subCategoryId) {
            where.subCategoryId = query.subCategoryId;
        }
        if (query.brandId) {
            where.brandId = query.brandId;
        }
        if (query.price) {
            where = Object.assign(Object.assign({}, where), { AND: [
                    {
                        price: {
                            gte: query.price.from || 0,
                            lte: query.price.to || 999999999999999,
                        },
                    },
                ] });
        }
        console.log({ where });
        if (query.sort === SortingTypes_2.default.newest) {
            orderBy.id = "desc";
        }
        else if (query.sort === SortingTypes_2.default.oldest) {
            orderBy.id = "asc";
        }
        else if (query.sort === SortingTypes_2.default.most_expensive) {
            orderBy.price = "desc";
        }
        else if (query.sort === SortingTypes_2.default.cheapest) {
            orderBy.price = "asc";
        }
        else if (query.sort === SortingTypes_2.default.best_seller) {
            orderBy.numberOfSales = "desc";
        }
        const { page, per_page, skip } = (0, pagination_util_1.PaginationSolver)(query);
        const count = await this.prismaService.storefrontProducts.count({
            where,
        });
        const list = await this.prismaService.storefrontProducts.findMany({
            where,
            select: {
                id: true,
                category: { select: { id: true, title: true } },
                subCategory: { select: { id: true, title: true } },
                brand: { select: { id: true, title: true } },
                trackingCode: true,
                title: true,
                description: true,
                status: true,
                score: true,
                updatedAt: true,
                price: true,
                unitOfSales: true,
                hasDiscount: true,
                discountedPrice: true,
                colors: true,
                storefront: {
                    select: {
                        id: true,
                        name: true,
                        avatar_thumbnail: true,
                        avatar: true,
                        license: true,
                        phone: true,
                        province: { select: { id: true, name: true } },
                        city: { select: { id: true, name: true } },
                    },
                },
                files: {
                    where: {
                        file_type: RealEstateAdMediaType_1.default.image,
                        priority: RealEstateAdMediaTypePriorities_1.default.primary,
                    },
                    select: {
                        id: true,
                        file_name: true,
                        thumbnail: true,
                        file_type: true,
                        sort_number: true,
                        priority: true,
                    },
                },
            },
            orderBy,
            skip: page,
            take: per_page,
        });
        const transformer = this.storefrontTransformer.collectionProduct(list);
        return {
            products: transformer,
            metadata: (0, pagination_util_1.PaginationGenerator)(query.page, query.per_page, count),
        };
    }
    async getProductDetails(product_id) {
        const product = await this.prismaService.storefrontProducts.findFirst({
            where: { id: product_id, status: Statuses_1.default.active },
            select: {
                id: true,
                category: { select: { id: true, title: true } },
                subCategory: { select: { id: true, title: true } },
                brand: { select: { id: true, title: true } },
                storefront: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                        avatar_thumbnail: true,
                        phone: true,
                        province: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                        city: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                        score: true,
                    },
                },
                trackingCode: true,
                title: true,
                description: true,
                status: true,
                score: true,
                price: true,
                unitOfSales: true,
                hasDiscount: true,
                discountedPrice: true,
                colors: true,
                files: {
                    select: {
                        id: true,
                        file_name: true,
                        thumbnail: true,
                        file_type: true,
                        sort_number: true,
                        priority: true,
                    },
                },
                features: {
                    orderBy: { feature: { sort_number: "asc" } },
                    select: {
                        id: true,
                        value: true,
                        feature: {
                            select: {
                                id: true,
                                field_name: true,
                            },
                        },
                    },
                },
            },
        });
        if (!product) {
            throw new common_1.BadRequestException(messages_1.NotFoundMessage.NotFoundData);
        }
        return this.storefrontTransformer.transformDetails(product);
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
StorefrontService = __decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.REQUEST }),
    __param(0, (0, common_1.Inject)(core_1.REQUEST)),
    __metadata("design:paramtypes", [Object, prisma_service_1.PrismaService,
        Transformer_1.default,
        StorefrontPostgresqlRepository_1.default,
        marketplace_categories_service_1.MarketplaceCategoriesService,
        marketplace_brands_service_1.MarketplaceBrandsService,
        client_service_1.ClientService,
        UploadService_1.default,
        mailerService_1.default,
        Transformer_2.default,
        Transformer_3.default,
        FcmNotificationService_1.default])
], StorefrontService);
exports.StorefrontService = StorefrontService;
//# sourceMappingURL=storefront.service.js.map