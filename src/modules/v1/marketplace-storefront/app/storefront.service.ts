import { BadRequestException, Inject, Injectable, Scope } from "@nestjs/common";
import { CreateStorefrontDto } from "./dto/create-storefront.dto";
import { ClientService } from "src/modules/v1/client/app/client.service";
import statuses from "src/commons/contracts/Statuses";
import {
  ListStorefrontDto,
  MarketplaceStorefrontSort,
} from "./dto/list-storefront.dto";
import IMetadata from "src/commons/contracts/IMetadata";
import IPagination from "src/commons/contracts/IPagination";
import StorefrontPostgresqlRepository from "../repositories/StorefrontPostgresqlRepository";
import { PrismaService } from "../../../../../prisma/prisma.service";
import UploadService from "src/modules/services/UploadService";
import { MarketplaceCategoriesService } from "../../marketplace-categories/marketplace-categories.service";
import { MarketplaceBrandsService } from "../../marketplace-brands/marketplace-brands.service";
import { UploadFileProductsDto } from "./dto/upload-file-products.dto";
import {
  DeleteRealEstateMediaItemDto,
  RealEstateMediaItemTypes,
} from "../../real-estate-ads/app/dto/delete-media-item.dto";
import RealEstateAdMediaTypePriorities from "src/commons/contracts/RealEstateAdMediaTypePriorities";
import { ChangeCoverMediaProductDto } from "./dto/change-cover-media-item.dto";
import { SaveProductDto } from "./dto/save-product.dto";
import RealEstateAdMediaType from "src/commons/contracts/RealEstateAdMediaType";
import { UpdateProductDto } from "./dto/update-product.dto";
import { GetProductDto, GetProductTypes } from "./dto/get-product.dto";
import sortingTypes from "src/commons/contracts/SortingTypes";
import SortingTypes from "src/commons/contracts/SortingTypes";
import { ChangeStatusProductDto } from "./dto/change-status-product.dto";
import MailerService from "src/modules/services/notifications/mailer/mailerService";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import StorefrontTransformer from "./Transformer";
import MarketplaceCategoriesTransformer from "../../marketplace-categories/Transformer";
import MarketplaceBrandsTransformer from "../../marketplace-brands/Transformer";
import StorefrontUnitSales from "./dto/StorefrontUnitSales";
import {
  BadRequestMessage,
  NotFoundMessage,
  PublicMessage,
} from "src/commons/enums/messages";
import uploaderFileTypes from "src/commons/contracts/UploaderFileTypes";
import {
  GetProductMarketplaceTypes,
  GetProductsInMarketplaceDto,
} from "../../marketplace/app/dto/get-products.dto";
import {
  PaginationGenerator,
  PaginationSolver,
} from "src/commons/utils/pagination.util";
import SharpPipe from "src/commons/pipes/SharpPipe";
import { MediaItemTypes } from "./dto/delete-media-item-products.dto";
import { FilterProductsDto } from "../../marketplace/app/dto/filter-products.dto";
import UploaderFileTypes from "src/commons/contracts/UploaderFileTypes";
import * as ffmpeg from "fluent-ffmpeg";
import FcmNotificationService from "src/modules/services/notifications/fcm/FcmNotificationService";
import { HttpStatusCode } from "axios";
import { MarketplaceHomePageDto } from "../../marketplace/app/dto/marketplace-home-page.dto";

@Injectable({ scope: Scope.REQUEST })
export class StorefrontService {
  constructor(
    @Inject(REQUEST) private readonly request: Request,
    private readonly prismaService: PrismaService,
    private readonly storefrontTransformer: StorefrontTransformer,
    private readonly storefrontPostgresRepository: StorefrontPostgresqlRepository,
    private readonly marketplaceCategoriesService: MarketplaceCategoriesService,
    private readonly marketplaceBrandsService: MarketplaceBrandsService,
    private readonly clientService: ClientService,
    private readonly uploadService: UploadService,
    private readonly mailerService: MailerService,
    private readonly marketplaceCategoriesTransformer: MarketplaceCategoriesTransformer,
    private readonly marketplaceBrandsTransformer: MarketplaceBrandsTransformer,
    private readonly notificationService: FcmNotificationService
  ) {}

  // SaveNewProduct

  async SaveNewProduct(body: SaveProductDto) {
    body.client_id = this.request.client.id;

    const storefrontInfo = await this.prismaService.storefront.findFirst({
      where: { client_id: body.client_id },
    });
    if (!storefrontInfo) {
      throw new BadRequestException(NotFoundMessage.NotFoundStorefront);
    }
    body.storefront_id = storefrontInfo.id;

    body.tracking_code = await this.generateTrackingCode("product_");
    const newItem = await this.storefrontPostgresRepository.saveProduct(body);

    // save items
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

    // save media
    if (body.media.length) {
      body.media.map(async (item) => {
        // get temp file info
        const fileInfo = await this.storefrontPostgresRepository.getFileInfo(
          item.id
        );
        const filename = fileInfo?.file_name.split("/").pop();

        // move file to destination
        const { path } = await this.uploadService.moveFile(
          filename,
          "/marketplace/temp_file/",
          `/marketplace/products/${newItem.id}/`
        );

        const { path: thumbnail } = await SharpPipe(
          filename,
          `/marketplace/products/${newItem.id}/`
        );

        item.file_name = path;

        // save file for ad
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

  async updateProduct(body: UpdateProductDto) {
    body.client_id = this.request.client.id;

    const details = await this.storefrontPostgresRepository.findProductById(
      body.product_id
    );
    if (!details) {
      throw new BadRequestException(NotFoundMessage.NotFoundStorefrontProduct);
    }

    // remove old items
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

    await this.storefrontPostgresRepository.updateProductById(
      { id: body.product_id },
      body
    );

    return {
      statusCode: 201,
      message: "ویرایش با موفقیت انجام شد.",
      data: { product_id: body.product_id },
    };
  }

  async findStorefrontProducts(body: GetProductDto) {
    body.client_id = this.request.client.id;

    const storefrontInfo = await this.prismaService.storefront.findFirst({
      where: { id: body.storefront_id },
    });
    if (!storefrontInfo) {
      throw new BadRequestException(NotFoundMessage.NotFoundStorefront);
    }

    let condition: any = { storefrontId: body.storefront_id };
    if (body.status !== statuses.all) {
      condition = {
        ...condition,
        status: body.status,
      };
    }
    if (body.type === GetProductTypes.search) {
      condition = {
        ...condition,
        title: {
          contains: body.keyword,
          mode: "insensitive",
        },
      };
    }

    const count = await this.storefrontPostgresRepository.countProduct(
      condition
    );

    const total = this.getTotalPageNumber(Number(count), Number(body.per_page));

    const paginationValue = this.makePagination(
      Number(body.page),
      Number(body.per_page)
    );

    let orderBy: any = { createdAt: "desc" };
    if (body.sort === sortingTypes.newest) {
      orderBy = { createdAt: "desc" };
    } else if (body.sort === sortingTypes.oldest) {
      orderBy = { createdAt: "asc" };
    } else if (body.sort === sortingTypes.most_expensive) {
      orderBy = { price: "desc" };
    } else if (body.sort === sortingTypes.cheapest) {
      orderBy = { price: "asc" };
    }

    console.log({ condition });
    console.log({ orderBy });

    const list = await this.storefrontPostgresRepository.findManyProducts({
      where: {
        ...condition,
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
        files: {
          where: {
            file_type: RealEstateAdMediaType.image,
            priority: RealEstateAdMediaTypePriorities.primary,
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
        metadata: PaginationGenerator(body.page, body.per_page, count),
      },
    };
  }

  async changeStatusProduct(body: ChangeStatusProductDto) {
    body.client_id = this.request.client.id;

    const storefrontInfo =
      await this.storefrontPostgresRepository.findProductById(body.product_id);
    if (!storefrontInfo) {
      throw new BadRequestException(NotFoundMessage.NotFoundStorefront);
    }

    await this.storefrontPostgresRepository.changeStatusProduct(
      {
        id: body.product_id,
      },
      { status: body.status }
    );

    return {
      statusCode: 200,
      message: "وضعیت با موفقیت ثبت شد.",
      data: {},
    };
  }

  async deleteProduct(product_id: string) {
    const storefrontInfo =
      await this.storefrontPostgresRepository.findProductById(product_id);
    if (!storefrontInfo) {
      throw new BadRequestException(NotFoundMessage.NotFoundStorefrontProduct);
    }

    await this.storefrontPostgresRepository.deleteProduct({
      id: product_id,
    });

    this.uploadService.removeDir(`/marketplace/products/${product_id}`);

    return {
      statusCode: 200,
      message: PublicMessage.Deleted,
      data: {},
    };
  }

  async addStorefrontIntoBookmark(storefront_id: string) {
    await this.storefrontPostgresRepository.bookmarkStorefront(
      storefront_id,
      this.request.client.id
    );
    return {
      statusCode: HttpStatusCode.Created,
      message: PublicMessage.Created,
      data: {},
    };
  }

  async getBookmarkedList() {
    const list = await this.storefrontPostgresRepository.getBookmarkList(
      this.request.client.id
    );
    const presentedStorefront = list.map((item: any) => item.storefront);
    const transform =
      this.storefrontTransformer.collection(presentedStorefront);
    return {
      statusCode: 200,
      message: PublicMessage.OkResponse,
      data: transform,
    };
  }

  async storeRequest(body: CreateStorefrontDto) {
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
        await this.moveFile(
          body.avatar,
          "temp/storefronts",
          `/storefronts/${result.id}/avatars/`
        );
        const { path } = await SharpPipe(
          body.avatar,
          `/storefronts/${result.id}/avatars/`
        );
        avatar_thumbnail = path;
      }
      if (body.license) {
        await this.moveFile(
          body.license,
          "temp/storefronts",
          `/storefronts/${result.id}/licenses/`
        );
      }

      result = await this.storefrontPostgresRepository.updateOne(
        { id: result.id },
        {
          avatar_thumbnail,
        }
      );

      // subscribe trackingCode in FCM
      const notificationTokens =
        await this.prismaService.clientNotificaionTokens.findMany({
          where: { client_id: body.user_id },
        });
      let tokens: string[] = [];
      notificationTokens.map((item) => tokens.push(item.notification_token));

      await this.notificationService.subscribeToTopic(tokens, trackingCode);
    } else {
      if (!body.avatar) {
        body.avatar = result.avatar;
      } else {
        await this.moveFile(
          body.avatar,
          "temp/storefronts",
          `/storefronts/${result.id}/avatars/`
        );

        const { path } = await SharpPipe(
          body.avatar,
          `/storefronts/${result.id}/avatars/`
        );
        avatar_thumbnail = path;
      }

      if (!body.license) {
        body.license = result.license;
      } else {
        await this.moveFile(
          body.license,
          "temp/storefronts",
          `/storefronts/${result.id}/licenses/`
        );
      }

      result = await this.storefrontPostgresRepository.updateOne(
        { id: result.id },
        {
          name: body.name,
          description: body.description,
          color: body.color,
          avatar: body.avatar,
          avatar_thumbnail,
          license: body.license,
          categoryId: body.categoryId,
          province_id: Number(body.province_id),
          city_id: Number(body.city_id),
        }
      );
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
      message:
        "درخواست شما با موفقیت ثبت شد. بعد تایید میتوانید از امکانات بخش موردنظر استفاده کنید.",
      data: transform,
    };
  }

  private async generateTrackingCode(name: string): Promise<string> {
    // const uniqueCode = randomBytes(6).toString("hex").toUpperCase();
    const uniqueCode =
      name + (Math.random() * (100000000 - 1000000) + 100000000).toFixed(0);
    const isCodeUnique = await this.storefrontPostgresRepository.findOne({
      trackingCode: uniqueCode,
    });

    if (isCodeUnique) {
      return this.generateTrackingCode(name);
    }

    return uniqueCode;
  }

  private async moveFile(
    filename: string,
    sourcePath: string,
    destPath: string
  ) {
    return await this.uploadService.moveFile(filename, sourcePath, destPath);
  }

  async listOfStorefronts(query: ListStorefrontDto) {
    const count = await this.storefrontPostgresRepository.count({
      status: statuses.active,
      // province_id: Number(query.province_id),
    });

    const total = this.getTotalPageNumber(
      Number(count),
      Number(query.per_page)
    );

    const paginationValue = this.makePagination(
      Number(query.page),
      Number(query.per_page)
    );

    let orderBy: any = {};
    if (query.sort == MarketplaceStorefrontSort.newest) {
      orderBy = {
        created_at: "desc",
      };
    } else if (query.sort == MarketplaceStorefrontSort.oldest) {
      orderBy = {
        created_at: "asc",
      };
    } else if (query.sort == MarketplaceStorefrontSort.best_selling) {
      orderBy = {
        number_of_sales: "desc",
      };
    } else if (query.sort == MarketplaceStorefrontSort.most_chosen) {
      orderBy = [
        {
          number_of_sales: "desc",
        },
        {
          total_score: "desc",
        },
      ];
    }

    let condition: any = {
      status: statuses.active,
      province_id: Number(query.province_id),
    };
    if (query.category_id) {
      condition = {
        ...condition,
        categoryId: query.category_id,
      };
    }
    if (query.city_id) {
      condition = {
        ...condition,
        city_id: query.city_id,
      };
    }

    if (query.keyword) {
      condition = {
        ...condition,
        name: {
          contains: query.keyword,
          mode: "insensitive",
        },
      };
    }

    console.log({ condition });
    console.log({ orderBy });

    const list = await this.prismaService.storefront.findMany({
      where: {
        ...condition,
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
          where: { status: statuses.active },
          take: 4,
          select: {
            id: true,
            files: {
              where: {
                file_type: uploaderFileTypes.image,
                priority: RealEstateAdMediaTypePriorities.primary,
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
        metadata: this.makeMetadata(
          Number(query.page),
          Number(query.per_page),
          Number(total)
        ),
      },
    };
  }

  async storefrontDetails(storeId: string) {
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

    const transformer = this.storefrontTransformer.transform(details) as any;
    const isBookmark =
      await this.storefrontPostgresRepository.getStorefrontIsBookmarked(
        this.request.client.id,
        storeId
      );
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
    const categories =
      await this.marketplaceCategoriesService.getCategoriesForApp();

    const categoriesTransformer =
      this.marketplaceCategoriesTransformer.collection(categories);

    const brands = await this.getBrands();
    const brandsTransformer =
      this.marketplaceBrandsTransformer.collection(brands);

    return {
      statusCode: 200,
      message: "نیازمندی ها در دسترس است.",
      data: {
        categories: categoriesTransformer,
        brands: brandsTransformer,
        units: StorefrontUnitSales,
      },
    };
  }

  async getBrands() {
    return await this.marketplaceBrandsService.getBrandsForApp();
  }

  async findOne(id: string) {
    try {
      return await this.storefrontPostgresRepository.findOne({
        id,
      });
    } catch (error) {
      return { status: 500 };
    }
  }

  async findByClientId(client_id: number) {
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

  async updateScore(where: any, data: any) {
    try {
      return await this.storefrontPostgresRepository.updateOne(where, data);
    } catch (error) {
      return { status: 500 };
    }
  }

  private async generateThumbnailForVideo(file: string, dir: string) {
    const path = this.uploadService.getPath();
    const filename = Date.now() + "-thumb.png";

    ffmpeg({ source: `${path}/${dir}/${file}` }).takeScreenshots(
      {
        count: 1,
        timemarks: [0],
        filename,
      },
      `${path}/${dir}/`
    );

    return `/${dir}/${filename}`;
  }

  private async generateThumbnailForImage(file: string, dir: string) {
    const { path } = await SharpPipe(file, `/${dir}/`);
    return { path };
  }

  async UploadFile(body: UploadFileProductsDto) {
    body.client_id = this.request.client.id;
    body.file = this.request.file.filename;

    console.log("*** UploadFile: Storefront Products ***");
    console.log({ body });

    let result;
    let source = "temp/products/files/";
    let destPath = "marketplace/temp_file/";
    if (body.product_id && body.type === MediaItemTypes.file) {
      destPath = `/marketplace/products/${body.product_id}/`;
      const { path } = await this.moveFile(body.file, source, destPath);

      if (body.file_type === UploaderFileTypes.video) {
        body.thumbnail = await this.generateThumbnailForVideo(
          body.file,
          destPath
        );
      } else {
        const { path } = await this.generateThumbnailForImage(
          body.file,
          destPath
        );
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
    } else {
      const { path } = await this.moveFile(body.file, source, destPath);

      if (body.file_type === UploaderFileTypes.video) {
        body.thumbnail = await this.generateThumbnailForVideo(
          body.file,
          destPath
        );
      } else {
        const { path } = await this.generateThumbnailForImage(
          body.file,
          destPath
        );
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

    if (body.priority === RealEstateAdMediaTypePriorities.primary) {
      await this.prismaService.marketplaceMediaFiles.updateMany({
        where: {
          productId: body.product_id,
          priority: RealEstateAdMediaTypePriorities.primary,
        },
        data: { priority: RealEstateAdMediaTypePriorities.normal },
      });
    }

    const transformer = this.storefrontTransformer.transformFile(result);

    return {
      statusCode: 200,
      message: "فایل مورد نظر با موفقیت آپلود شد.",
      data: transformer,
    };
  }

  async removeFile(query: DeleteRealEstateMediaItemDto) {
    query.client_id = this.request.client.id;

    const fileInfo = await this.storefrontPostgresRepository.getFileInfo(
      query.item_id
    );

    if (!fileInfo) {
      throw new BadRequestException(BadRequestMessage.InvalidData);
    }

    if (query.type === RealEstateMediaItemTypes.file) {
      // remove from DB
      await this.storefrontPostgresRepository.removeMedia(
        Number(query.item_id)
      );
      this.uploadService.removeFile(
        fileInfo.file_name,
        "marketplace/temp_file"
      );
    } else {
      // remove from DB
      await this.storefrontPostgresRepository.deleteTempFile(
        Number(query.item_id)
      );
      this.uploadService.removeFile(
        fileInfo.file_name,
        "marketplace/temp_file"
      );
    }

    return {
      statusCode: 200,
      message: "فایل موردنظر با موفقیت حذف شد.",
    };
  }

  async changeCover(body: ChangeCoverMediaProductDto) {
    body.client_id = this.request.client.id;

    const Info = await this.prismaService.storefrontProducts.findFirst({
      where: { id: body.product_id },
    });
    if (!Info) {
      throw new BadRequestException(BadRequestMessage.InvalidData);
    }

    await this.prismaService.marketplaceMediaFiles.updateMany({
      where: { productId: body.product_id },
      data: { priority: RealEstateAdMediaTypePriorities.normal },
    });

    await this.prismaService.marketplaceMediaFiles.update({
      where: { id: Number(body.item_id) },
      data: { priority: RealEstateAdMediaTypePriorities.primary },
    });

    return {
      statusCode: 200,
      message: PublicMessage.OkResponse,
    };
  }

  private async getUserPermittedAds() {
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

  public async sendEmailForAdmins() {
    // sent email for admin user permitted
    const usersPermitted = await this.getUserPermittedAds();
    await this.mailerService.sendBulk({
      body: "فروشگاه جدید در سیستم ثبت شده است. برای بررسی بیشتر به پنل مدیریت آقای ساختمان وارد شوید.",
      subject: "اطلاع رسانی - بررسی فروشگاه",
      to: usersPermitted,
    });
  }

  async findTopSales(
    query: MarketplaceHomePageDto,
    page: number,
    per_page: number
  ) {
    const list = await this.prismaService.storefrontProducts.findMany({
      where: {
        status: statuses.active,
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
            file_type: RealEstateAdMediaType.image,
            priority: RealEstateAdMediaTypePriorities.primary,
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

  async findTopStorefronts(
    query: MarketplaceHomePageDto,
    page: number,
    per_page: number
  ) {
    const list = await this.prismaService.storefront.findMany({
      where: {
        status: statuses.active,
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
          where: { status: statuses.active },
          take: 4,
          select: {
            id: true,
            files: {
              where: {
                file_type: uploaderFileTypes.image,
                priority: RealEstateAdMediaTypePriorities.primary,
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

  // make metadata
  private makeMetadata(
    page: number,
    per_page: number,
    total_page: number
  ): IMetadata {
    return {
      page,
      total_page,
      per_page: per_page,
      next: page < total_page,
      back: page > 1,
    };
  }

  async getProducts(query: GetProductsInMarketplaceDto) {
    let where: any = {
      status: statuses.active,
      storefront: {
        province_id: +query.province_id,
      },
    };

    if (query.city_id) {
      where.storefront = {
        ...where.sorefront,
        city_id: +query.city_id,
      };
    }

    console.log({ where });

    if (query.type === GetProductMarketplaceTypes.category) {
      where.categoryId = query.item_id;
    } else if (query.type === GetProductMarketplaceTypes.sub_category) {
      where.subCategoryId = query.item_id;
    } else if (query.type === GetProductMarketplaceTypes.brand) {
      where.brandId = query.item_id;
    }

    if (query.action === GetProductTypes.search) {
      where = {
        ...where,
        title: {
          contains: query.keyword,
          mode: "insensitive",
        },
      };
    }

    let orderBy: any = {};
    if (query.sort === SortingTypes.newest) {
      orderBy.id = "desc";
    } else if (query.sort === SortingTypes.oldest) {
      orderBy.id = "asc";
    } else if (query.sort === SortingTypes.most_expensive) {
      orderBy.price = "desc";
    } else if (query.sort === SortingTypes.cheapest) {
      orderBy.price = "asc";
    } else if (query.sort === SortingTypes.best_seller) {
      orderBy.numberOfSales = "desc";
    }

    const { page, per_page, skip } = PaginationSolver(query);
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
            file_type: RealEstateAdMediaType.image,
            priority: RealEstateAdMediaTypePriorities.primary,
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
      metadata: PaginationGenerator(query.page, query.per_page, count),
    };
  }

  async filteredProducts(query: FilterProductsDto) {
    let where: any = { status: statuses.active };
    let orderBy: any = {};

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
      where = {
        ...where,
        AND: [
          {
            price: {
              gte: query.price.from || 0,
              lte: query.price.to || 999999999999999,
            },
          },
        ],
      };
    }

    console.log({ where });

    if (query.sort === SortingTypes.newest) {
      orderBy.id = "desc";
    } else if (query.sort === SortingTypes.oldest) {
      orderBy.id = "asc";
    } else if (query.sort === SortingTypes.most_expensive) {
      orderBy.price = "desc";
    } else if (query.sort === SortingTypes.cheapest) {
      orderBy.price = "asc";
    } else if (query.sort === SortingTypes.best_seller) {
      orderBy.numberOfSales = "desc";
    }

    const { page, per_page, skip } = PaginationSolver(query);
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
            file_type: RealEstateAdMediaType.image,
            priority: RealEstateAdMediaTypePriorities.primary,
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
      metadata: PaginationGenerator(query.page, query.per_page, count),
    };
  }

  async getProductDetails(product_id: string) {
    const product = await this.prismaService.storefrontProducts.findFirst({
      where: { id: product_id, status: statuses.active },
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
      throw new BadRequestException(NotFoundMessage.NotFoundData);
    }

    return this.storefrontTransformer.transformDetails(product);
  }

  // make metadata
  private makePagination(page: number, per_page: number): IPagination {
    return {
      offset: (page - 1) * per_page,
      per_page,
    };
  }

  private getTotalPageNumber(total_number: number, per_page: number) {
    return Math.ceil(total_number / per_page);
  }
}
