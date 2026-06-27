export default class EventRoomsTransformer {
    transform(webinar: any, client_info: any): {
        id: any;
        is_owner: boolean;
        title: any;
        type: any;
        tag: any;
        guest_count: any;
        event_link: any;
        status: any;
        created_at: any;
        login_info: {
            username: any;
            password: any;
        };
    };
    collection(webinars: any[], client_info: any): {
        id: any;
        is_owner: boolean;
        title: any;
        type: any;
        tag: any;
        guest_count: any;
        event_link: any;
        status: any;
        created_at: any;
        login_info: {
            username: any;
            password: any;
        };
    }[];
    loginInfo(client: any): {
        username: any;
        password: any;
    };
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
