import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsNumberString } from "class-validator";

export class SaveAdvisorSettingDto {
  client_id: number;

  @ApiProperty({ type: "integer", default: 1 })
  @IsNumberString()
  advisor_id: number;

  @ApiProperty({ type: "boolean", default: false })
  comment_visibility: boolean;
}
