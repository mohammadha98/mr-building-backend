import { Module } from "@nestjs/common";
import { SliderService } from "./slider.service";
import { SliderController } from "./slider.controller";
import { PrismaService } from "../../../../prisma/prisma.service";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import SliderTransformerAdmin from "./contracts/transformer-admin";
import SliderTransformerApp from "./contracts/transformer-app";

@Module({
  controllers: [SliderController],
  providers: [
    SliderService,
    HttpResponsehandler,
    SliderTransformerAdmin,
    SliderTransformerApp,
  ],
  exports: [
    SliderModule,
    SliderService,
    SliderTransformerAdmin,
    SliderTransformerApp,
  ],
})
export class SliderModule {}
