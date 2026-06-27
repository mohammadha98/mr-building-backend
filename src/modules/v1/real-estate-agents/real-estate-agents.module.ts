import { Module } from "@nestjs/common";
import { RealEstateAgentsModuleApp } from "./app/real-estate-agents.module";
import { RealEstateAgentsModule as RealEstateAgents_admin_Module } from "./admin/real-estate-agents.module";

@Module({
  imports: [RealEstateAgentsModuleApp, RealEstateAgents_admin_Module],
})
export class RealEstateAgentsModule {}
