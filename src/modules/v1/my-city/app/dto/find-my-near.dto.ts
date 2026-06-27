import { ApiProperty } from "@nestjs/swagger";
import { Length } from "class-validator";
import { MyCityCategoriesEnum } from "../enums/myCity.category.enum";

export class MayNearDto {
  @ApiProperty({ enum: MyCityCategoriesEnum })
  category: MyCityCategoriesEnum;

  @ApiProperty({ type: Number })
  distanceInMeters: number;

  @ApiProperty({ type: Number })
  latitude: number;

  @ApiProperty({ type: Number })
  longitude: number;
}
