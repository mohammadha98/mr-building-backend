import { ApiProperty } from "@nestjs/swagger";
import { IsNumberString, IsOptional, IsString } from "class-validator";
import EventRoomTypes from "src/commons/contracts/EventRoomTypes";

export class UpdateEventRoomDto {
  user_id: number;
  webinar_provider_id: number;
  guest_access?: number;
  guest_count?: number;
  slug: string;

  @ApiProperty()
  @IsNumberString()
  event_room_id: number;

  @ApiProperty({ name: "title", description: "عنوان اتاق جلسه" })
  @IsString()
  title: string;

  @ApiProperty({
    enum: EventRoomTypes,
    name: "type",
    type: "string",
    description: "نوع اتاق جلسه: خصوصی",
    example: "private",
  })
  @IsString()
  type: string;

  @ApiProperty({ name: "tag", description: "رنگ را ارسال کنید" })
  @IsString()
  tag: string;
}
