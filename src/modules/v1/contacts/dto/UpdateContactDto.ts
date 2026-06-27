import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateContactDto } from "./CreateContactDto";
import { IsString, IsMobilePhone, IsNumberString } from "class-validator";

export class UpdateContactDto {
  client_id: number;
  contact_id: number;
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  surname: string;

  @ApiProperty()
  @IsMobilePhone("fa-IR")
  phone: string;

  username: string;
  password: string;

  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsNumberString()
  webinar_provider_id: string;
}
