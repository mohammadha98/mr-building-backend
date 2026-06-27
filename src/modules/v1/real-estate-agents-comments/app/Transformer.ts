import { Injectable } from "@nestjs/common";
import ITransformer from "src/commons/contracts/ITransformer";
import * as moment from "moment";
import statuses from "src/commons/contracts/Statuses";

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

  public collection(items: any[]) {
    return items.map((item) => this.transform(item));
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

    return {
      day,
      month,
      year,
    };
  }
}
