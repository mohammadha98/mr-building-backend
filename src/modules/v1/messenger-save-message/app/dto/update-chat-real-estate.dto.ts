import { PartialType } from "@nestjs/swagger";
import { CreateChatMessenger } from "./create-chat.dto";

export class UpdateChatRealEstateDto extends PartialType(CreateChatMessenger) {}
