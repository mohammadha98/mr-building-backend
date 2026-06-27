import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../../prisma/prisma.service";
import EventService from "../provider/EventService";
import IMetadata from "src/commons/contracts/IMetadata";
import IPagination from "src/commons/contracts/IPagination";
import { DeleteWebinarDto } from "./dto/delete-webinar.dto.ts";
import { PaginationDto } from "src/commons/contracts/Pagination.dto";

@Injectable()
export class WebinarService {
  private readonly eventService: EventService;
  constructor(private prisma: PrismaService) {
    this.eventService = new EventService();
  }

  // دریافت وبینار های ثبت شده
  async findAllWebinars(pagination: PaginationDto) {
    const count = await this.prisma.webinar.count();
    const total = this.getTotalPageNumber(
      Number(count),
      Number(pagination.per_page)
    );

    const paginationValue = this.makePagination(
      Number(pagination.page),
      Number(pagination.per_page)
    );

    const webinars = await this.prisma.webinar.findMany({
      skip: paginationValue.offset,
      take: paginationValue.per_page,
      orderBy: { created_at: "desc" },
    });

    return {
      webinars,
      metadata: this.makeMetadata(
        Number(pagination.page),
        Number(pagination.per_page),
        Number(total)
      ),
    };
  }

  // دریافت وبینار های کاربر
  async findAllMyWebinars(pagination: PaginationDto) {
    const count = await this.prisma.webinar.count();
    const total = this.getTotalPageNumber(
      Number(count),
      Number(pagination.per_page)
    );

    const paginationValue = this.makePagination(
      Number(pagination.page),
      Number(pagination.per_page)
    );

    const webinars = await this.prisma.webinar.findMany({
      skip: paginationValue.offset,
      take: paginationValue.per_page,
      orderBy: { created_at: "desc" },
    });

    return {
      webinars,
      metadata: this.makeMetadata(
        Number(pagination.page),
        Number(pagination.per_page),
        Number(total)
      ),
    };
  }

  // دریافت وبینارهای ثبت شده توسط کاربر
  async findInvitedWebinars(webinar_id: number) {
    const users = await this.prisma.guest.findMany({
      where: { webinar_id: Number(webinar_id) },
    });
    return users;
  }

  // حذف وبینار
  // حذف وبینار از پرووایدر
  async deleteWebinar(data: DeleteWebinarDto) {
    try {
      const webinar = await this.prisma.webinar.findFirst({
        where: { id: Number(data.webinar_id), owner_id: Number(data.user_id) },
      });
      if (webinar) {
        // delete webinar in provider db
        await this.eventService.deleteWebinar(webinar.webinar_id);

        // delte guests in webinar
        await this.prisma.guest.deleteMany({
          where: {
            webinar_id: Number(data.webinar_id),
          },
        });

        // delete webinar
        await this.prisma.webinar.delete({
          where: {
            id: Number(data.webinar_id),
          },
        });

        return { status: 200 };
      } else {
        return { status: 403 };
      }
    } catch (error) {
      return { status: 500 };
    }
  }

  private generateSlug(): string {
    return (
      new Date().getTime().toString() +
      Math.floor(Math.random() * (999999 - 111111 + 1) + 111111)
    );
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
