import { PartialType } from "@nestjs/swagger";
import { CreateRealEstateAgentsCommentDto } from "./create-real-estate-agents-comment.dto";

export class UpdateRealEstateAgentsCommentDto extends PartialType(
  CreateRealEstateAgentsCommentDto
) {}
