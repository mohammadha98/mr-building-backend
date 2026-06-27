import { Module } from "@nestjs/common";
import { MessengerGroupsAppModule } from "./app/messenger-groups.module";

@Module({
  imports: [MessengerGroupsAppModule],
})
export class MessengerGroupsModule {}
