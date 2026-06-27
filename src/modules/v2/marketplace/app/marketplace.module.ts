import { Module } from "@nestjs/common";
import { MarketplaceService } from "./marketplace.service";
import { MarketplaceAppController } from "./marketplace.controller";
import { StorefrontModuleApp } from "../../marketplace-storefront/app/storefront.module";
import { MarketplaceFactory } from "./fartories/marketplace-factory";
import { SliderModule } from "../../slider/slider.module";
import { SliderService } from "../../slider/slider.service";
import SliderTransformerAdmin from "../../slider/contracts/transformer-admin";

@Module({
  imports: [StorefrontModuleApp, SliderModule],
  controllers: [MarketplaceAppController],
  providers: [
    MarketplaceService,
    MarketplaceFactory,
    SliderService,
    SliderTransformerAdmin,
  ],
})
export class MarketplaceAppModule {}
