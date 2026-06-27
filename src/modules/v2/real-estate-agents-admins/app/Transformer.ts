import { Injectable } from "@nestjs/common";

@Injectable()
export default class RealEstateAdminsTransformer {
  public transform(item: any) {
    return {
      id: item.id,
      ...this.clientInfo(item.client),
      color: item.color,
      ...this.agentInfo(item.real_estate_agent),
      permissions: item.permissions,
    };
  }

  public collection(items: any[]) {
    return items.map((item) => this.transform(item));
  }

  private clientInfo(client: any) {
    return {
      name: client.name + " " + client.surname,
      phone: client.phone,
    };
  }

  private agentInfo(item: any) {
    return {
      agent_id: item.id,
      agent_name: item.name,
      agent_number_of_ads: item.number_of_ads,
      agent_score: item.score,
      agent_avatar: item.avatar
        ? `${process.env.APP_CONTENT_PATH}/estate-agents/avatars/${item.avatar}`
        : "",
      province: item.province.name,
    };
  }
}
