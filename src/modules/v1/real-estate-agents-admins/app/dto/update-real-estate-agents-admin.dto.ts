import { PartialType } from "@nestjs/swagger";
import { CreateRealEstateAgentsAdminDto } from "./create-real-estate-agents-admin.dto";

export class UpdateRealEstateAgentsAdvisorDto extends PartialType(
  CreateRealEstateAgentsAdminDto
) {}
