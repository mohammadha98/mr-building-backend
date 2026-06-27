import { Module } from "@nestjs/common";
import { PrizesAdminModule } from "./admin/prizes.module";
import { PrizesAppModule } from "./app/prizes.module";

@Module({
  imports: [PrizesAdminModule, PrizesAppModule],
})
export class PrizesModule {}
