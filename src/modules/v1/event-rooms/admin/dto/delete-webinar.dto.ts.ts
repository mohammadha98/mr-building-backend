import { ApiProperty } from "@nestjs/swagger";
import { IsNumberString } from "class-validator";

export class DeleteWebinarDto {
  user_id: number;

  @ApiProperty({ type: "integer" })
  @IsNumberString()
  webinar_id: number;
}
