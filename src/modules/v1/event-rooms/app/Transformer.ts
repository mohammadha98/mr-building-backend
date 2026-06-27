import { Injectable } from "@nestjs/common";

@Injectable()
export default class EventRoomsTransformer {
  public transform(webinar: any, client_info: any) {
    return {
      id: webinar.id,
      is_owner: webinar.owner_id === client_info.id,
      title: webinar.title,
      type: webinar.type,
      tag: webinar.tag,
      guest_count: webinar.guest_count,
      event_link: webinar.event_link,
      status: webinar.status,
      created_at: webinar.created_at,
      login_info: this.loginInfo(client_info),
    };
  }

  public collection(webinars: any[], client_info: any) {
    return webinars.map((webinar) => this.transform(webinar, client_info));
  }

  public loginInfo(client: any) {
    return {
      username: client.username,
      password: client.password,
    };
  }

  public guestTransform(guest: any) {
    return {
      client_id: guest.client_id,
      userid: guest.userid,
      display_name: guest.display_name,
      phone: guest.phone,
      role: guest.role,
    };
  }

  public guestCollection(guests: any[]) {
    if (guests) {
      return guests.map((guest) => this.guestTransform(guest));
    }
    return [];
  }
}
