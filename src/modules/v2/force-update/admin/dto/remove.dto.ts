import { ApiProperty } from "@nestjs/swagger";
import { IsNumberString } from "class-validator";

export class RemoveDto {
  user_id: number;

  @ApiProperty({ type: "integer", default: 1 })
  @IsNumberString()
  item_id: number;
}
