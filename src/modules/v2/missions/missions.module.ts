import { Module } from "@nestjs/common";
import { MissionsAdminModule } from "./admin/missions.module";

@Module({
  imports: [MissionsAdminModule],
})
export class MissionsModule {}
