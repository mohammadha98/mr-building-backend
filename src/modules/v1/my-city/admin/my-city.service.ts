import { Inject, Injectable, NotFoundException, Scope } from "@nestjs/common";
import { PrismaService } from "../../../../../prisma/prisma.service";
import { MyCityModel } from "@prisma/client";
import {
  NotFoundMessage,
  PublicMessage,
} from "src/commons/enums/messages";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import UploadService from "src/modules/services/UploadService";
import MyCityTransformer from "./Transformer";
import { HttpStatusCode } from "axios";
import { MyCityCategoriesEnum } from "./enums/myCity.category.enum";
import {
  PaginationGenerator,
  PaginationSolver,
} from "src/commons/utils/pagination.util";

@Injectable({ scope: Scope.REQUEST })
export class MyCityService {
  constructor(
    @Inject(REQUEST) private request: Request,
    private readonly prismaService: PrismaService,
    private readonly uploadService: UploadService,
    private readonly myCityTransformer: MyCityTransformer
  ) {}

  async findAll(query: any) {
    const { keyword, category, city_id, province_id, status } = query;

    const where: any = {};
    if (keyword) {
      where.title = {
        contains: query.keyword,
        mode: "insensitive",
      };
    }
    if (category !== MyCityCategoriesEnum.all) {
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
    const { skip, page, per_page } = PaginationSolver(query);

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
      statusCode: HttpStatusCode.Ok,
      message: PublicMessage.OkResponse,
      data: {
        data: tramsformer,
        metadata: PaginationGenerator(query.page, per_page, count),
      },
    };
  }

  async locationDetails(id: string) {
    console.log("locationDetails");

    const location = await this.getDetails(id);
    const tramsformer = this.myCityTransformer.localtionDetails(location);

    return {
      statusCode: HttpStatusCode.Ok,
      message: PublicMessage.OkResponse,
      data: tramsformer,
    };
  }

  async findOne(id: string): Promise<MyCityModel> {
    const location = await this.prismaService.myCityModel.findFirst({
      where: { id },

      include: {
        media: true,
        province: true,
        city: true,
      },
    });
    if (!location) {
      throw new NotFoundException(NotFoundMessage.NotFoundLocation);
    }

    return location;
  }

  async getDetails(id: string): Promise<MyCityModel> {
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
      throw new NotFoundException(NotFoundMessage.NotFoundLocation);
    }

    return location;
  }

  async remove(id: string) {
    const location = (await this.findOne(id)) as MyCityModel;

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
      statusCode: HttpStatusCode.Ok,
      message: PublicMessage.Deleted,
    };
  }

  async changeStatus(id: string, status: string) {
    await this.findOne(id);

    await this.prismaService.myCityModel.update({
      where: { id },
      data: { status },
    });

    return {
      statusCode: HttpStatusCode.Ok,
      message: PublicMessage.OkResponse,
    };
  }
}
