import { ApiProperty } from "@nestjs/swagger";

export class SaveNotificationTokenDto {
  client_id: number;

  @ApiProperty()
  device_info: string;

  @ApiProperty()
  notification_token: string;
}
