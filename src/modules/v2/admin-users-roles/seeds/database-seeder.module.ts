import { Module } from "@nestjs/common";
import { DatabaseSeederService } from "./database-seeder.service";
import { DatabaseSeederController } from "./database-seeder.controller";
import { PrismaService } from "../../../../../prisma/prisma.service";

@Module({
  imports: [],
  controllers: [DatabaseSeederController],
  providers: [DatabaseSeederService, PrismaService],
  exports: [DatabaseSeederService],
})
export class DatabaseSeederModule {}
