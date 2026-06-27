import { Module } from "@nestjs/common";
import { EventGroupsModule as EventGroupsAppModule } from "./app/event-groups.module";
import { EventGroupsModule as EventGroupsAdminModule } from "./admin/event-groups.module";

@Module({
  imports: [EventGroupsAppModule, EventGroupsAdminModule],
})
export class EventsGroupsModule {}
