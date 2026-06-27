import { Injectable } from "@nestjs/common";
import ITransformer from "src/commons/contracts/ITransformer";

@Injectable()
export default class MissionsTransformer implements ITransformer<any> {
  constructor() {}

  public transform(client: any) {
    return {
      id: client.id,
      title: client.title,
      description: client.description,
      key: client.key,
      point: client.point,
      status: client.status,
      created_at: client.created_at,
      is_limited: client.is_limited,
      number_of_hours: client.number_of_hours,
      number_of_used: client.number_of_used,
    };
  }

  public collection(items: any[]) {
    return items.map((item) => this.transform(item));
  }
}
