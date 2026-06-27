import { Injectable } from "@nestjs/common";
import ITransformer from "src/commons/contracts/ITransformer";

@Injectable()
export default class ReferralCodeTransformer implements ITransformer<any> {
  constructor() {}

  public transform({ total, point }) {
    return {
      total: {
        client: total.clients,
        estate_agent: total.estate_agent,
        advisor: total.advisor,
        admin: total.admin,
        operator_estate_agent: total.operator_estate_agent,
      },
      point: point,
    };
  }

  public collection(items: any[]) {
    return items.map((item) => this.transform(item));
  }

  public userTransform(item: any, point: number) {
    return {
      client_id: item.client_id,
      client_name: item.client_name,
      client_phone: item.client_phone,
      client_roles: item.client_roles,
      referral_id: item.referral_id,
      referral_code: item.referral_code,
      number_of_sub_categories: item.number_of_sub_categories,
      point: point,
    };
  }
  public userCollection(items: any[], point: number) {
    return items.map((item) => this.userTransform(item, point));
  }
}
