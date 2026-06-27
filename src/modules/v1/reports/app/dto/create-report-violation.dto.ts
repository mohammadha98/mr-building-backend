import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import ViolationTypes from "src/commons/contracts/ViolationTypes";

export class CreateReportViolationDto {
  client_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  item_id: string;

  @ApiProperty({ enum: ViolationTypes, default: ViolationTypes.webinars })
  @IsNotEmpty()
  @IsString()
  type: string;
}
