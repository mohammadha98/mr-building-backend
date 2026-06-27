import { ApiProperty } from "@nestjs/swagger";

export class GetChannelsMessagesDto {
  client_id: number;

  @ApiProperty()
  channel_id: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  per_page: number;
}
