import { Module } from "@nestjs/common";
import { RealEstateAgentsCommentsModuleAdmin } from "./admin/real-estate-agents-comments.module";
import { RealEstateAgentsCommentsModuleApp } from "./app/real-estate-agents-comments.module";

@Module({
  imports: [
    RealEstateAgentsCommentsModuleAdmin,
    RealEstateAgentsCommentsModuleApp,
  ],
})
export class RealEstateAgentsCommentsModule {}
