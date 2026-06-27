import { Module } from "@nestjs/common";
import { MessengerAppModule } from "./app/messenger-app.module";

@Module({
  imports: [MessengerAppModule],
})
export class MessengerModule {}
