import { PartialType } from "@nestjs/swagger";
import { CreateServiceMediaDto } from "./create-service-media-module.dto";

export class UpdateServiceModuleDto extends PartialType(
  CreateServiceMediaDto
) {}
