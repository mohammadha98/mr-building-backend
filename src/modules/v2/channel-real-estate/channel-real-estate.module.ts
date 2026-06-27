import { Module } from "@nestjs/common";
import { ChannelRealEstateAppModule } from "./app/channel-real-estate.module";
import { ChannelRealEstateAdminModule } from "./admin/channel-real-estate.module";

@Module({
  imports: [ChannelRealEstateAdminModule, ChannelRealEstateAppModule],
})
export class ChannelRealEstateModule {}
