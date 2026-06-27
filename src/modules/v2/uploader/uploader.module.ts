import { Module } from "@nestjs/common";
import { UploaderService } from "./uploader.service";
import { UploaderController } from "./uploader.controller";
import { PrismaService } from "../../../../prisma/prisma.service";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";

@Module({
  controllers: [UploaderController],
  providers: [UploaderService, HttpResponsehandler],
})
export class UploaderModule {}
