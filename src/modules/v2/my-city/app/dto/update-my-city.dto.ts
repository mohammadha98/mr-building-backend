import { PartialType } from "@nestjs/mapped-types";
import { CreateMyCityDto } from "./create-my-city.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { MyCityCategoriesEnum } from "../enums/myCity.category.enum";

export class UpdateMyCityDto extends PartialType(CreateMyCityDto) {
  @ApiProperty({ enum: MyCityCategoriesEnum })
  category: MyCityCategoriesEnum;

  @ApiProperty({ type: String })
  title: string;

  @IsOptional()
  @ApiProperty({ type: String })
  description: string;

  @IsOptional()
  @ApiProperty({ type: Number })
  year_built: number;

  @IsOptional()
  @ApiProperty({ type: Number })
  size: number;

  @ApiProperty({ type: Number })
  number_of_rooms: number;

  @ApiProperty({ type: String })
  status: string;

  @IsOptional()
  @ApiProperty({ default: false })
  renovation_tax: boolean;

  @ApiProperty({ type: Number })
  latitude: number;

  @ApiProperty({ type: Number })
  longitude: number;

  @ApiProperty({ type: Number })
  province_id: number;

  @ApiProperty({ type: Number })
  city_id: number;
}
