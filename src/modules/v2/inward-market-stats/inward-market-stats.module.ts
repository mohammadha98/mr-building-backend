import { Module } from "@nestjs/common";
import { InwardMarketStatsAppModule } from "./app/inward-market-stats.module";

@Module({
  imports: [InwardMarketStatsAppModule],
})
export class InwardMarketStatsModule {}
