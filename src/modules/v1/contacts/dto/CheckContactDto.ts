import { ApiProperty } from "@nestjs/swagger";
import { IsMobilePhone, IsString } from "class-validator";

export class ContactDTO {
  @ApiProperty()
  phone: string;
}

export class CheckContactDto {
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
