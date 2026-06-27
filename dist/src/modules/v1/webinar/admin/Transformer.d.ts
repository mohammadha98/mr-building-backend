export default class WebinarTransformer {
    transform(webinar: any): {
        id: any;
        title: any;
        description: any;
        type: any;
        tag: any;
        event_link: any;
        status: any;
        proceeding: any;
        guest_count: any;
        guest_access: any;
        created_at: any;
        started_at: any;
        start_time: any;
        end_time: any;
    };
    collection(webinars: any[]): {
        id: any;
        title: any;
        description: any;
        type: any;
        tag: any;
        event_link: any;
        status: any;
        proceeding: any;
        guest_count: any;
        guest_access: any;
        created_at: any;
        started_at: any;
        start_time: any;
        end_time: any;
    }[];
    guestTransform(guest: any): {
        client_id: any;
        userid: any;
        display_name: any;
        phone: any;
        role: any;
    };
    guestCollection(guests: any[]): {
        client_id: any;
        userid: any;
        display_name: any;
        phone: any;
        role: any;
    }[];
}
