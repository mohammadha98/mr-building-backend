import { Module } from "@nestjs/common";
import { ReferralCodeService } from "./referral-code.service";
import { ReferralCodeController } from "./referral-code.controller";
import { PrismaService } from "../../../../../prisma/prisma.service";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import ReferralCodeTransformer from "./transformer";
import { ClientService } from "src/modules/v2/client/admin/client.service";
import { ClientModule } from "src/modules/v2/client/app/client.module";
import { NestjsFormDataModule } from "nestjs-form-data";

@Module({
  imports: [ClientModule, NestjsFormDataModule],
  controllers: [ReferralCodeController],
  providers: [
    ReferralCodeService,
    HttpResponsehandler,
    ReferralCodeTransformer,
    ClientService,
  ],
})
export class ReferralCodeAppModule {}
