import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class RoleCategories {
  @ApiProperty()
  @IsString()
  category_id: string;

  @ApiProperty({ isArray: true, type: "string" })
  permissions: string[];
}

export class CreateRoleDto {
  creator_id: number;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  key: string;

  @ApiProperty({ isArray: true, type: RoleCategories })
  categories: RoleCategories[];
}
