import { Injectable } from "@nestjs/common";
import * as moment from "moment";
import * as jmoment from "jalali-moment";
jmoment().locale("fa").format("YYYY/M/D");

@Injectable()
export default class RealEstateAgentsTransformer {
  public transform(item: any) {
    return {
      id: item.id,
      client_id: item.client_id,
      name: item.name,
      phone: item.phone,
      validate_phone: item.validate_phone,
      avatar: item.avatar
        ? `${process.env.APP_CONTENT_PATH}/estate-agents/avatars/${item.avatar}`
        : "",
      license: item.license
        ? `${process.env.APP_CONTENT_PATH}/estate-agents/licenses/${item.license}`
        : "",
      license_status: item.license_status,
      status: item.status,
      score: item.score,
      number_of_ads: item.number_of_ads,
      province: item.province,
      city: item.city,
      channel: item.channel ? item.channel : null,
    };
  }

  public collection(items: any[]) {
    return items.map((item) => this.transform(item));
  }

  public transformComments(item: any) {
    if (!item) {
      return {
        id: -1,
        agent_id: -1,
        comment: "",
        score: -1,
        client: {},
        created_at: "",
      };
    }

    return {
      id: item.id,
      agent_id: item.agent_id,
      comment: item.comment,
      score: item.score,
      client: this.clientInfo(item.client),
      created_at: this.calculCreatedAt(item.created_at),
    };
  }

  public collectionComments(items: any[]) {
    return items.map((item) => this.transformComments(item));
  }

  private clientInfo(client: any) {
    return {
      id: client.id,
      name: client.name + " " + client.surname,
    };
  }

  private calculCreatedAt(created_at: string) {
    const currentYear = Number(
      jmoment(new Date(Date.now())).locale("fa").format("YYYY")
    );

    const day = Number(jmoment(created_at).locale("fa").format("DD"));
    const month = jmoment(created_at).locale("fa").format("MMMM");
    const year = Number(jmoment(created_at).locale("fa").format("YYYY"));

    let info = "";
    if (Number(currentYear) === Number(year)) {
      info = month + " " + day.toString();
    } else {
      info = ` ${year} ${month} ${day} `;
    }
    return info;
  }
}
