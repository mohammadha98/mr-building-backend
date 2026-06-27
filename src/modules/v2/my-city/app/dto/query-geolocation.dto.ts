import { ApiProperty } from "@nestjs/swagger";
import { MyCityCategoriesEnum } from "../enums/myCity.category.enum";

export class GetLocaionInMyCity {
  @ApiProperty({ enum: MyCityCategoriesEnum })
  category: MyCityCategoriesEnum;

  @ApiProperty({ type: String, required: false })
  keyword: string;

  @ApiProperty({ type: Number })
  province_id: number;

  @ApiProperty({ type: Number })
  city_id: number;
}
