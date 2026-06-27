import { ApiProperty } from "@nestjs/swagger";

export enum MediaItemTypes {
  temp = "temp",
  file = "file",
}

export class DeleteMediaProductsDto {
  client_id: number;

  @ApiProperty({
    enum: MediaItemTypes,
    default: MediaItemTypes.temp,
  })
  type: string;

  @ApiProperty()
  item_id: number;
}
