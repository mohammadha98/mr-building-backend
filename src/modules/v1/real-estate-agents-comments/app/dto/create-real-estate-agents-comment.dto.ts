import { ApiProperty } from "@nestjs/swagger";
import { IsNumberString, IsString } from "class-validator";

export class CreateRealEstateAgentsCommentDto {
  client_id: number;

  @ApiProperty()
  @IsNumberString()
  agent_id: number;

  @ApiProperty()
  @IsString()
  comment: string;

  @ApiProperty()
  @IsNumberString()
  score: number;
}
