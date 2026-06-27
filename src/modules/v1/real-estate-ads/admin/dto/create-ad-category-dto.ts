import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString } from "class-validator";

export class SubCategoryDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  form_id: string;
}

export enum RealEstateAdCategoryTypes {
  sale = "sale",
  rent = "rent",
  participation = "participation",
  short_rent = "short_rent",
}

export class CreateAdCategoryDto {
  user_id: number;

  @ApiProperty({ required: false, default: null })
  @IsOptional()
  item_id: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({
    enum: RealEstateAdCategoryTypes,
    default: RealEstateAdCategoryTypes.sale,
  })
  @IsEnum(RealEstateAdCategoryTypes)
  type: string;

  @ApiProperty({ required: false, isArray: true, type: SubCategoryDto })
  items: SubCategoryDto[];
}
