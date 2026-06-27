import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class RequestVerifyChannelDto {
  client_id: number;

  @ApiProperty()
  channel_id: number;

  @ApiProperty()
  @IsNotEmpty()
  description: string;
}
