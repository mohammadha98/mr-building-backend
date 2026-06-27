import { Injectable } from "@nestjs/common";

@Injectable()
export default class WebinarTransformer {
  public transform(webinar: any) {
    return {
      id: webinar.id,
      title: webinar.title,
      description: webinar.description,
      type: webinar.type,
      tag: webinar.tag,
      event_link: webinar.event_link,
      status: webinar.status,
      proceeding: webinar.proceeding, // صورتجلسه به صورت text
      guest_count: webinar.guest_count,
      guest_access: webinar.guest_access,
      created_at: webinar.created_at,
      started_at: webinar.started_at,
      start_time: webinar.start_time,
      end_time: webinar.end_time,
    };
  }

  public collection(webinars: any[]) {
    return webinars.map((webinar) => this.transform(webinar));
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
