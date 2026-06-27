import { PartialType } from "@nestjs/mapped-types";
import { RegisterAuthDto } from "./register-auth.dto";
import {
  IsMobilePhone,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class VerifyAuthDto extends PartialType(RegisterAuthDto) {
  key: string;

  // @IsMobilePhone("fa-IR")
  @IsString({
    message: "شماره موبایل را وارد کنید",
  })
  @IsNotEmpty({ message: "شماره موبایل نمیتواند خالی باشد" })
  @ApiProperty()
  phone: string;

  @ApiProperty()
  code: number;
}
