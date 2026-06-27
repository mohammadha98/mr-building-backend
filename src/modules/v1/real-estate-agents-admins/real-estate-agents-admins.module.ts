import { Module } from "@nestjs/common";
import { RealEstateAgentsAdminsAppModule } from "./app/real-estate-agents-admins.module";

@Module({
  imports: [RealEstateAgentsAdminsAppModule],
})
export class RealEstateAgentsAdminsModule {}
