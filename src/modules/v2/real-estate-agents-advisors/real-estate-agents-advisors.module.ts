import { Module } from "@nestjs/common";
import { RealEstateAgentsAdvisorsAppModule } from "./app/real-estate-agents-advisors.module";

@Module({
  imports: [RealEstateAgentsAdvisorsAppModule],
})
export class RealEstateAgentsAdvisorsModule {}
