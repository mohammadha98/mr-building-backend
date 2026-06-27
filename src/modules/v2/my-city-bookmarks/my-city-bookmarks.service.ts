import { Inject, Injectable, Scope } from "@nestjs/common";
import { CreateMyCityBookmarkDto } from "./dto/create-my-city-bookmark.dto";
import { PrismaService } from "../../../../prisma/prisma.service";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { BookmarkMyCityFactory } from "./factories/bookmark.factory";
import { HttpStatusCode } from "axios";
import { PublicMessage } from "src/commons/enums/messages";
import BookmarkCityTransformer from "./Transformer";

@Injectable({ scope: Scope.REQUEST })
export class MyCityBookmarksService {
  constructor(
    @Inject(REQUEST) private request: Request,
    private readonly prismaService: PrismaService,
    private readonly bookmarkFactory: BookmarkMyCityFactory,
    private readonly bookmarkTransformer: BookmarkCityTransformer
  ) {}

  async create(createBookmarkDto: CreateMyCityBookmarkDto) {
    const { location_id } = createBookmarkDto;
    await this.bookmarkFactory.findOneLocationById(location_id);

    const { id: client_id } = this.request.client;

    const exist = await this.findExist(location_id, client_id);
    if (exist) {
      await this.prismaService.bookmarkMyCityLocation.delete({
        where: { id: exist.id },
      });
    } else {
      await this.prismaService.bookmarkMyCityLocation.create({
        data: { myCityId: location_id, client_id },
      });
    }
    return {
      statusCode: HttpStatusCode.Ok,
      message: PublicMessage.OkResponse,
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
      statusCode: HttpStatusCode.Ok,
      message: PublicMessage.OkResponse,
      data: transformer,
    };
  }

  async findExist(myCityId: string, client_id: number) {
    return await this.prismaService.bookmarkMyCityLocation.findFirst({
      where: { client_id, myCityId },
      include: {
        myCity: true,
      },
    });
  }
}
