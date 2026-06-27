import { Module } from "@nestjs/common";
import { ClientService } from "./client.service";
import { ClientController } from "./client.controller";
import { PrismaService } from "../../../../../prisma/prisma.service";
import { NestjsFormDataModule } from "nestjs-form-data";
import RealEstateAgentsTransformer from "src/modules/v1/real-estate-agents/app/Transformer";
import ClientTransformer from "./Transformer";
import ForceUpdateTransformer from "src/modules/v1//force-update/admin/Transformer";
import UploadService from "src/modules/services/UploadService";
import { WsServerModule } from "src/modules/v1//ws-server/ws-server.module";

@Module({
  imports: [NestjsFormDataModule, WsServerModule],
  controllers: [ClientController],
  providers: [
    ClientService,
    RealEstateAgentsTransformer,
    ClientTransformer,
    ForceUpdateTransformer,
    UploadService,
  ],
  exports: [ClientService, ClientModule, ClientTransformer],
})
export class ClientModule {}
