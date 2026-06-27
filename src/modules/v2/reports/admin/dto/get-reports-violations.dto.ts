import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumberString, IsString } from "class-validator";
import ViolationTypes from "src/commons/contracts/ViolationTypes";

export class GetReportsViolationsDto {
  user_id: string;

  @ApiProperty({ enum: ViolationTypes, default: ViolationTypes.webinars })
  @IsNotEmpty()
  @IsString()
  type: string;

  @ApiProperty()
  @IsNumberString()
  @IsNotEmpty()
  page: number;

  @ApiProperty()
  @IsNumberString()
  @IsNotEmpty()
  per_page: number;
}
