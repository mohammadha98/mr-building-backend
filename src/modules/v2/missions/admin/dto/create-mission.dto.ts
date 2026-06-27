import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumberString, IsString } from "class-validator";
import MissionTypes from "src/commons/contracts/MissionTypes";

export class CreateMissionDto {
  user_id: number;

  @ApiProperty({ enum: MissionTypes, default: MissionTypes.register })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsNumberString()
  @IsNotEmpty()
  point: number;

  @ApiProperty()
  is_limited: boolean;

  @ApiProperty({ default: 0 })
  number_of_hours: number;
}
