import { ApiProperty } from "@nestjs/swagger";
import { MyCityCategoriesEnum } from "../enums/myCity.category.enum";

export class GetLocaionInMyCity {
  @ApiProperty({
    enum: MyCityCategoriesEnum,
    default: MyCityCategoriesEnum.all,
  })
  category: MyCityCategoriesEnum;

  @ApiProperty({
    type: String,
    required: true,
    example: "active, inactive, rejected, pending",
  })
  status: string;

  @ApiProperty({ type: String, required: false })
  keyword: string;

  @ApiProperty({ type: Number, required: false })
  province_id: number;

  @ApiProperty({ type: Number, required: false })
  city_id: number;
}
