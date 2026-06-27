import { ApiProperty } from "@nestjs/swagger";
import { IsNumberString } from "class-validator";

export class EventGroupPaginationDto {
  client_id: number;

  @ApiProperty({ default: 1 })
  @IsNumberString()
  page: string;

  @ApiProperty({ default: 12 })
  @IsNumberString()
  per_page: string;
}
