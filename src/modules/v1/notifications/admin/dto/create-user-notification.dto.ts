import { ApiProperty } from "@nestjs/swagger";

export class CreateNotificationForUserDto {
  @ApiProperty()
  client_id: number;

  @ApiProperty()
  notification_token: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  body: string;
}
