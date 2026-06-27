import { Module } from "@nestjs/common";
import { EventRoomsModule as EventRoomsAppModule } from "./app/event-rooms.module";
import { EventRoomsModule as EventRoomsAdminModule } from "./admin/event-rooms.module";

@Module({
  imports: [EventRoomsAppModule, EventRoomsAdminModule],
})
export class EventRoomsModule {}
