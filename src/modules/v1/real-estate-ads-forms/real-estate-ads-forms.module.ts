import { Module } from "@nestjs/common";
import { RealEstateAdsFormsModuleAdmin } from "./admin/real-estate-ads-forms.module";

@Module({
  imports: [RealEstateAdsFormsModuleAdmin],
})
export class RealEstateAdsFormsModule {}
