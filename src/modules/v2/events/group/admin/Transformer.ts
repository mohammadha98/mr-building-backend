import { Injectable } from "@nestjs/common";

@Injectable()
export default class EventsGroupsTransformer {
  public transform(group: any) {
    return {
      id: group.id,
      title: group.title,
      tag: group.tag,
      event_link: group.event_link,
      // login_info: this.loginInfo(client_info),
    };
  }

  public collection(groups: any[]) {
    return groups.map((group) => this.transform(group));
  }

  public loginInfo(client: any) {
    return {
      username: client.username,
      password: client.password,
    };
  }
}
