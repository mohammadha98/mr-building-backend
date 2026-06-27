import { ApiProperty } from "@nestjs/swagger";
import { IsNumberString } from "class-validator";

export class GetActiveAreasAdvisorDto {
  client_id: string;

  @ApiProperty()
  @IsNumberString()
  advisor_id: number;
}
