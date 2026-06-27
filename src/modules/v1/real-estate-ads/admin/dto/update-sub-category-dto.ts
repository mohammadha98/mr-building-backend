import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateSubCategoryDto {
  user_id: number;

  @ApiProperty({ required: true })
  @IsOptional()
  item_id: string;

  @ApiProperty({ required: true })
  @IsOptional()
  form_id: string;

  @ApiProperty()
  @IsString()
  title: string;
}
