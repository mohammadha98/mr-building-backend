import { Injectable } from "@nestjs/common";
import { CreateServiceMediaDto } from "./dto/create-service-media-module.dto";
import { PrismaService } from "../../../../../prisma/prisma.service";
import UploadService from "src/modules/services/UploadService";
import { GetServicesMediaDto } from "./dto/get-service-media-module.dto";
import { CreateServiceDto } from "./dto/create-service.dto";

@Injectable()
export class ServiceModulesService {
  private readonly uploadService: UploadService;
  constructor(private readonly prismaService: PrismaService) {
    this.uploadService = new UploadService();
  }
  public async saveServiceInfo(body: CreateServiceDto) {
    try {
      let result;

      const isExistService = await this.prismaService.services.findFirst({
        where: {
          type: body.type,
        },
        select: {
          id: true,
          type: true,
          description: true,
        },
      });
      if (!isExistService) {
        result = await this.prismaService.services.create({
          data: {
            type: body.type,
            description: body.description,
          },
          select: {
            id: true,
            type: true,
            description: true,
          },
        });
      } else {
        result = await this.prismaService.services.update({
          where: {
            id: isExistService.id,
          },
          data: {
            description: body.description,
          },
          select: {
            id: true,
            type: true,
            description: true,
          },
        });
      }

      return { status: 201, result };
    } catch (error) {
      console.log(error);

      return { status: 500 };
    }
  }

  public async create(body: CreateServiceMediaDto) {
    try {
      const result = await this.prismaService.servicesMedia.create({
        data: {
          type: body.type,
          fileType: body.file_type,
          file: body.file,
          creatorID: body.user_id,
        },
        select: {
          id: true,
          type: true,

          fileType: true,
          file: true,
        },
      });
      if (result) {
        this.uploadService.moveFile(
          body.file,
          "temp/services",
          `services/${body.type}/`
        );
      }
      return { status: 201, result };
    } catch (error) {
      console.log(error);

      return { status: 500 };
    }
  }

  async findAll(query: GetServicesMediaDto) {
    try {
      const info = await this.prismaService.services.findFirst({
        where: {
          type: query.type,
        },
        select: {
          id: true,
          description: true,
        },
      });
      if (!info) {
        return { status: 400 };
      }

      const media = await this.prismaService.servicesMedia.findMany({
        where: {
          type: query.type,
        },
        select: {
          id: true,
          type: true,
          fileType: true,
          file: true,
        },
      });

      return { status: 201, service: { info, media } };
    } catch (error) {
      console.log(error);

      return { status: 500 };
    }
  }

  async remove(id: string) {
    try {
      const result = await this.prismaService.servicesMedia.findFirst({
        where: {
          id,
        },
      });
      if (!result) {
        return { status: 400 };
      }

      this.uploadService.removeFile(result.file, `services/${result.type}/`);
      await this.prismaService.servicesMedia.delete({
        where: {
          id,
        },
      });
      return { status: 201, result };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }
}
