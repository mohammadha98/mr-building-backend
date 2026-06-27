import { Module } from "@nestjs/common";
import { ChatRealEstateAppModule } from "./app/chat-real-estate.module";

@Module({
  imports: [ChatRealEstateAppModule],
})
export class ChatRealEstateModule {}
