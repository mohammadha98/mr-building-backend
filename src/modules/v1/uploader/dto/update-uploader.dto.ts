import { PartialType } from "@nestjs/swagger";
import { CreateUploaderDto } from "./create-uploader.dto";

export class UpdateUploaderDto extends PartialType(CreateUploaderDto) {}
