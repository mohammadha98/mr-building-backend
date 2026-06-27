import { ApiProperty } from "@nestjs/swagger";
import { IsNumberString } from "class-validator";

export class ClientWebinarsDto {
  client_id: number;

  @ApiProperty()
  @IsNumberString()
  year: number;

  @ApiProperty()
  @IsNumberString()
  month: number;
}
