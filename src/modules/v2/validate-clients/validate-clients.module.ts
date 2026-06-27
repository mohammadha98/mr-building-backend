import { Module } from "@nestjs/common";
import { ValidateClientsService } from "./validate-clients.service";
import { ValidateClientsController } from "./validate-clients.controller";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import { NestjsFormDataModule } from "nestjs-form-data";
import { PrismaService } from "../../../../prisma/prisma.service";
import SmsService from "src/modules/services/notifications/sms/SmsService";

@Module({
  imports: [NestjsFormDataModule],
  controllers: [ValidateClientsController],
  providers: [
    ValidateClientsService,
    HttpResponsehandler,
    SmsService,
  ],
})
export class ValidateClientsModule {}
