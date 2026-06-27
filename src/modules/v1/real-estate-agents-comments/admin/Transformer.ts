import { Injectable } from "@nestjs/common";
import ITransformer from "src/commons/contracts/ITransformer";
import * as moment from "moment";
import * as jmoment from "jalali-moment";
jmoment().locale("fa").format("YYYY/M/D");

@Injectable()
export default class RealEstateAgentsCommentsTransformer
  implements ITransformer<any>
{
  public transform(item: any) {
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
      status: item.status,
      client: this.clientInfo(item.client),
      real_estate_agent: this.realEstateAgentInfo(item.real_estate_agent),
      created_at: this.calculCreatedAt(item.created_at),
    };
  }

  public collection(items: any[]) {
    return items.map((item) => this.transform(item));
  }

  private clientInfo(client: any) {
    return {
      id: client.id,
      name: client.name + " " + client.surname,
    };
  }

  private realEstateAgentInfo(item: any) {
    return {
      id: item.id,
      name: item.name,
      avatar: item.avatar
        ? `${process.env.APP_CONTENT_PATH}/estate-agents/avatars/${item.avatar}`
        : null,
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
