import { ApiProperty } from "@nestjs/swagger";
import { ReasonAdTypes } from "../enums/ReasonAdTypes";
import { IsEnum } from "class-validator";

export class saveReasonsForRejectingAdsDto {
  user_id: number;

  @ApiProperty({ required: false })
  item_id: string;

  @ApiProperty()
  text: string;

  @ApiProperty({ enum: ReasonAdTypes })
  @IsEnum(ReasonAdTypes)
  type: ReasonAdTypes;
}
