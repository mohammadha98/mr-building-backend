import { ApiProperty } from "@nestjs/swagger";
import { IsNumberString, IsOptional } from "class-validator";
import SortingTypes from "src/commons/contracts/SortingTypes";
import { SelectedAdStatus } from "./get-real-estate-ads.dto";
import { RealEstateAdCategoryTypes } from "../../admin/dto/create-ad-category-dto";

class FilteredFields {
  @ApiProperty({ required: true })
  @IsNumberString()
  from: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumberString()
  to: number;
}

class Item {
  @ApiProperty()
  @IsNumberString()
  id: number;

  @ApiProperty()
  @IsNumberString()
  value: string;
}

export class FilteredDto {
  client_id: number;

  @ApiProperty()
  category_id: string;

  @ApiProperty()
  sub_category_id: string;

  @ApiProperty({
    enum: RealEstateAdCategoryTypes,
    title: "type",
    default: RealEstateAdCategoryTypes.sale,
    example: `${RealEstateAdCategoryTypes.sale}, ${RealEstateAdCategoryTypes.rent}, ${RealEstateAdCategoryTypes.short_rent}, ${RealEstateAdCategoryTypes.participation}`,
  })
  type: string;

  @ApiProperty({
    enum: SelectedAdStatus,
    title: "tag",
    default: SelectedAdStatus.me,
  })
  tag: string;

  @ApiProperty({
    enum: SortingTypes,
    title: "sort",
    default: SortingTypes.newest,
  })
  @IsOptional()
  sort: string;

  @ApiProperty({ type: Boolean, default: false })
  is_applicant: boolean;

  @ApiProperty({ type: FilteredFields })
  sale_price: FilteredFields;

  @ApiProperty({ type: FilteredFields })
  deposit_price: FilteredFields;

  @ApiProperty({ type: FilteredFields })
  rent_price: FilteredFields;

  @ApiProperty({ type: FilteredFields })
  normal_days_price: FilteredFields;

  @ApiProperty({ type: FilteredFields })
  number_of_rooms: FilteredFields;

  @ApiProperty({ type: FilteredFields })
  max_capicity: FilteredFields;

  @ApiProperty({ type: FilteredFields })
  size: FilteredFields;

  @ApiProperty({ type: FilteredFields })
  year_built: FilteredFields;

  @ApiProperty()
  province_id: number;

  @ApiProperty({ required: false })
  city_id: number;

  @ApiProperty({ type: Item, isArray: true })
  items: Item[];

  @ApiProperty({ default: false })
  @IsOptional()
  has_video: boolean;

  @ApiProperty({ default: 1 })
  @IsOptional()
  page: number;

  @ApiProperty({ default: 12 })
  @IsOptional()
  per_page: number;
}
