import { ApiProperty } from "@nestjs/swagger";

export class GetChannelsMembersDto {
  client_id: number;

  @ApiProperty()
  channel_id: number;
}
