import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateContactDto } from "./CreateContactDto";
import { IsString, IsMobilePhone, IsNumberString } from "class-validator";

export class RemoveContactDto {
  client_id: number;
  @ApiProperty()
  @IsNumberString()
  contact_id: string;
}
