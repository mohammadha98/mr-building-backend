import { BadRequestException, HttpStatus, Injectable } from "@nestjs/common";
import { BannerSliderDto } from "./dto/banner-slider.dto";
import { UpdateBannerDto } from "./dto/update-banner.dto";
import { PrismaService } from "../../../../prisma/prisma.service";
import { PaginationSchema } from "src/commons/contracts//PaginationSchema";
import UploadService from "src/modules/services/UploadService";
import BannerTransformerAdmin from "./contracts/transformer-admin";
import { PublicMessage } from "src/commons/enums/messages";
import {
  PaginationGenerator,
  PaginationSolver,
} from "src/commons/utils/pagination.util";

@Injectable()
export class BannerService {
  private readonly uploaderService: UploadService;

  constructor(
    private readonly prisma: PrismaService,
    private readonly bannerTransformer: BannerTransformerAdmin
  ) {
    this.uploaderService = new UploadService();
  }

  async create(createSliderDto: BannerSliderDto) {
    const result = await this.prisma.banners.create({
      data: {
        title: createSliderDto.title,
        thumbnail: createSliderDto.thumbnail,
        url: createSliderDto.url,
        tag: createSliderDto.tag,
      },
      select: {
        id: true,
        title: true,
        tag: true,
        thumbnail: true,
        url: true,
        created_at: true,
      },
    });

    const transformer = this.bannerTransformer.transform(result);
    return {
      statusCode: HttpStatus.CREATED,
      message: PublicMessage.Created,
      data: transformer,
    };
  }

  async findAll(pagination: PaginationSchema) {
    const { page, per_page, skip } = PaginationSolver(pagination);
    const count = await this.prisma.banners.count();

    const result = await this.prisma.banners.findMany({
      orderBy: { id: "desc" },
      skip,
      take: per_page,
    });

    const banners = this.bannerTransformer.collection(result);

    return {
      banners,
      metadata: PaginationGenerator(page, per_page, count),
    };
  }

  async update(body: UpdateBannerDto) {
    const info = await this.prisma.banners.findUnique({
      where: { id: Number(body.item_id) },
    });
    if (!info) {
      throw new BadRequestException();
    }

    let file_name = info.thumbnail;

    if (body.file) {
      await this.uploaderService.removeFile(file_name, "sliders");
      file_name = body.file;
    } else {
      file_name = info.thumbnail;
    }

    const result = await this.prisma.banners.update({
      where: { id: Number(body.item_id) },
      data: {
        thumbnail: file_name,
        tag: body.tag,
        url: body.url,
        title: body.title,
      },
      select: { id: true, title: true, thumbnail: true, url: true, tag: true },
    });
    const response = this.bannerTransformer.transform(result);

    return {
      statusCode: 200,
      message: PublicMessage.OkResponse,
      data: response,
    };
  }

  async remove(id: number) {
    const info = await this.prisma.banners.findUnique({
      where: { id: Number(id) },
    });
    if (!info) {
      throw new BadRequestException();
    }
    const file_name = info.thumbnail;

    await this.uploaderService.removeFile(file_name, "sliders");
    await this.prisma.banners.delete({ where: { id: Number(id) } });
    return { statusCode: 200, message: PublicMessage.Deleted };
  }
}
