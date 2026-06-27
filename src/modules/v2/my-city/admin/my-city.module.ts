import { Module } from "@nestjs/common";
import { MyCityService } from "./my-city.service";
import { MyCityController } from "./my-city.controller";
import { PrismaService } from "../../../../../prisma/prisma.service";
import UploadService from "src/modules/services/UploadService";
import MyCityTransformer from "./Transformer";

@Module({
  controllers: [MyCityController],
  providers: [MyCityService, UploadService, MyCityTransformer],
})
export class MyCityAdminModule {}
