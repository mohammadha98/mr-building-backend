import { Module } from "@nestjs/common";
import { RealEstateAdsFormsModuleAdmin } from "./admin/product-feature-forms.module";

@Module({
  imports: [RealEstateAdsFormsModuleAdmin],
})
export class MarketplaceProductFeatureFormsModule {}
