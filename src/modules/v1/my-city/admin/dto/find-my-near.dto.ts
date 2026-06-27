import { ApiProperty } from "@nestjs/swagger";
import { Length } from "class-validator";

export class MayNearDto {
  @ApiProperty({ type: Number })
  distanceInMeters: number;

  @ApiProperty({ type: Number })
  latitude: number;

  @ApiProperty({ type: Number })
  longitude: number;
}
