import { Module } from "@nestjs/common";
import { ReportsService } from "./report.service";
import { ReportsController } from "./report.controller";
import { PrismaService } from "../../../../../prisma/prisma.service";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import ReportsTransformer from "./Transformer";
import { NestjsFormDataModule } from "nestjs-form-data";
import { ClientService } from "src/modules/v2/client/app/client.service";
import { ClientModule } from "src/modules/v2/client/app/client.module";

@Module({
  imports: [NestjsFormDataModule, ClientModule],
  controllers: [ReportsController],
  providers: [
    ReportsService,
    ReportsTransformer,
    HttpResponsehandler,
    ClientService,
  ],
})
export class ReportsAppModule {}
