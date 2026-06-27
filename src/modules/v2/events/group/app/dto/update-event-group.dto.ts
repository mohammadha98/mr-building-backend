import { ApiProperty } from "@nestjs/swagger";
import { IsNumberString, IsOptional, IsString } from "class-validator";
import EventRoomTypes from "src/commons/contracts/EventRoomTypes";
import WebinarTypes from "src/modules/v2/webinar/contracts/WebinarTypes";

export class UpdateEventGroupDto {
  user_id: number;
  webinar_provider_id: number;
  guest_access?: number;
  guest_count?: number;
  slug: string;

  @ApiProperty()
  @IsNumberString()
  group_id: number;

  @ApiProperty({ name: "title", description: "عنوانگروه " })
  @IsString()
  title: string;

  @ApiProperty({ name: "tag", description: "رنگ را ارسال کنید" })
  @IsString()
  tag: string;
}
