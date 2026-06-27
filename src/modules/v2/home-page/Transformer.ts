import { Injectable } from "@nestjs/common";
import * as moment from "moment";
import * as jmoment from "jalali-moment";
import ForceUpdateTransformer from "src/modules/v2//force-update/admin/Transformer";
import RealEstateAgentsTransformer from "src/modules/v2//real-estate-agents/app/Transformer";
import RealEstateAdvisorTransformer from "src/modules/v2//real-estate-agents-advisors/app/Transformer";
import RealEstateAdminsTransformer from "src/modules/v2//real-estate-agents-admins/app/Transformer";
jmoment().locale("fa").format("YYYY/M/D");

@Injectable()
export default class HomePageTransformer {
  constructor(
    private readonly forceUpdateTransformer: ForceUpdateTransformer,
    private readonly realEstateAgentsTransformer: RealEstateAgentsTransformer,
    private readonly realEstateAdvisorTransformer: RealEstateAdvisorTransformer,
    private readonly realEstateAdminsTransformer: RealEstateAdminsTransformer
  ) {}

  public transform(item: any) {
    console.log("has_update ", item.has_update);
    return {
      token: item.token,
      total_score: item.total_score,
      user_key: item.user_key,
      number_of_unread_messages: item.number_of_unread_messages,
      blocked_account_ids: item.blocked_account_ids,
      blocked_participant_ids: item.blocked_participant_ids,
      has_update: item.has_update,
      force_update: this.forceUpdateTransformer.transform(item.force_update),
      roles: item.roles,
      estate_agent_info: item.estate_agent_info
        ? this.realEstateAgentsTransformer.transform(item.estate_agent_info)
        : null,
      advisor_info: item.advisor_info
        ? this.realEstateAdvisorTransformer.transform(item.advisor_info)
        : null,
      operator: item.operator,
      slider: item.slider,
      slider_services: item.slider_services,
      banner_home: item.banner_home,
      banner_services: item.banner_services,
    };
  }

  public collection(items: any[]) {
    return items.map((item) => this.transform(item));
  }
}
