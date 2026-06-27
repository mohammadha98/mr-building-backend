import { ApiProperty } from "@nestjs/swagger";

export class TestSendClientNotificationDto {
  @ApiProperty()
  client_id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  body: string;
}
