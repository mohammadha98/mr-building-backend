import { Injectable } from "@nestjs/common";

@Injectable()
export default class EventsGroupsTransformer {
  public transform(group: any, client_info: any) {
    return {
      id: group.id,
      title: group.title,
      tag: group.tag,
      event_link: group.event_link,
      login_info: this.loginInfo(client_info),
    };
  }

  public collection(groups: any[], client_info: any) {
    return groups.map((group) => this.transform(group, client_info));
  }

  public loginInfo(client: any) {
    return {
      username: client.username,
      password: client.password,
    };
  }
}
