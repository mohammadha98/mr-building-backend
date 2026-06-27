import { PartialType } from "@nestjs/swagger";
import { CreateRealEstateAgentsAdvisorDto } from "./create-real-estate-agents-advisor.dto";

export class UpdateRealEstateAgentsAdvisorDto extends PartialType(
  CreateRealEstateAgentsAdvisorDto
) {}
