import { Module } from "@nestjs/common";
import { ForceUpdateAdminModule } from "./admin/force-update.module";

@Module({
  imports: [ForceUpdateAdminModule],
})
export class ForceUpdateModule {}
