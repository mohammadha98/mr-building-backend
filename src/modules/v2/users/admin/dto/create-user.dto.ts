import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateUserDto {
  token: string;
  creator_id: number;
  refresh_token: string;
  uniqKey: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty({ type: "string", isArray: true })
  roles: string[];

  // @ApiProperty({ name: "avatar", type: "string", format: "binary" })
  // @IsString()
  // avatar: string;
}
