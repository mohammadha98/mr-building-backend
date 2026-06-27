import { ApiProperty } from "@nestjs/swagger";
import { IsNumberString } from "class-validator";

export class DeleteEventGroupDto {
  user_id: number;

  @ApiProperty({ type: "integer" })
  @IsNumberString()
  group_id: number;
}
