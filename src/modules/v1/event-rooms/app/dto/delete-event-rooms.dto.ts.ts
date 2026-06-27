import { ApiProperty } from "@nestjs/swagger";
import { IsNumberString } from "class-validator";

export class DeleteEventRoomDto {
  user_id: number;

  @ApiProperty({ type: "integer" })
  @IsNumberString()
  room_id: number;
}
