import { HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../../prisma/prisma.service";
import { InwardStatTypes } from "../enums/inward-stats.enum";
import { PublicMessage } from "src/commons/enums/messages";

@Injectable()
export class InwardMarketStatsService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll() {
    const gold = await this.getGolds();
    const coin = await this.getCoins();
    const currency = await this.getCurrency();

    return {
      statusCode: HttpStatus.OK,
      message: PublicMessage.OkResponse,
      data: {
        gold,
        coin,
        currency,
      },
    };
  }

  private async getGolds() {
    return this.prismaService.inwardMarketStatistics.findMany({
      where: { type: InwardStatTypes.Gold },
    });
  }

  private async getCoins() {
    return this.prismaService.inwardMarketStatistics.findMany({
      where: { type: InwardStatTypes.Coin },
    });
  }
  private async getCurrency() {
    return this.prismaService.inwardMarketStatistics.findMany({
      where: { type: InwardStatTypes.Currency },
    });
  }
}
