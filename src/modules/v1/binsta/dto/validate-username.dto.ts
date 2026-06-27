import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ValidateUsernameBinstaDto {
  client_id: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  username: string;
}
