import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import MessengerChannelTypes from "src/commons/contracts/MessengerChannelTypes";

export class CreateChannelDto {
  client_id: number;

  @ApiProperty({ required: false })
  channel_id: number;

  @ApiProperty()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    enum: MessengerChannelTypes,
    default: MessengerChannelTypes.private,
  })
  type: string;

  @ApiProperty({
    type: "string",
    format: "binary",
    name: "avatar",
    required: false,
  })
  avatar: string;
}
