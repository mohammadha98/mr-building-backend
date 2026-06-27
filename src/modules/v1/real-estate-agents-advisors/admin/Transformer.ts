import { Injectable } from "@nestjs/common";
import * as moment from "moment";
import * as jmoment from "jalali-moment";
import statuses from "src/commons/contracts/Statuses";
jmoment().locale("fa").format("YYYY/M/D");

@Injectable()
export default class RealEstateAdvisorTransformer {
  public transform(item: any) {
    return {
      id: item.id,
      name: this.clientInfo(item.client).name,
      phone: item.phone,
      validate_phone: item.validate_phone,
      avatar: item.avatar
        ? `${process.env.APP_CONTENT_PATH}/estate-agents-advisors/avatars/${item.avatar}`
        : "",
      score: item.score,
      biography: item.biography,
      comment_visibility: item.comment_visibility,
      number_of_ads: item.number_of_ads || 0,
      total_customer: item.total_customers || 0,
      status: item.status,
      agent_info: this.getAgentInfo(item.real_estate_agent),
    };
  }

  public collection(items: any[]) {
    return items.map((item) => this.transform(item));
  }

  public transformActiveArea(item: any) {
    return {
      id: item.id,
      title: item.title,
    };
  }

  public collectionActiveArea(items: any[]) {
    return items.map((item) => this.transformActiveArea(item));
  }

  public collectionFilteredWord(items: any[]) {
    return items.map((item) => this.transformerFilteredWord(item));
  }

  public transformerFilteredWord(item: any) {
    return {
      id: item.id,
      title: item.title,
    };
  }

  public transformComments(item: any) {
    if (!item) {
      return {
        id: -1,
        agent_id: -1,
        comment: "",
        score: -1,
        status: statuses.pending,
        client: {},
        created_at: { day: 0, month: "", year: 0 },
      };
    }

    return {
      id: item.id,
      agent_id: item.agent_id,
      comment: item.comment,
      score: item.score,
      status: item.status,
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
      phone: client.phone,
    };
  }
  private getAgentInfo(item: any) {
    return {
      id: item.id,
      name: item.name,
    };
  }

  private calculCreatedAt(created_at: string) {
    const currentYear = Number(
      jmoment(new Date(Date.now())).locale("fa").format("YYYY")
    );
    const day = Number(jmoment(created_at).locale("fa").format("DD"));
    const month = jmoment(created_at).locale("fa").format("MMMM");
    const year = Number(jmoment(created_at).locale("fa").format("YYYY"));

    return {
      day,
      month,
      year,
    };
  }
}
