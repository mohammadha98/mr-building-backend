import { Module } from "@nestjs/common";
import { MessengerSaveMessageAppModule } from "./app/save-message-app.module";

@Module({
  imports: [MessengerSaveMessageAppModule],
})
export class MessengerSaveMessageModule {}
