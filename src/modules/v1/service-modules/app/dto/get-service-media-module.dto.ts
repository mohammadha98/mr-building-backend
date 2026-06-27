import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import ServicesTypes from "src/commons/contracts/ServicesTypes";

export class GetServicesMediaDto {
  user_id: number;

  @ApiProperty({ enum: ServicesTypes, default: ServicesTypes.general })
  @IsEnum(ServicesTypes)
  type: ServicesTypes;
}
