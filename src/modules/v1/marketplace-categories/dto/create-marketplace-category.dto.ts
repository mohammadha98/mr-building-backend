import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class SubCategoryDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  form_id: string;
}

export class CreateMarketplaceCategoryDto {
  user_id: number;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  item_id: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ isArray: true, type: SubCategoryDto })
  items: SubCategoryDto[];

  @ApiProperty({
    name: "thumbnail",
    type: "string",
    format: "binary",
    required: false,
  })
  thumbnail: string;
}
