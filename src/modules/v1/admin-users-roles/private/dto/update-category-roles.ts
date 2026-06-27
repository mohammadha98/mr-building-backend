import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class UpdateCategoryRolesDto {
  creator_id: number;

  @ApiProperty()
  @IsString()
  category_id: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  key: string;
}
