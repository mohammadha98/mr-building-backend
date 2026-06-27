import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNumberString, IsOptional } from "class-validator";
import { PaginationDto } from "src/commons/dto/pagination.dto";
import SortingTypes from "src/commons/contracts/SortingTypes";

class FilteredProductFields {
  @ApiProperty({ required: false })
  @IsNumberString()
  from: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumberString()
  to: number;
}

export class FilterProductsDto extends PaginationDto {
  @ApiProperty({ required: false })
  categoryId: string;

  @ApiProperty({ required: false })
  subCategoryId: string;

  @ApiProperty({ required: false })
  brandId: string;

  @ApiProperty({ required: false })
  price: FilteredProductFields;

  @ApiProperty({
    enum: SortingTypes,
    default: SortingTypes.newest,
  })
  @IsEnum(SortingTypes)
  sort: SortingTypes;
}
