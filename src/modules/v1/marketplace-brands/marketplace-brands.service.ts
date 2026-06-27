import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateMarketplaceBrandsDto } from "./dto/create-marketplace-brands.dto";
import { PaginationDto } from "src/commons/contracts/Pagination.dto";
import statuses from "src/commons/contracts/Statuses";
import { PrismaService } from "../../../../prisma/prisma.service";
import IMetadata from "src/commons/contracts/IMetadata";
import IPagination from "src/commons/contracts/IPagination";
import UploadService from "src/modules/services/UploadService";
import MarketplaceBrandsTransformer from "./Transformer";
import {
  PaginationGenerator,
  PaginationSolver,
} from "src/commons/utils/pagination.util";
import { PaginationDto as Pagination } from "src/commons/dto/pagination.dto";

@Injectable()
export class MarketplaceBrandsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly uploadService: UploadService,
    private readonly bandsTransformer: MarketplaceBrandsTransformer
  ) {}

  async saveBrand(body: CreateMarketplaceBrandsDto) {
    try {
      if (body.item_id) {
        const result = await this.prismaService.marketPlaceBrands.findFirst({
          where: { id: body.item_id },
        });

        if (!body.thumbnail) {
          body.thumbnail = result.thumbnail;
        }

        await this.prismaService.marketPlaceBrands.update({
          where: { id: body.item_id },
          data: {
            title: body.title,
            secondTitle: body.second_title,
            description: body.description,
            thumbnail: body.thumbnail,
            color: body.color,
            userID: body.user_id,
          },
        });
      } else {
        await this.prismaService.marketPlaceBrands.create({
          data: {
            title: body.title,
            secondTitle: body.second_title,
            description: body.description,
            thumbnail: body.thumbnail,
            color: body.color,
            userID: body.user_id,
          },
        });
      }

      return {
        status: 201,
      };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  public async getBrands(body: PaginationDto) {
    try {
      let where = {};
      if (body.status === statuses.all) {
        where = {};
      } else {
        where = { status: body.status };
      }

      const count = await this.prismaService.marketPlaceBrands.count({
        where: { ...where },
      });
      const total = this.getTotalPageNumber(
        Number(count),
        Number(body.per_page)
      );

      const paginationValue = this.makePagination(
        Number(body.page),
        Number(body.per_page)
      );

      const result = await this.prismaService.marketPlaceBrands.findMany({
        where: {
          ...where,
        },
        select: {
          id: true,
          title: true,
          secondTitle: true,
          description: true,
          thumbnail: true,
          color: true,
          score: true,
          total_score: true,
          status: true,
        },
        orderBy: { id: "desc" },
        skip: paginationValue.offset,
        take: paginationValue.per_page,
      });

      return {
        status: 200,
        result,
        metadata: this.makeMetadata(
          Number(body.page),
          Number(body.per_page),
          Number(total)
        ),
      };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  public async findActives(pagination: Pagination, params: any, orderBy: any) {
    const { page, per_page, skip } = PaginationSolver(pagination);

    const count = await this.prismaService.marketPlaceBrands.count({
      where: {
        ...params,
      },
    });

    const result = await this.prismaService.marketPlaceBrands.findMany({
      where: {
        ...params,
      },
      select: {
        id: true,
        title: true,
        secondTitle: true,
        description: true,
        thumbnail: true,
        status: true,
        color: true,
        score: true,
        total_score: true,
      },
      orderBy,
      skip,
      take: per_page,
    });

    const transformer = this.bandsTransformer.collection(result);

    return {
      brands: transformer,
      metadata: PaginationGenerator(page, per_page, count),
    };
  }

  public async getDetails(brandId: string) {
    const result = await this.prismaService.marketPlaceBrands.findFirst({
      where: {
        id: brandId,
      },
      select: {
        id: true,
        title: true,
        secondTitle: true,
        description: true,
        thumbnail: true,
        color: true,
        score: true,
        total_score: true,
        status: true,
      },
    });

    if (!result) {
      throw new BadRequestException();
    }

    return this.bandsTransformer.transform(result);
  }

  public async deleteBrand(item_id: string) {
    try {
      const result = await this.prismaService.marketPlaceBrands.findFirst({
        where: {
          id: item_id,
        },
      });
      if (!result) {
        return { status: 400 };
      }

      await this.prismaService.marketPlaceBrands.delete({
        where: { id: item_id },
      });

      // remove thumbnail
      this.uploadService.removeFile(result.thumbnail, "marketplace/brands/");

      return {
        status: 200,
        result,
      };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  public async getBrandsForApp() {
    return await this.prismaService.marketPlaceBrands.findMany({
      select: {
        id: true,
        title: true,
        thumbnail: true,
        color: true,
        score: true,
        total_score: true,
      },
      orderBy: { id: "desc" },
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
      back: page > 1,
    };
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
