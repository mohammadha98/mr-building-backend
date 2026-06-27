import { ApiOperation, ApiProperty } from "@nestjs/swagger";

export enum RealEstateMediaItemTypes {
  temp = "temp",
  file = "file",
}

export class DeleteRealEstateMediaItemDto {
  client_id: number;

  @ApiProperty({
    enum: RealEstateMediaItemTypes,
    default: RealEstateMediaItemTypes.temp,
  })
  type: string;

  @ApiProperty()
  item_id: number;
}
