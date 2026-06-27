import { Injectable } from "@nestjs/common";

@Injectable()
export default class RealEstateAgentsTransformer {
  public transform(item: any) {
    return {
      id: item.id,
      client_id: item.client_id,
      name: item.name,
      avatar: item.avatar
        ? `${process.env.APP_CONTENT_PATH}/estate-agents/avatars/${item.avatar}`
        : "",
      license: item.license
        ? `${process.env.APP_CONTENT_PATH}/estate-agents/licenses/${item.license}`
        : "",
      license_status: item.license_status,
      permissions: item.permissions,
      status: item.status,
      score: item.score,
      number_of_ads: item.published_count,
      province: item.province,
      city: item.city,
      client: this.clientInfo(item.client),
      created_at: item.created_at,
    };
  }

  public collection(items: any[]) {
    return items.map((item) => this.transform(item));
  }

  private clientInfo(item: any) {
    return {
      id: item.id,
      name: item.name + " " + item.surname,
      phone: item.phone,
    };
  }
}
