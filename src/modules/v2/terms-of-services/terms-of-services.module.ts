import { Module } from "@nestjs/common";
import { TermsOfServicesAppModule } from "./app/terms-of-services.module";

@Module({
  imports: [TermsOfServicesAppModule],
})
export class TermsOfServicesModule {}
