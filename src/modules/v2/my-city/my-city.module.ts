import { Module } from "@nestjs/common";
import { MyCityAppModule } from "./app/my-city.module";
import { MyCityAdminModule } from "./admin/my-city.module";

@Module({
  imports: [MyCityAppModule, MyCityAdminModule],
})
export class MyCityModule {}
