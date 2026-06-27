import { Module } from "@nestjs/common";
import { ServiceModulesService } from "./service-modules.service";
import { ServiceModulesController } from "./service-modules.controller";
import { PrismaService } from "../../../../../prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import ServicesModuleAdminTransformer from "./Transformer";
import { NestjsFormDataModule } from "nestjs-form-data";

@Module({
  imports: [NestjsFormDataModule],
  controllers: [ServiceModulesController],
  providers: [
    ServiceModulesService,
    JwtService,
    HttpResponsehandler,
    ServicesModuleAdminTransformer,
  ],
})
export class ServiceModulesAdmin {}
