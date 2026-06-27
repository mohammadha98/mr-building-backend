import { HttpStatus, Injectable } from "@nestjs/common";
import { AdminReportsDto } from "./dto/admin-reports.dto";
import { PrismaService } from "../../../../prisma/prisma.service";
import { AdminReportTypes } from "./enums/admin-report-types.enum";
import Statuses from "src/commons/contracts/Statuses";
import { AdsDetailTags } from "../real-estate-ads/app/dto/get-details-real-estate-ads.dto";
import { GetInActiveClients } from "./dto/getInActiveClients";

@Injectable()
export class AdminReportsService {
  constructor(private readonly prismaService: PrismaService) {}

  async generateAdsReports(reportDto: AdminReportsDto) {
    const ads = await this.getAdsStats(reportDto);

    return {
      statusCode: HttpStatus.CREATED,
      message: "دیتا ارسال شد",
      data: {
        ads,
      },
    };
  }

  async generateClientReports(reportDto: AdminReportsDto) {
    const clients = await this.getInstallationStats(reportDto.period);

    return {
      statusCode: HttpStatus.CREATED,
      message: "دیتا ارسال شد",
      data: {
        clients,
      },
    };
  }

  async generateRealEstateReports(reportDto: AdminReportsDto) {
    const real_estates = await this.getRealEstateAgentsStats(reportDto.period);

    return {
      statusCode: HttpStatus.CREATED,
      message: "دیتا ارسال شد",
      data: {
        real_estates,
      },
    };
  }

  async getInActiveClients(body: GetInActiveClients) {
    const fromDate = new Date(
      Date.UTC(
        +body.from.year,
        +body.from.month - 1,
        +body.from.date,
        0,
        0,
        0,
        0
      )
    );
    const toDate = new Date(
      Date.UTC(
        +body.to.year,
        +body.to.month - 1,
        +body.to.date,
        23,
        59,
        59,
        999
      )
    );

    const result = await this.prismaService.client.findMany({
      where: {
        last_login_time: {
          gt: fromDate.toISOString(),
          lt: toDate.toISOString(),
        },
      },
      select: {
        id: true,
        name: true,
        surname: true,
        phone: true,
        last_login_time: true,
      },
      orderBy: { last_login_time: "asc" },
      // skip
    });
    return {
      statusCode: HttpStatus.CREATED,
      message: "لیست کاربران غیر فعال بر اساس بازه زمانی",
      data: {
        data: result,
        // metadata: PaginationGenerator(page, per_page, count)
      },
    };
  }

  private async getInstallationStats(period: AdminReportTypes) {
    let { now, daily, weekly, monthly, yearly } =
      this.generateDateForStats() as any;
    const where = this.generateCondition(period);

    const total = await this.prismaService.client.count();

    daily = await this.prismaService.client.count({
      where: {
        created_at: {
          gte: daily,
        },
      },
    });

    weekly = await this.prismaService.client.count({
      where: {
        created_at: {
          gte: weekly,
        },
      },
    });

    monthly = await this.prismaService.client.count({
      where: {
        created_at: {
          gte: monthly,
        },
      },
    });

    yearly = await this.prismaService.client.count({
      where: {
        created_at: {
          gte: yearly,
        },
      },
    });

    const period_count = await this.prismaService.client.count({
      where,
    });

    const result = await this.prismaService.client.groupBy({
      by: ["created_at"],
      _count: {
        _all: true,
      },
      where,
      orderBy: {
        created_at: "asc",
      },
    });
    const data = this.formattedStats(result, period);

    return {
      total,
      daily,
      weekly,
      monthly,
      yearly,
      period_count,
      data,
    };
  }

  private async getRealEstateAgentsStats(period: AdminReportTypes) {
    let { daily, weekly, monthly, yearly } = this.generateDateForStats() as any;
    const where = this.generateCondition(period);

    const total = await this.prismaService.realEstateAgents.count();
    daily = await this.prismaService.realEstateAgents.count({
      where: {
        created_at: {
          gte: daily,
        },
      },
    });

    weekly = await this.prismaService.realEstateAgents.count({
      where: {
        created_at: {
          gte: weekly,
        },
      },
    });

    monthly = await this.prismaService.realEstateAgents.count({
      where: {
        created_at: {
          gte: monthly,
        },
      },
    });

    yearly = await this.prismaService.realEstateAgents.count({
      where: {
        created_at: {
          gte: yearly,
        },
      },
    });

    const period_count = await this.prismaService.realEstateAgents.count({
      where,
    });

    const result = await this.prismaService.realEstateAgents.groupBy({
      by: ["created_at"],
      _count: {
        _all: true,
      },
      where,
      orderBy: {
        created_at: "asc",
      },
    });
    const data = this.formattedStats(result, period);

    return {
      total,
      daily,
      weekly,
      monthly,
      yearly,
      period_count,
      data,
    };
  }

  private async getAdsStats(reportDto: AdminReportsDto) {
    let { daily, weekly, monthly, yearly } = this.generateDateForStats() as any;
    const where = this.generateCondition(reportDto.period);

    let status = undefined;
    if (reportDto.status !== Statuses.all) {
      status = reportDto.status;
      where.status = reportDto.status;
    }

    const total = await this.prismaService.realEstateAds.count();
    daily = await this.prismaService.realEstateAds.count({
      where: {
        status,
        tag: AdsDetailTags.mrbuilding,
        created_at: {
          gte: daily,
        },
      },
    });

    weekly = await this.prismaService.realEstateAds.count({
      where: {
        status,
        tag: AdsDetailTags.mrbuilding,
        created_at: {
          gte: weekly,
        },
      },
    });

    monthly = await this.prismaService.realEstateAds.count({
      where: {
        status,
        tag: AdsDetailTags.mrbuilding,
        created_at: {
          gte: monthly,
        },
      },
    });

    yearly = await this.prismaService.realEstateAds.count({
      where: {
        status,
        tag: AdsDetailTags.mrbuilding,
        created_at: {
          gte: yearly,
        },
      },
    });

    const period_count = await this.prismaService.realEstateAds.count({
      where,
    });

    const result = await this.prismaService.realEstateAds.groupBy({
      by: ["created_at"],
      _count: {
        _all: true,
      },
      where,
      orderBy: {
        created_at: "asc",
      },
    });
    const data = this.formattedStats(result, reportDto.period);

    return {
      total,
      daily,
      weekly,
      monthly,
      yearly,
      period_count,
      data,
    };
  }

  private generateCondition(period: AdminReportTypes) {
    let { daily, weekly, monthly, yearly } = this.generateDateForStats() as any;

    let now = new Date();
    let where: any = {};

    if (period === AdminReportTypes.Daily) {
      where = {
        created_at: {
          gte: daily,
        },
      };
    } else if (period === AdminReportTypes.Weekly) {
      where = {
        created_at: {
          gte: weekly,
        },
      };
    } else if (period === AdminReportTypes.Monthly) {
      where = {
        created_at: {
          gte: monthly,
        },
      };
    } else if (period === AdminReportTypes.Yearly) {
      where = {
        created_at: {
          gte: yearly,
        },
      };
    }
    return where;
  }

  private formattedStats(list: any, period: AdminReportTypes) {
    const formattedStats = list.map((stat) => ({
      date: stat.created_at.toISOString().split("T")[0],
      count: stat._count._all,
    }));

    let data = formattedStats.reduce((acc, current) => {
      const existingDate = acc.find((item) => item.date === current.date);
      if (existingDate) {
        existingDate.count += current.count;
      } else {
        acc.push({ date: current.date, count: current.count });
      }
      return acc;
    }, []);

    return data;
  }

  private generateDateForStats() {
    let date = new Date();
    date.setHours(3, 30, 0, 0);

    let daily = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      3,
      30,
      0,
      0
    );
    console.log({ daily });

    let weekly = date.setDate(date.getDate() - 7) as any;
    weekly = new Date(weekly);
    console.log({ weekly });

    let monthly = date.setDate(date.getDate() - 30) as any;
    monthly = new Date(monthly);
    console.log({ monthly });

    let yearly = date.setDate(date.getDate() - 365) as any;
    yearly = new Date(yearly);
    console.log({ yearly });

    return {
      now: new Date(),
      daily,
      weekly,
      monthly,
      yearly,
    };
  }
}
