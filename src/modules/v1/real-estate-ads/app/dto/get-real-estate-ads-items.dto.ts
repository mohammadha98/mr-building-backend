import { ApiProperty } from "@nestjs/swagger";
import RealEstateAdTypes from "src/commons/contracts/RealEstateAdTypes";

export class GetRealEstateAdItemsDto {
  client_id: number;

  @ApiProperty({
    enum: RealEstateAdTypes,
    title: "type",
    default: RealEstateAdTypes.sale,
  })
  type: string;
}
