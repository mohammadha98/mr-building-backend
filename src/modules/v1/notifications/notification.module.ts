import { Module } from "@nestjs/common";
import { NotificationAppModule } from "./app/notification.module";
import { NotificationAdminModule } from "./admin/notification.module";

@Module({
  imports: [NotificationAppModule, NotificationAdminModule],
})
export class NotificationModule {}
