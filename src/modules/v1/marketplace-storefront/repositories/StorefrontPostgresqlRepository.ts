import { Injectable } from "@nestjs/common";
import IPagination from "src/commons/contracts/IPagination";
import IStorefrontRepository from "./IStorefrontRepository";
import { PrismaService } from "../../../../../prisma/prisma.service";
import RealEstateAdMediaTypePriorities from "src/commons/contracts/RealEstateAdMediaTypePriorities";
import { UploadFileProductsDto } from "../app/dto/upload-file-products.dto";
import { SaveProductDto } from "../app/dto/save-product.dto";
import RealEstateAdMediaType from "src/commons/contracts/RealEstateAdMediaType";
import { StorefrontBookmark } from "@prisma/client";

@Injectable()
export default class StorefrontPostgresqlRepository
  implements IStorefrontRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async bookmarkStorefront(
    storefrontId: string,
    client_id: number
  ): Promise<any> {
    const isBookmark = await this.prisma.storefrontBookmark.findFirst({
      where: { client_id, storefrontId },
    });
    if (isBookmark) {
      await this.deleteBookmarked(isBookmark.id);
    } else {
      await this.prisma.storefrontBookmark.create({
        data: {
          client: { connect: { id: client_id } },
          storefront: { connect: { id: storefrontId } },
        },
      });
    }
  }

  async deleteBookmarked(bookmarkId: string): Promise<any> {
    await this.prisma.storefrontBookmark.delete({ where: { id: bookmarkId } });
  }

  async getBookmarkList(client_id: number): Promise<StorefrontBookmark[]> {
    return this.prisma.storefrontBookmark.findMany({
      where: { client_id },
      include: { storefront: true, client: true },
    });
  }

  async getStorefrontIsBookmarked(
    client_id: number,
    storefrontId: string
  ): Promise<StorefrontBookmark> {
    return this.prisma.storefrontBookmark.findFirst({
      where: { client_id, storefrontId },
    });
  }

  async saveProduct(params: SaveProductDto): Promise<any> {
    try {
      return await this.prisma.storefrontProducts.create({
        data: {
          category: { connect: { id: params.category_id } },
          subCategory: { connect: { id: params.sub_category_id } },
          brand: { connect: { id: params.brand_id } },
          storefront: { connect: { id: params.storefront_id } },
          trackingCode: params.tracking_code,
          title: params.title,
          description: params.description,
          unitOfSales: params.unit_of_sales,
          price: params.price,
          hasDiscount: params.has_discount,
          discountedPrice: params.discounted_price,
          colors: params.colors,
        },
        select: {
          id: true,
          category: { select: { id: true, title: true } },
          subCategory: { select: { id: true, title: true } },
          brand: { select: { id: true, title: true } },
          trackingCode: true,
          title: true,
          score: true,
          description: true,
          status: true,
          price: true,
          unitOfSales: true,
          hasDiscount: true,
          discountedPrice: true,
          colors: true,
          files: {
            where: {
              file_type: RealEstateAdMediaType.image,
              priority: RealEstateAdMediaTypePriorities.primary,
            },
            select: {
              id: true,
              file_name: true,
              file_type: true,
              sort_number: true,
              priority: true,
            },
          },
        },
      });
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async updateProductById(where: any, updateData: any): Promise<any> {
    try {
      return await this.prisma.storefrontProducts.update({
        where,
        data: {
          category: { connect: { id: updateData.category_id } },
          subCategory: { connect: { id: updateData.sub_category_id } },
          brand: { connect: { id: updateData.brand_id } },
          title: updateData.title,
          description: updateData.description,
          unitOfSales: updateData.unit_of_sales,
          price: updateData.price,
          hasDiscount: updateData.has_discount,
          discountedPrice: updateData.discounted_price,
          colors: updateData.colors,
          updatedAt: new Date(Date.now()),
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  async getMedia(ad_id: number): Promise<any[]> {
    return await this.prisma.realEstateAdvertisements.findMany({
      where: { ad_id },
    });
  }

  async findMedia(id: number): Promise<any> {
    return await this.prisma.marketplaceMediaFiles.findFirst({
      where: { id },
    });
  }

  async getFileInfo(file_id: number): Promise<any> {
    return this.prisma.marketplaceMediaFiles.findFirst({
      where: { id: Number(file_id) },
    });
  }

  async deleteTempFile(id: number): Promise<any> {
    return await this.prisma.marketplaceMediaFiles.delete({
      where: { id },
    });
  }

  async removeItems(productId: string): Promise<any> {
    return await this.prisma.marketplaceProductFeatureValues.deleteMany({
      where: { productId },
    });
  }

  async createItem(params: any): Promise<any> {
    try {
      return await this.prisma.marketplaceProductFeatureValues.create(params);
    } catch (error) {
      console.log("* Error in Save ProductItems: createItem *");
      console.log(error);
      return false;
    }
  }

  async updateMedia(where: any, data: any): Promise<any> {
    return await this.prisma.marketplaceMediaFiles.update({ where, data });
  }

  async changeStatus(where: any, data: any): Promise<any> {
    try {
      return await this.prisma.storefrontProducts.update({ where, data });
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async changeStatusProduct(where: any, data: any): Promise<any> {
    try {
      return await this.prisma.storefrontProducts.update({ where, data });
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async findNewItems(
    params: any,
    select: any,
    pagination?: IPagination
  ): Promise<any[] | []> {
    return await this.prisma.storefront.findMany({
      where: params,
      select,
      skip: pagination.offset,
      take: pagination.per_page,
    });
  }

  async count(params: any): Promise<number> {
    return await this.prisma.storefront.count({ where: params });
  }

  async countProduct(params: any): Promise<number> {
    return await this.prisma.storefrontProducts.count({ where: params });
  }

  async findByStatus(status: string): Promise<any[] | []> {
    return await this.prisma.storefront.findMany({ where: { status } });
  }

  async create(params: any): Promise<any> {
    try {
      return await this.prisma.storefront.create({
        data: params,
      });
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async findOne(params: any): Promise<any> {
    return await this.prisma.storefront.findFirst({ where: params });
  }

  async removeMedia(item_id: number): Promise<any> {
    return await this.prisma.marketplaceMediaFiles.delete({
      where: { id: item_id },
    });
  }

  async findOneByID(id: string): Promise<any> {
    return await this.prisma.storefront.findUnique({ where: { id } });
  }

  async findProductById(id: string): Promise<any> {
    return await this.prisma.storefrontProducts.findUnique({ where: { id } });
  }

  async findMany(
    params: any,
    relations?: string[],
    pagination?: IPagination
  ): Promise<any[]> {
    return await this.prisma.storefront.findMany({
      where: params,
      skip: pagination.offset,
      take: pagination.per_page,
    });
  }

  async findManyProducts(params: any): Promise<any[]> {
    return await this.prisma.storefrontProducts.findMany({
      where: params.where,
      select: params.select,
      orderBy: params.orderBy,
      skip: params.offset,
      take: params.per_page,
    });
  }

  async updateOne(where: any, updateData: any): Promise<any> {
    try {
      return await this.prisma.storefront.update({
        where,
        data: updateData,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async updateMany(
    where: Partial<any>,
    updateData: Partial<any>
  ): Promise<any> {
    return await this.prisma.storefront.updateMany({
      where,
      data: updateData,
    });
  }

  async deleteOne(where: any): Promise<any> {
    return await this.prisma.storefront.delete({ where });
  }

  async deleteMany(where: any): Promise<any> {
    return await this.prisma.storefront.deleteMany({ where });
  }

  async deleteProduct(where: any): Promise<any> {
    await this.removeItems(where.id);
    await this.prisma.marketplaceMediaFiles.deleteMany({
      where: { productId: where.id },
    });
    return await this.prisma.storefrontProducts.delete({ where });
  }

  async createFile(body: UploadFileProductsDto): Promise<any> {
    try {
      if (body.type === "temp") {
        return await this.prisma.marketplaceMediaFiles.create({
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
        await this.prisma.marketplaceMediaFiles.updateMany({
          where: {
            productId: body.product_id,
            priority: RealEstateAdMediaTypePriorities.primary,
          },
          data: { priority: RealEstateAdMediaTypePriorities.normal },
        });
      }

      return await this.prisma.marketplaceMediaFiles.create({
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
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
