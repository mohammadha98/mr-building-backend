import { ApiProperty } from "@nestjs/swagger";
import MessengerChannelTypes from "src/commons/contracts/MessengerChannelTypes";

export class UpdateChannelTypeDto {
  client_id: number;

  @ApiProperty()
  channel_id: number;

  @ApiProperty({
    enum: MessengerChannelTypes,
    default: MessengerChannelTypes.private,
  })
  channel_type: string;

  @ApiProperty({})
  link: string;
}
