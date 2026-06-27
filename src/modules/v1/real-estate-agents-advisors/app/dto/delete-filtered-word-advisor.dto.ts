import { ApiProperty } from "@nestjs/swagger";
import { IsNumberString } from "class-validator";

export class DeleteFilteredWordAdvisorDto {
  client_id: string;

  @ApiProperty()
  @IsNumberString()
  item_id: number;
}
