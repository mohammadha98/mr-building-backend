import { Module } from "@nestjs/common";
import { ClientModule as ClientApptModule } from "./app/client.module";
import { ClientModule as ClientAdminModule } from "./admin/client.module";
import { NestjsFormDataModule } from "nestjs-form-data";

@Module({
  imports: [NestjsFormDataModule, ClientApptModule, ClientAdminModule],
})
export class ClientModule {}
