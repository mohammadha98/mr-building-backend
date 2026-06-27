import { Inject, Injectable, NotFoundException, Scope } from "@nestjs/common";
import { PrismaService } from "../../../../../prisma/prisma.service";
import { CreateMyCityDto, UploadFileMyCityDto } from "./dto/create-my-city.dto";
import { MyCityModel } from "@prisma/client";
import { MayNearDto } from "./dto/find-my-near.dto";
import { UpdateMyCityDto } from "./dto/update-my-city.dto";
import { UpdateLocationInMyCity } from "./dto/update-location-my-city.dto";
import {
  NotFoundMessage,
  PublicMessage,
} from "src/commons/enums/messages";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import UploaderFileTypes from "src/commons/contracts/UploaderFileTypes";
import * as ffmpeg from "fluent-ffmpeg";
import SharpPipe from "src/commons/pipes/SharpPipe";
import UploadService from "src/modules/services/UploadService";
import { MyCityFilePriorities } from "./enums/myCity.files.enum";
import MyCityTransformer from "./Transformer";
import { HttpStatusCode } from "axios";
import statuses from "src/commons/contracts/Statuses";
import { MyCityCategoriesEnum } from "./enums/myCity.category.enum";
import {
  PaginationGenerator,
  PaginationSolver,
} from "src/commons/utils/pagination.util";
import { PaginationDto } from "src/commons/dto/pagination.dto";

@Injectable({ scope: Scope.REQUEST })
export class MyCityService {
  constructor(
    @Inject(REQUEST) private request: Request,
    private readonly prismaService: PrismaService,
    private readonly uploadService: UploadService,
    private readonly myCityTransformer: MyCityTransformer
  ) {}

  async UploadFile(body: UploadFileMyCityDto) {
    let dirname = "";
    let thumbnail = "";
    let result;

    if (body.type === "temp") {
      dirname = "temp/mycity/";

      if (body.file_type === UploaderFileTypes.video) {
        thumbnail = await this.generateThumbnailForVideo(body.file, dirname);
      } else {
        console.log({ dirname });
        const { path } = await this.generateThumbnailForImage(
          body.file,
          dirname
        );
        thumbnail = path;
      }

      // MakeWatermark(body.file, dirname);

      result = await this.prismaService.myCityMedia.create({
        data: {
          file_name: body.file,
          file_type: body.file_type,
          thumbnail,
          tag: body.tag,
        },
      });
    } else {
      const source = `/temp/mycity/`;
      dirname = `/mycity/${body.id}/`;

      if (body.file_type === UploaderFileTypes.video) {
        thumbnail = await this.generateThumbnailForVideo(body.file, source);
      } else {
        const { path } = await this.generateThumbnailForImage(
          body.file,
          source
        );
        thumbnail = path;
      }
      const { path: file_name } = await this.uploadService.moveFile(
        body.file,
        "temp/mycity/",
        dirname
      );
      const path = await this.uploadService.moveFile(
        thumbnail.split("/").pop(),
        "temp/mycity/",
        dirname
      );
      thumbnail = path.path;

      if (body.priority === MyCityFilePriorities.primary) {
        await this.prismaService.myCityMedia.updateMany({
          where: { priority: MyCityFilePriorities.primary },
          data: { priority: MyCityFilePriorities.normal },
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

      // MakeWatermark(body.file, dirname);
    }

    const transformer = this.myCityTransformer.transformFile(result);

    return {
      statusCode: HttpStatusCode.Ok,
      message: PublicMessage.OkResponse,
      data: transformer,
    };
  }

  async create(createGeolocationDto: CreateMyCityDto) {
    const {
      category,
      title,
      description,
      size,
      year_built,
      number_of_rooms,
      renovation_tax,
      latitude,
      longitude,
      province_id,
      city_id,
      files,
    } = createGeolocationDto;

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
      files.map(async (item: any) => {
        const { path: file_name } = await this.uploadService.moveFile(
          item.file_name,
          "temp/mycity/",
          `/mycity/${result.id}/`
        );
        const { path: thumbnail } = await this.uploadService.moveFile(
          item.thumbnail.split("/").pop(),
          "temp/mycity/",
          `/mycity/${result.id}/`
        );

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
      statusCode: HttpStatusCode.Created,
      message: PublicMessage.Created,
    };
  }

  async findAll(query: any) {
    const { keyword, category, city_id, province_id } = query;

    const where: any = {
      status: statuses.active,
      city_id: +city_id,
      province_id: +province_id,
    };

    if (keyword) {
      where.title = {
        contains: query.keyword,
        mode: "insensitive",
      };
    }
    if (category !== MyCityCategoriesEnum.all) {
      where.category = category;
    }

    const count = await this.prismaService.myCityModel.count({
      where,
    });
    const { skip, page, per_page } = PaginationSolver(query);

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
    const { id: clientId } = this.request.client;

    const location = await this.getDetails(id, clientId);
    const tramsformer = this.myCityTransformer.localtionDetails(location);

    return {
      statusCode: HttpStatusCode.Ok,
      message: PublicMessage.OkResponse,
      data: tramsformer,
    };
  }

  async findNearLocations(mayNearDto: MayNearDto) {
    console.log("findNear");
    console.log({ mayNearDto });
    const { distanceInMeters, latitude, longitude } = mayNearDto;

    let category = ` `;
    if (mayNearDto.category !== MyCityCategoriesEnum.all) {
      category = ` AND category = '${mayNearDto.category}' `;
    }

    // const nearbyLocations = await this.prismaService.$queryRaw`
    //   SELECT * FROM "MyCityModel"
    //   WHERE status = 'active' AND ST_DWithin(ST_MakePoint(longitude, latitude)::geography, ST_MakePoint( ${Number(longitude)},${Number(latitude)})::geography, ${Number(distanceInMeters)});
    //   -- WHERE ST_DWithin(ST_MakePoint(longitude, latitude)::geography, ST_MakePoint(${Number(latitude)}, ${Number(longitude)})::geography, ${Number(distanceInMeters)});
    // `;

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

    const tramsformer = this.myCityTransformer.collection(
      nearbyLocations as any
    );

    return {
      statusCode: HttpStatusCode.Ok,
      message: PublicMessage.OkResponse,
      data: tramsformer,
    };
  }

  async myLocations(query: PaginationDto) {
    const { id: clientId } = this.request.client;

    const count = await this.prismaService.myCityModel.count({
      where: { clientId },
    });
    const { skip, page, per_page } = PaginationSolver(query);

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
      statusCode: HttpStatusCode.Ok,
      message: PublicMessage.OkResponse,
      data: {
        data: tramsformer,
        metadata: PaginationGenerator(query.page, per_page, count),
      },
    };
  }

  async findOne(id: string): Promise<MyCityModel> {
    const location = await this.prismaService.myCityModel.findFirst({
      where: { id, status: statuses.active },
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

  async getDetails(id: string, client_id: number): Promise<MyCityModel> {
    const location = await this.prismaService.myCityModel.findFirst({
      where: { id, status: statuses.active },
      include: {
        media: true,
        province: true,
        city: true,
        bookmarks: { where: { client_id }, take: 1 },
      },
    });
    if (!location) {
      throw new NotFoundException(NotFoundMessage.NotFoundLocation);
    }

    return location;
  }

  async update(id: string, updateGeolocationDto: UpdateMyCityDto) {
    const {
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
      province_id,
      city_id,
    } = updateGeolocationDto;
    const location = (await this.findOne(id)) as MyCityModel;

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

  async updateLocationInMyCity(id: string, body: UpdateLocationInMyCity) {
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
      statusCode: HttpStatusCode.Ok,
      message: PublicMessage.OkResponse,
    };
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

  async removeFile(id: string) {
    const file = await this.prismaService.myCityMedia.findFirst({
      where: { id },
    });
    if (!file) {
      throw new NotFoundException(NotFoundMessage.NotFoundFile);
    }

    await this.uploadService.removeFile(file.file_name, "mycity");

    await this.prismaService.myCityMedia.delete({
      where: { id },
    });

    return {
      statusCode: HttpStatusCode.Ok,
      message: PublicMessage.Deleted,
    };
  }

  async changePriorityFile(id: string) {
    const file = await this.prismaService.myCityMedia.findFirst({
      where: { id },
    });
    if (!file) {
      throw new NotFoundException(NotFoundMessage.NotFoundFile);
    }

    await this.prismaService.myCityMedia.updateMany({
      where: { myCityId: file.myCityId },
      data: { priority: MyCityFilePriorities.normal },
    });

    await this.prismaService.myCityMedia.updateMany({
      where: { id },
      data: { priority: MyCityFilePriorities.primary },
    });

    return {
      statusCode: HttpStatusCode.Ok,
      message: PublicMessage.OkResponse,
    };
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
}
