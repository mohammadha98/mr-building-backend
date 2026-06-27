import { ApiProperty } from "@nestjs/swagger";
import { IsNumberString, IsString } from "class-validator";

export class CreateActiveAreaAdvisorDto {
  client_id: string;

  @ApiProperty()
  @IsNumberString()
  advisor_id: number;

  @ApiProperty()
  @IsString()
  title: string;
}
