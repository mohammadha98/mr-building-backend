import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class UpdateUserProfileDto {
  user_id: string;

  @ApiProperty()
  @IsString()
  name: string;

  // @ApiProperty({ name: "avatar", type: "string", format: "binary" })
  // @IsString()
  // avatar: string;
}
