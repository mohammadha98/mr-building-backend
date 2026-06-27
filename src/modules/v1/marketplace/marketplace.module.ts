import { Module } from "@nestjs/common";
import { MarketplaceAppModule } from "./app/marketplace.module";

@Module({
  imports: [MarketplaceAppModule],
})
export class MarketplaceModule {}
