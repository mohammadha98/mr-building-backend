import { ApiProperty } from "@nestjs/swagger";

export class CreateChatMessenger {
  client_id: number;

  @ApiProperty()
  destination_id: number;
}
