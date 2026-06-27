import { PartialType } from "@nestjs/swagger";
import { CreateChatRealEstateDto } from "./create-chat-real-estate.dto";

export class UpdateChatRealEstateDto extends PartialType(
  CreateChatRealEstateDto
) {}
