import { Module } from "@nestjs/common";
import { WebinarModule as WebinarAppModule } from "./app/webinar.module";
import { WebinarModule as WebinarAdminModule } from "./admin/webinar.module";

@Module({
  imports: [WebinarAppModule, WebinarAdminModule],
})
export class WebinarModule {}
