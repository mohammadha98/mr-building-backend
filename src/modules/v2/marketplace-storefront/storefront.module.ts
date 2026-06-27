import { Module } from "@nestjs/common";
import { StorefrontModuleApp } from "./app/storefront.module";
import { StorefrontModule as RealEstateAgents_admin_Module } from "./admin/storefront.module";

@Module({
  imports: [StorefrontModuleApp, RealEstateAgents_admin_Module],
})
export class StorefrontModule {}
