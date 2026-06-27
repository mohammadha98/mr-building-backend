import { PartialType } from "@nestjs/swagger";
import { CreateChatInMarketplaceDto } from "./create-chat-in-marketplace.dto";

export class UpdateChatMarketplaceDto extends PartialType(
  CreateChatInMarketplaceDto
) {}
