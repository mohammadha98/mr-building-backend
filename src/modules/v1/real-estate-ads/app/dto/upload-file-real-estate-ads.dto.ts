import { ApiProperty } from "@nestjs/swagger";
import RealEstateAdMediaType from "src/commons/contracts/RealEstateAdMediaType";
import { RealEstateMediaItemTypes } from "./delete-media-item.dto";
import RealEstateAdMediaTypePriorities from "src/commons/contracts/RealEstateAdMediaTypePriorities";

export class UploadFileRealEstateAdItemsDto {
  client_id: number;

  @ApiProperty({
    enum: RealEstateMediaItemTypes,
    default: RealEstateMediaItemTypes.temp,
  })
  type: string;

  @ApiProperty({ required: false })
  ad_id: number;

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
