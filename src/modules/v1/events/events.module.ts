import { Module } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { EventsGroupsModule } from "./group/events-groups.module";
@ApiTags("events")
@Module({
  imports: [EventsGroupsModule],
})
export class EventsModule {}
