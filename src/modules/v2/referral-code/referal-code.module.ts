import { Module } from "@nestjs/common";
import { ReferralCodeAppModule } from "./app/referral-code.module";

@Module({
  imports: [ReferralCodeAppModule],
})
export class ReferalCodeModule {}
