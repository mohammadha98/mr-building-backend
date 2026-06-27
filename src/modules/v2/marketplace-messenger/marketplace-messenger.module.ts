import { Module } from "@nestjs/common";
import { MarketplaceChatAppModule } from "./app/marketplace-messenger.module";

@Module({
  imports: [MarketplaceChatAppModule],
})
export class MarketplaceMessengerModule {}
