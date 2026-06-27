import { Module } from "@nestjs/common";
import { AdminReportsService } from "./admin-reports.service";
import { AdminReportsController } from "./admin-reports.controller";
import { PrismaService } from "../../../../prisma/prisma.service";

@Module({
  controllers: [AdminReportsController],
  providers: [AdminReportsService],
})
export class AdminReportsModule {}
