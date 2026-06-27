import { ApiProperty } from "@nestjs/swagger";
import { IsNumberString } from "class-validator";

export class UserInfoDto {
  token: string;
  token_id: number;

  @ApiProperty()
  @IsNumberString()
  user_id: number;
}
