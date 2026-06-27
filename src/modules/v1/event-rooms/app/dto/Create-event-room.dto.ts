import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import EventRoomTypes from "src/commons/contracts/EventRoomTypes";

export class CreateEventRoomDto {
  @IsOptional()
  user_id: number;
  guest_access: number;

  @IsOptional()
  slug: string;

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
