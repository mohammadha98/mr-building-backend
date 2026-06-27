import { ApiProperty } from "@nestjs/swagger";

export class PinnedChannelRealEstateDto {
  client_id: number;

  @ApiProperty()
  channel_id: number;
}
