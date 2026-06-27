import { ApiProperty } from "@nestjs/swagger";
import MessengerChannelTypes from "src/commons/contracts/MessengerChannelTypes";

export class UpdateGroupTypeDto {
  client_id: number;

  @ApiProperty()
  group_id: number;

  @ApiProperty({
    enum: MessengerChannelTypes,
    default: MessengerChannelTypes.private,
  })
  channel_type: string;

  @ApiProperty({})
  link: string;
}
