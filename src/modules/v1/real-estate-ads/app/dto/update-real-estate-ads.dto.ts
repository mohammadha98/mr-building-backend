import { ApiProperty } from "@nestjs/swagger";
import RealEstateAdSellerTypes from "src/commons/contracts/RealEstateAdSellerTypes";

class AdItem {
  @ApiProperty()
  id: string;

  @ApiProperty()
  value: string;
}

export class UpdateRealEstateAdDto {
  client_id: number;

  @ApiProperty()
  id: number;

  @ApiProperty({
    enum: RealEstateAdSellerTypes,
    default: RealEstateAdSellerTypes.individual,
    example: `${RealEstateAdSellerTypes.individual}, ${RealEstateAdSellerTypes.real_estate_agent}, ${RealEstateAdSellerTypes.advisor}`,
  })
  seller_type: string;

  @ApiProperty()
  agent_valuation_request: boolean;

  @ApiProperty()
  category_id: string;

  @ApiProperty()
  sub_category_id: string;

  @ApiProperty()
  agent_id: number;

  @ApiProperty({ default: 0 })
  advisor_id: number;

  @ApiProperty({ default: true })
  display_contact: boolean;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ default: false })
  is_applicant: boolean;

  @ApiProperty()
  year_built: number;

  @ApiProperty()
  size: number;

  @ApiProperty()
  sale_price: number;

  @ApiProperty()
  deposit_price: number;

  @ApiProperty()
  rent_price: number;

  @ApiProperty()
  number_of_rooms: number;

  @ApiProperty()
  max_capicity: number;

  @ApiProperty()
  normal_days_price: number;

  @ApiProperty()
  weekend_price: number;

  @ApiProperty()
  special_days_price: number;

  @ApiProperty()
  cost_per_additional_person: number;

  @ApiProperty()
  extra_people: number;

  @ApiProperty()
  latitude: number;

  @ApiProperty()
  longitude: number;

  @ApiProperty()
  province_id: number;

  @ApiProperty()
  city_id: number;

  @ApiProperty()
  area: string;

  @ApiProperty({ type: "boolean" })
  is_timed: boolean;

  @ApiProperty({ default: "2024-08-07 00:00:00 || null" })
  expired_at: any;

  @ApiProperty({ type: AdItem, isArray: true })
  items: AdItem[];
}

export class UpdateExpiredAd {
  client_id: number;

  @ApiProperty()
  adId: number;

  @ApiProperty({ default: "2024-08-07 00:00:00 || null" })
  expired_at: any;
}
