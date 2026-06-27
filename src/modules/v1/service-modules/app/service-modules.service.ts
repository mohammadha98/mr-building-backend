import { Injectable } from "@nestjs/common";
import { CreateServiceMediaDto } from "./dto/create-service-media-module.dto";
import { PrismaService } from "../../../../../prisma/prisma.service";
import UploadService from "src/modules/services/UploadService";
import { GetServicesMediaDto } from "./dto/get-service-media-module.dto";
import { SaveCommentInServicesDto } from "./dto/save-comment.dto";
import { GetCommentsDto } from "./dto/get-comments.dto";
import IMetadata from "src/commons/contracts/IMetadata";
import IPagination from "src/commons/contracts/IPagination";
import statuses from "src/commons/contracts/Statuses";

@Injectable()
export class ServiceModulesService {
  private readonly uploadService: UploadService;

  constructor(private readonly prismaService: PrismaService) {
    this.uploadService = new UploadService();
  }

  public async saveServiceInfo(body: SaveCommentInServicesDto) {
    try {
      const isExistService = await this.prismaService.services.findFirst({
        where: {
          id: body.service_id,
        },
      });
      if (!isExistService) {
        return { status: 400 };
      }

      if (body.reply_to_id.length > 0) {
        const checkValidReplyID =
          await this.prismaService.servicesComments.findFirst({
            where: {
              id: body.reply_to_id,
            },
          });
        if (!checkValidReplyID) {
          return { status: 400 };
        }
      }

      const result = await this.prismaService.servicesComments.create({
        data: {
          client: { connect: { id: body.user_id } },
          is_replied: body.reply_to_id.length > 0 ? true : false,
          content: body.content,
          status: statuses.approved,
          service: { connect: { id: body.service_id } },
        },
        select: {
          id: true,
          content: true,
          is_replied: false,
          client: { select: { id: true, name: true, surname: true } },
          replied_by: {
            select: {
              id: true,
              content: true,
              is_replied: true,
              client: { select: { id: true, name: true, surname: true } },
            },
          },
        },
      });

      if (body.reply_to_id.length > 0) {
        await this.prismaService.servicesComments.update({
          where: { id: body.reply_to_id },
          data: {
            replied_by: { connect: { id: result.id } },
          },
        });
      }
      return { status: 201, result };
    } catch (error) {
      console.log(error);

      return { status: 500 };
    }
  }

  public async getComments(query: GetCommentsDto) {
    try {
      const isExistService = await this.prismaService.services.findFirst({
        where: {
          id: query.service_id,
        },
      });
      if (!isExistService) {
        return { status: 400 };
      } else {
        const count = await this.prismaService.services.count({
          where: { id: query.service_id },
        });

        const total = this.getTotalPageNumber(
          Number(count),
          Number(query.per_page)
        );

        const paginationValue = this.makePagination(
          Number(query.page),
          Number(query.per_page)
        );

        const result = await this.prismaService.servicesComments.findMany({
          where: { serviceID: query.service_id, is_replied: false },
          orderBy: { createdAt: "desc" },
          skip: paginationValue.offset,
          take: paginationValue.per_page,
          select: {
            id: true,
            content: true,
            ServicesCommentLikes: { select: { clientID: true } },
            is_replied: true,
            client: { select: { id: true, name: true, surname: true } },
            replied_by: {
              select: {
                id: true,
                content: true,
                is_replied: true,
                client: { select: { id: true, name: true, surname: true } },
                ServicesCommentLikes: { select: { clientID: true } },
                replied_by: {
                  select: {
                    id: true,
                    content: true,
                    is_replied: true,
                    client: { select: { id: true, name: true, surname: true } },
                    ServicesCommentLikes: { select: { clientID: true } },
                    replied_by: {
                      select: {
                        id: true,
                        content: true,
                        is_replied: true,
                        client: {
                          select: { id: true, name: true, surname: true },
                        },
                        ServicesCommentLikes: { select: { clientID: true } },
                        replied_by: {
                          select: {
                            id: true,
                            content: true,
                            is_replied: true,
                            client: {
                              select: { id: true, name: true, surname: true },
                            },
                            ServicesCommentLikes: {
                              select: { clientID: true },
                            },
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

        return {
          status: 201,
          result,
          metadata: this.makeMetadata(
            Number(query.page),
            Number(query.per_page),
            Number(total)
          ),
        };
      }
    } catch (error) {
      console.log(error);

      return { status: 500 };
    }
  }

  public async actionForComment(comment_id: string, client_id: number) {
    try {
      const checkValidComment =
        await this.prismaService.servicesComments.findFirst({
          where: { id: comment_id },
        });
      if (!checkValidComment) {
        return { status: 400 };
      }

      const isExistService =
        await this.prismaService.servicesCommentLikes.findFirst({
          where: {
            commentID: comment_id,
            clientID: Number(client_id),
          },
        });
      if (!isExistService) {
        await this.prismaService.servicesCommentLikes.create({
          data: {
            commentID: comment_id,
            clientID: Number(client_id),
          },
        });
        return {
          status: 201,
        };
      } else {
        await this.prismaService.servicesCommentLikes.deleteMany({
          where: {
            commentID: comment_id,
            clientID: Number(client_id),
          },
        });
        return {
          status: 200,
        };
      }
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

      const total_comments = await this.prismaService.servicesComments.count({
        where: {
          serviceID: info.id,
        },
      });

      return { status: 201, service: { info, media, total_comments } };
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
