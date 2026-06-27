import { IsMobilePhone, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RegisterAuthDto {
  @IsString({ message: "فرمت شماره موبایل صحیح نمیباشد." })
  // @IsMobilePhone("fa-IR")
  @ApiProperty()
  phone: string;
}
