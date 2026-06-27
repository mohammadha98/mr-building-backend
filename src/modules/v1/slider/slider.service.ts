import { Injectable } from "@nestjs/common";
import { CreateSliderDto } from "./dto/create-slider.dto";
import { UpdateSliderDto } from "./dto/update-slider.dto";
import { PrismaService } from "../../../../prisma/prisma.service";
import { PaginationSchema } from "src/commons/contracts/PaginationSchema";
import IMetadata from "src/commons/contracts/IMetadata";
import IPagination from "src/commons/contracts/IPagination";
import UploadService from "src/modules/services/UploadService";
import statuses from "src/commons/contracts/Statuses";
import SliderTransformerApp from "./contracts/transformer-app";

@Injectable()
export class SliderService {
  private readonly uploaderService: UploadService;
  constructor(
    private readonly prisma: PrismaService,
    private readonly sliderTransformer: SliderTransformerApp
  ) {
    this.uploaderService = new UploadService();
  }

  async create(createSliderDto: CreateSliderDto) {
    try {
      return await this.prisma.slider.create({
        data: {
          title: createSliderDto.title,
          thumbnail: createSliderDto.thumbnail,
          tag: createSliderDto.tag,
        },
        select: {
          id: true,
          title: true,
          tag: true,
          thumbnail: true,
          created_at: true,
        },
      });
    } catch (error) {
      return false;
    }
  }

  async findAll(pagination: PaginationSchema) {
    const count = await this.prisma.slider.count();
    const total = this.getTotalPageNumber(
      Number(count),
      Number(pagination.per_page)
    );

    const paginationValue = this.makePagination(
      Number(pagination.page),
      Number(pagination.per_page)
    );

    const sliders = await this.prisma.slider.findMany({
      orderBy: { id: "desc" },
      skip: paginationValue.offset,
      take: paginationValue.per_page,
    });

    return {
      sliders,
      metadata: this.makeMetadata(
        Number(pagination.page),
        Number(pagination.per_page),
        Number(total)
      ),
    };
  }

  async update(body: UpdateSliderDto) {
    try {
      const info = await this.prisma.slider.findUnique({
        where: { id: Number(body.item_id) },
      });
      let file_name = info.thumbnail;

      if (body.file) {
        await this.uploaderService.removeFile(file_name, "sliders");
        file_name = body.file;
      } else {
        file_name = info.thumbnail;
      }

      const result = await this.prisma.slider.update({
        where: { id: Number(body.item_id) },
        data: { thumbnail: file_name, tag: body.tag },
        select: { id: true, title: true, thumbnail: true },
      });
      return { status: 200, result };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  async remove(id: number) {
    try {
      const info = await this.prisma.slider.findUnique({
        where: { id: Number(id) },
      });
      const file_name = info.thumbnail;

      await this.uploaderService.removeFile(file_name, "sliders");
      await this.prisma.slider.delete({ where: { id: Number(id) } });
      return { status: 200 };
    } catch (error) {
      return { status: 500 };
    }
  }

  public async getSliders(tag: string) {
    const sliders = await this.prisma.slider.findMany({
      orderBy: { id: "desc" },
      where: { status: statuses.active, tag },
    });
    return this.sliderTransformer.collection(sliders);
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
