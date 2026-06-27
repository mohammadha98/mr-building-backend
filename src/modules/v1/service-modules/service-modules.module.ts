import { Module } from "@nestjs/common";
import { ServiceModulesAdmin } from "./admin/service-modules.module";
import { ServiceModulesApp } from "./app/service-modules.module";

@Module({
  imports: [ServiceModulesAdmin, ServiceModulesApp],
})
export class ServiceModulesModule {}
