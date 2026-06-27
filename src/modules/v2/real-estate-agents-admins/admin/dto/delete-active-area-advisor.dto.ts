import { ApiProperty } from "@nestjs/swagger";
import { IsNumberString } from "class-validator";

export class DeleteActiveAreaAdvisorDto {
  client_id: string;

  @ApiProperty()
  @IsNumberString()
  active_area_id: number;
}
