import { Module } from "@nestjs/common";
import { MessengerChannelAdminModule } from "./admin/messenger-channel.module";
import { MessengerChannelAppModule } from "./app/messenger-channel.module";

@Module({
  imports: [MessengerChannelAppModule, MessengerChannelAdminModule],
})
export class MessengerChannelsModule {}
