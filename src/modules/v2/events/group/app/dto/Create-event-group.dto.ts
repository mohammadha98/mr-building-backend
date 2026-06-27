import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CreateEventGroupDto {
  @IsOptional()
  user_id: number;
  guest_access: number;

  @IsOptional()
  slug: string;

  @ApiProperty({ name: "title", description: "عنوان گروه" })
  @IsString()
  title: string;

  @ApiProperty({ name: "tag", description: "رنگ را ارسال کنید" })
  @IsString()
  tag: string;
}
