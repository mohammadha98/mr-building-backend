import { ApiProperty } from "@nestjs/swagger";

class sortedItems {
  @ApiProperty()
  id: string;

  @ApiProperty()
  sort_number: number;
}

export class UpdateSortItemsRealEstateAdsFormsDto {
  user_id: number;

  @ApiProperty({ isArray: true, type: sortedItems })
  items: sortedItems[];
}
