import { Module } from "@nestjs/common";
import { TermsOfServicesService } from "./terms-of-services.service";
import { TermsOfServicesController } from "./terms-of-services.controller";
import { PrismaService } from "../../../../../prisma/prisma.service";
import { ClientService } from "src/modules/v2/client/app/client.service";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import { ApiTags } from "@nestjs/swagger";
import TermsOfServicetarnsformer from "./Transformer";

@ApiTags("terms-of-services")
@Module({
  controllers: [TermsOfServicesController],
  providers: [
    TermsOfServicesService,
    TermsOfServicetarnsformer,
    ClientService,
    HttpResponsehandler,
  ],
})
export class TermsOfServicesAppModule {}
