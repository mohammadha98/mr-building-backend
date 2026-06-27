import { ApiProperty } from "@nestjs/swagger";

export class JoinChannelRealEstateDto {
  client_id: number;

  @ApiProperty()
  channel_id: number;
}
