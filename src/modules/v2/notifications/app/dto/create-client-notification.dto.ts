import { ApiProperty } from "@nestjs/swagger";

export class CreateNotificationForClientDto {
  @ApiProperty()
  client_id: number;

  @ApiProperty()
  notification_token: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  body: string;
}



export class CreateGeneralNotificationDto {

  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  link: string;

}
