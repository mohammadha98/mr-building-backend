import { Module } from "@nestjs/common";
import { WebinarService } from "./webinar.service";
import { WebinarController } from "./webinar.controller";
import { PrismaService } from "../../../../../prisma/prisma.service";
import { NestjsFormDataModule } from "nestjs-form-data";

@Module({
  controllers: [WebinarController],
  imports: [NestjsFormDataModule],
  providers: [WebinarService],
})
export class WebinarModule {}
