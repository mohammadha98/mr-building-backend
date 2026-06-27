import { Module } from "@nestjs/common";
import { RealEstateAdsModuleApp } from "./app/real-estate-ads.module";
import { RealEstateAdsModuleAdmin } from "./admin/real-estate-ads.module";
import { RealEstateAdsModuleSite } from "./site/real-estate-ads.module";
import { RealEstateAdsModuleRobotScraper } from "./robotScraper/real-estate-ads.module";

@Module({
  imports: [
    RealEstateAdsModuleRobotScraper,
    RealEstateAdsModuleSite,
    RealEstateAdsModuleApp,
    RealEstateAdsModuleAdmin,
  ],
})
export class RealEstateAdsModule {}
