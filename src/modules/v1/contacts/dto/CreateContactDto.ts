import { ApiProperty } from "@nestjs/swagger";
import { IsMobilePhone, IsString } from "class-validator";

export class ContactDTO {
  @ApiProperty()
  display_name: string;

  @ApiProperty()
  phone: string;
}

export class CreateContactDto {
  @ApiProperty({
    type: ContactDTO,
    isArray: true,
  })
  contacts: ContactDTO[];

  client_id: number;
  webinar_provider_id: number;
  display_name: string;
  password: string;
  email: string;
}
