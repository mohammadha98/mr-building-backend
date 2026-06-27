import { Module } from "@nestjs/common";
import { BinstaService } from "./binsta.service";
import { BinstaController } from "./binsta.controller";
import { PrismaService } from "../../../../prisma/prisma.service";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import { ClientService } from "src/modules/v1//client/app/client.service";
import MrBuildingMailerService from "src/modules/services/notifications/mailer/providers/MrBuildingMailerService";
import MailerService from "src/modules/services/notifications/mailer/mailerService";

@Module({
  controllers: [BinstaController],
  providers: [BinstaService],
  imports: [
    HttpResponsehandler,
    ClientService,
    MailerService,
    MrBuildingMailerService,
  ],
})
export class BinstaModule {}
