import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class UpdatePermissionCategoryRoleDto {
  creator_id: number;

  @ApiProperty()
  @IsString()
  permission_id: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  key: string;
}
