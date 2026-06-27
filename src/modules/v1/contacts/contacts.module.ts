import { Module } from "@nestjs/common";
import { ContactsService } from "./contacts.service";
import { ContactsController } from "./contacts.controller";
import { NestjsFormDataModule } from "nestjs-form-data";
import { ClientService } from "src/modules/v1//client/app/client.service";
import MrBuildingMailerService from "src/modules/services/notifications/mailer/providers/MrBuildingMailerService";
import MailerService from "src/modules/services/notifications/mailer/mailerService";
import ClientContactsTransformer from "./Transformer";

@Module({
  imports: [NestjsFormDataModule],
  exports: [ContactsService],
  controllers: [ContactsController],
  providers: [
    ContactsService,
    ClientService,
    MailerService,
    MrBuildingMailerService,
    ClientContactsTransformer,
  ],
})
export class ContactsModule {}
