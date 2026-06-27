import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class UpdateUserDto {
  user_id: number;

  @ApiProperty()
  user_key: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  email: string;

  // @ApiProperty({ name: "avatar", type: "string", format: "binary" })
  // @IsString()
  // avatar: string;
}
