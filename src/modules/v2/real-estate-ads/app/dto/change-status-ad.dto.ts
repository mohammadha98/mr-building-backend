import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNumberString } from "class-validator";
import PriceStatuses from "src/commons/contracts/PriceStatuses";
import Statuses from "src/commons/contracts/Statuses";

export class APP_ChangeStatusAdDto {
  user_id: number;

  @ApiProperty()
  @IsNumberString()
  item_id: string;

  @ApiProperty({
    enum: Statuses,
    default: Statuses.approved,
    example: `${Statuses.approved}`,
  })
  @IsEnum(Statuses)
  status: string;

  @ApiProperty({ isArray: true, type: "string" })
  reasons: string[];

  @ApiProperty({
    enum: PriceStatuses,
    default: PriceStatuses.low,
    required: false,
  })
  // @IsEnum(PriceStatuses)
  price_status: string;
}
