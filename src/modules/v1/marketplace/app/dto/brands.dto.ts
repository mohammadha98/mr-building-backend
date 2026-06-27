import { PaginationDto } from "src/commons/dto/pagination.dto";
import { ApiProperty } from "@nestjs/swagger";
import { MarketPlaceBrandSort } from "../enums/brand.enum";

export class GetBrands extends PaginationDto {
  @ApiProperty({ example: "normal, search" })
  type: string;

  @ApiProperty({ required: false })
  keyword: string;

  @ApiProperty({
    enum: MarketPlaceBrandSort,
    default: MarketPlaceBrandSort.newest,
  })
  sort: string;
}
