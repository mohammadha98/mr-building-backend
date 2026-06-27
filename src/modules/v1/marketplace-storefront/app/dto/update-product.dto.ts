import { ApiProperty } from "@nestjs/swagger";

class AdItem {
  @ApiProperty()
  id: string;

  @ApiProperty()
  value: string;
}

export class UpdateProductDto {
  client_id: number;

  @ApiProperty()
  product_id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  unit_of_sales: string;

  @ApiProperty()
  price: number;

  @ApiProperty({ default: false })
  has_discount: boolean;

  @ApiProperty({ default: 0 })
  discounted_price: number;

  @ApiProperty({ isArray: true })
  colors: string[];

  @ApiProperty()
  category_id: string;

  @ApiProperty()
  sub_category_id: string;

  @ApiProperty()
  brand_id: string;

  @ApiProperty({ type: AdItem, isArray: true })
  items: AdItem[];
}
