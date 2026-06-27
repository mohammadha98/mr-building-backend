import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class GetGroupInfoDto {
  client_id: number;

  @ApiProperty()
  @IsNumber()
  username: string;
}
