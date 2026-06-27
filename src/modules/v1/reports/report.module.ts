import { Module } from "@nestjs/common";
import { ReportsAppModule } from "./app/report.module";
import { ReportAdminModule } from "./admin/report.module";

@Module({
  imports: [ReportsAppModule, ReportAdminModule],
})
export class ReportModule {}
