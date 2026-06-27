import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class UpdateUserRolesDto {
  user_id: number;

  @ApiProperty()
  @IsString()
  user_key: string;

  @ApiProperty({ type: "string", isArray: true })
  roles: string[];
}
