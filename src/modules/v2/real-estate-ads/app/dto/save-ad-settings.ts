import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNumberString } from "class-validator";

export class FilteredAdNotification_item {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  value: string;
}

export class SaveAdSettingsDto {
  @ApiProperty()
  item_id?: string;
  @ApiProperty()
  title?: string;
  @ApiProperty({ default: "2024-08-07 00:00:00" })
  expired_at?: Date;

  @ApiProperty()
  provinceId: number;
  @ApiProperty()
  cityId: number;
  @ApiProperty()
  categoryId?: string;
  @ApiProperty()
  subCategoryId?: string;

  @ApiProperty()
  smsNotification?: boolean;
  @ApiProperty()
  whatsappNotification?: boolean;

  @ApiProperty()
  year_built_from: number;
  @ApiProperty()
  year_built_to: number;

  @ApiProperty()
  size_from: number;
  @ApiProperty()
  size_to: number;

  @ApiProperty()
  sale_price_from: number;
  @ApiProperty()
  sale_price_to: number;

  @ApiProperty()
  deposit_price_from: number;
  @ApiProperty()
  deposit_price_to: number;

  @ApiProperty()
  rent_price_from: number;
  @ApiProperty()
  rent_price_to: number;

  @ApiProperty()
  normal_days_price_from: number;
  @ApiProperty()
  normal_days_price_to: number;

  @ApiProperty()
  number_of_rooms_from: number;
  @ApiProperty()
  number_of_rooms_to: number;

  @ApiProperty()
  max_capicity_from: number;
  @ApiProperty()
  max_capicity_to: number;

  @ApiProperty({ type: FilteredAdNotification_item, isArray: true })
  items: FilteredAdNotification_item[];
}
