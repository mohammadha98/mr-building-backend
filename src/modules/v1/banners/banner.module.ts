import { Module } from "@nestjs/common";
import { BannerService } from "./banner.service";
import { BannerController } from "./banner.controller";
import { PrismaService } from "../../../../prisma/prisma.service";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import BannerTransformerAdmin from "./contracts/transformer-admin";

@Module({
  controllers: [BannerController],
  providers: [
    BannerService,
    HttpResponsehandler,
    BannerTransformerAdmin,
  ],
})
export class BannerModule {}
