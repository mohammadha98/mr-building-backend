import { ApiProperty } from "@nestjs/swagger";

export class JoinChannelDto {
  client_id: number;

  @ApiProperty()
  channel_id: number;
}
