import { ApiProperty } from "@nestjs/swagger";
import { IsNumberString, IsString } from "class-validator";

export class CreateAdvisorCommentDto {
  client_id: number;

  @ApiProperty()
  @IsNumberString()
  advisor_id: number;

  @ApiProperty()
  @IsString()
  comment: string;

  @ApiProperty()
  @IsNumberString()
  score: number;
}
