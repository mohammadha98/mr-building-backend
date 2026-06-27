import { ApiProperty } from "@nestjs/swagger";

export class StoreMessageChannelRealEstateDto {
  client_id: number;

  @ApiProperty()
  agent_id: number;

  @ApiProperty()
  channel_id: number;

  @ApiProperty()
  content: string;

  @ApiProperty()
  type: string;

  @ApiProperty({ required: false })
  thumbnail: string;

  @ApiProperty()
  size: number;

  @ApiProperty()
  length: number;
}
