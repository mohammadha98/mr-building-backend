import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class SaveProceedingDto {
  user_id: number;

  @ApiProperty()
  @IsString()
  webinar_id: number;

  @ApiProperty()
  @IsString()
  content: string;
}
