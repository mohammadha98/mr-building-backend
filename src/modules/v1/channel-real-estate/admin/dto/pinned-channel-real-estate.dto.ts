import { ApiProperty } from "@nestjs/swagger";
import ChannelsTypes from "src/commons/contracts/ChannelsTypes";

export class PinnedChannelRealEstateDto {
  user_id: number;

  @ApiProperty()
  channel_id: number;

  @ApiProperty({ enum: ChannelsTypes, default: ChannelsTypes.pinned })
  tag: string;
}
