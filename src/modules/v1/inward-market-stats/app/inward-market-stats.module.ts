import { Module } from "@nestjs/common";
import { InwardMarketStatsService } from "./inward-market-stats.service";
import { InwardMarketStatsController } from "./inward-market-stats.controller";
import { PrismaService } from "../../../../../prisma/prisma.service";

@Module({
  controllers: [InwardMarketStatsController],
  providers: [InwardMarketStatsService],
})
export class InwardMarketStatsAppModule {}
