import { Injectable } from "@nestjs/common";

@Injectable()
export default class ClientTransformer {
  constructor() {}

  public transform(client: any) {
    if (!client) {
      return {
        id: -1,
        provider_id: -1,
        name: "",
        surname: "",
        phone: "",
        user_name: "",
        email: "",
        has_update: false,
        avatar: "",
        token: "",
        user_key: "",
        referral_code: "",
        province: {},
        city: {},
      };
    }

    return {
      id: client.id,
      provider_id: client.webinar_provider_id ? client.webinar_provider_id : -1,
      name: client.name,
      surname: client.surname,
      phone: client.phone,
      user_name: client.username,
      email: client.email,
      has_update: client.has_update,
      avatar: client.avatar
        ? `${process.env.APP_CONTENT_PATH}/clients/avatars/${client.avatar}`
        : "",
      token: client?.token,
      user_key: client?.key,
      referral_code: client?.referralCode,
      province: client.province ? this.getProvinceInfo(client.province) : {},
      city: client.city ? this.getProvinceInfo(client.city) : {},
    };
  }

  public clientProfileTransformer(result: any) {
    return {
      client_info: this.transform(result.client_info),
    };
  }

  public gifTransformer(item: any) {
    return {
      id: item.id,
      file: `${process.env.APP_CONTENT_PATH}/clients/${item.key}/gif/${item.file}`,
    };
  }

  public gifCollection(items: any[]) {
    return items.map((item) => this.gifTransformer(item));
  }

  public getProvinceInfo(item: any) {
    return {
      id: item.id,
      name: item.name,
    };
  }
}
