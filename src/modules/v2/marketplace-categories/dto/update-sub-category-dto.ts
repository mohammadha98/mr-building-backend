import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateMarketplaceSubCategoryDto {
  user_id: number;

  @ApiProperty({ required: true })
  @IsOptional()
  item_id: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  form_id: string;
}
