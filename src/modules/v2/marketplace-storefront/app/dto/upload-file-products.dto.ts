import { ApiProperty } from "@nestjs/swagger";
import RealEstateAdMediaType from "src/commons/contracts/RealEstateAdMediaType";
import RealEstateAdMediaTypePriorities from "src/commons/contracts/RealEstateAdMediaTypePriorities";
import { MediaItemTypes } from "./delete-media-item-products.dto";

export class UploadFileProductsDto {
  client_id: number;
  thumbnail: string;

  @ApiProperty({
    enum: MediaItemTypes,
    default: MediaItemTypes.temp,
  })
  type: string;

  @ApiProperty({ required: false })
  product_id: string;

  @ApiProperty({
    required: false,
    enum: RealEstateAdMediaTypePriorities,
    default: RealEstateAdMediaTypePriorities.normal,
  })
  priority: string;

  @ApiProperty({
    enum: RealEstateAdMediaType,
    title: "file_type",
    default: RealEstateAdMediaType.image,
  })
  file_type: string;

  @ApiProperty({ name: "file", type: "string", format: "binary" })
  file: string;
}
