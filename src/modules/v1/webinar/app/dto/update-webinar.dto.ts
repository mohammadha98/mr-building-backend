import { ApiProperty } from "@nestjs/swagger";
import { IsNumberString, IsOptional, IsString } from "class-validator";
import WebinarTypes from "src/modules/v1/webinar/contracts/WebinarTypes";

export class UpdateWebinarDto {
  user_id: number;
  webinar_provider_id: number;

  @ApiProperty()
  @IsNumberString()
  webinar_id: number;

  @IsOptional()
  slug: string;

  @ApiProperty({ name: "title", description: "عنوان وبینار" })
  @IsString()
  title: string;

  @ApiProperty({ name: "description", description: "توضیحات وبینار" })
  @IsString()
  description: string;

  @ApiProperty({
    enum: WebinarTypes,
    name: "type",
    type: "string",
    description: "نوع وبینار: عمومی - خصوصی",
  })
  @IsString()
  type: string;

  @ApiProperty({ name: "tag", description: "رنگ را ارسال کنید" })
  @IsString()
  tag: string;

  @ApiProperty({
    name: "guest_access",
    description:
      "آیا کاربر مهمان اجازه ورود به وبینار را دارد؟ در صورتیکه اجازه دارد عدد 1 و در غیر این صورت عدد 0",
    enum: [0, 1],
  })
  guest_access?: number;

  @ApiProperty({
    name: "guest_count",
    description:
      "محدودیت کاربران مهمان (در صورتیکه محدودیتی ندارد عدد 0 ارسال شود.)",
    default: 0,
    example: 0,
  })
  guest_count?: number;

  @ApiProperty({
    type: "String",
    name: "started_at",
    description: "تاریخ شروع وبینار",
  })
  @IsString()
  started_at: string;

  @ApiProperty({
    type: "String",
    name: "start_time",
    description: "ساعت شروع وبینار",
  })
  @IsString()
  start_time: string;

  @ApiProperty({
    type: "String",
    name: "end_time",
    description: "ساعت پایان وبینار",
  })
  @IsString()
  end_time: string;
}
