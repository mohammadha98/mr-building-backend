import { Injectable } from "@nestjs/common";
import { CreateMarketplaceCategoryDto } from "./dto/create-marketplace-category.dto";
import { PaginationDto } from "src/commons/contracts/Pagination.dto";
import statuses from "src/commons/contracts/Statuses";
import { PrismaService } from "src/../prisma/prisma.service";
import IMetadata from "src/commons/contracts/IMetadata";
import IPagination from "src/commons/contracts/IPagination";
import UploadService from "src/modules/services/UploadService";
import { UpdateMarketplaceSubCategoryDto } from "./dto/update-sub-category-dto";
import {
  PaginationGenerator,
  PaginationSolver
} from "src/commons/utils/pagination.util";
import MarketplaceCategoriesTransformer from "./Transformer";
import { PaginationDto as Pagination } from "src/commons/dto/pagination.dto";

@Injectable()
export class MarketplaceCategoriesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly uploadService: UploadService,
    private readonly categoriesTransformer: MarketplaceCategoriesTransformer
  ) {
  }

  async saveCategory(body: CreateMarketplaceCategoryDto) {
    try {
      let result;
      if (body.item_id) {
        result = await this.prismaService.marketPlaceMainCategory.findFirst({
          where: { id: body.item_id }
        });

        if (!body.thumbnail) {
          body.thumbnail = result.thumbnail;
        }

        await this.prismaService.marketPlaceMainCategory.update({
          where: { id: body.item_id },
          data: {
            title: body.title,
            thumbnail: body.thumbnail,
            userID: body.user_id
          }
        });
      } else {
        result = await this.prismaService.marketPlaceMainCategory.create({
          data: {
            title: body.title,
            thumbnail: body.thumbnail ? body.thumbnail : "",
            userID: body.user_id
          }
        });
      }

      console.log('body.items');
      console.log(body.items);
      if (body.items.length) {
        await body.items.map(async (item: any) => {
          console.log({ item });
          let data : any = {
            title: item.title,
            categoryId: result.id
          };

          if (item.form_id) {
            data.formId = item.form_id
          }

          await this.prismaService.marketPlaceSubCategory.create({
            data
          });
        });
      }

      return {
        status: 201
      };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  public async getCategories(body: PaginationDto) {
    try {
      let where = {};
      if (body.status === statuses.all) {
        where = {};
      } else {
        where = { status: body.status };
      }

      const count = await this.prismaService.marketPlaceMainCategory.count({
        where: { ...where }
      });
      const total = this.getTotalPageNumber(
        Number(count),
        Number(body.per_page)
      );

      const paginationValue = this.makePagination(
        Number(body.page),
        Number(body.per_page)
      );

      const result = await this.prismaService.marketPlaceMainCategory.findMany({
        where: {
          ...where
        },
        select: {
          id: true,
          title: true,
          thumbnail: true,
          items: {
            select: {
              id: true,
              title: true,
              form: { select: { items: true } }
            }
          }
        },
        orderBy: { id: "desc" },
        skip: paginationValue.offset,
        take: paginationValue.per_page
      });

      return {
        status: 200,
        result,
        metadata: this.makeMetadata(
          Number(body.page),
          Number(body.per_page),
          Number(total)
        )
      };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  public async findActives(pagination: Pagination, params: any) {
    const { page, per_page, skip } = PaginationSolver(pagination);
    const count = await this.prismaService.marketPlaceMainCategory.count({
      where: {
        ...params
      }
    });

    const result = await this.prismaService.marketPlaceMainCategory.findMany({
      where: {
        ...params
      },
      select: {
        id: true,
        title: true,
        thumbnail: true,

        items: {
          select: {
            id: true,
            title: true
          }
        }
      },
      orderBy: { number_of_sales: "desc" },
      skip,
      take: per_page
    });
    const transformer = this.categoriesTransformer.collection(result);

    return {
      categories: transformer,
      metadata: PaginationGenerator(page, per_page, count)
    };
  }

  public async deleteMainCategory(item_id: string) {
    try {
      const result = await this.prismaService.marketPlaceMainCategory.findFirst(
        {
          where: {
            id: item_id
          }
        }
      );
      if (!result) {
        return { status: 400 };
      }

      await this.prismaService.marketPlaceSubCategory.deleteMany({
        where: { categoryId: item_id }
      });
      await this.prismaService.marketPlaceMainCategory.delete({
        where: { id: item_id }
      });

      // remove thumbnail
      this.uploadService.removeFile(
        result.thumbnail,
        "marketplace/categories/"
      );

      return {
        status: 200,
        result
      };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  public async deleteSubCategory(item_id: string) {
    try {
      const result = await this.prismaService.marketPlaceSubCategory.findFirst({
        where: {
          id: item_id
        }
      });
      if (!result) {
        return { status: 400 };
      }

      await this.prismaService.marketPlaceSubCategory.delete({
        where: { id: item_id }
      });

      return {
        status: 200,
        result
      };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  public async updateSubCategory(body: UpdateMarketplaceSubCategoryDto) {
    try {
      const result = await this.prismaService.marketPlaceSubCategory.findFirst({
        where: {
          id: body.item_id
        }
      });
      if (!result) {
        return { status: 400 };
      }

      await this.prismaService.marketPlaceSubCategory.update({
        where: { id: body.item_id },
        data: { title: body.title, formId: body.form_id }
      });

      return {
        status: 200,
        result
      };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  public async getCategoriesForApp() {
    return await this.prismaService.marketPlaceMainCategory.findMany({
      where: { status: statuses.active },
      select: {
        id: true,
        title: true,
        thumbnail: true,
        items: {
          select: {
            id: true,
            title: true,
            form: { select: { id: true, title: true, items: true } }
          }
        }
      },
      orderBy: { id: "desc" }
    });
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
      back: page > 1
    };
  }

  // make metadata
  private makePagination(page: number, per_page: number): IPagination {
    return {
      offset: (page - 1) * per_page,
      per_page
    };
  }

  private getTotalPageNumber(total_number: number, per_page: number) {
    return Math.ceil(total_number / per_page);
  }
}
