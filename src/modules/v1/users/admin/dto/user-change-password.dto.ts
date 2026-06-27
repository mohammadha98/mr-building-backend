import { ApiProperty } from "@nestjs/swagger";
import { IsNumberString, IsString } from "class-validator";

export class UserChangePasswordDto {
  token: string;
  token_id: number;

  @ApiProperty()
  @IsNumberString()
  user_id: number;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsString()
  dupplicate_password: string;
}
