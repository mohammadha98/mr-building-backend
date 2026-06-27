export default class WebinarTransformer {
    transform(webinar: any, client_info: any): {
        id: any;
        is_owner: boolean;
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
        login_info: {
            username: any;
            password: any;
        };
    };
    collection(webinars: any[], client_info: any): {
        id: any;
        is_owner: boolean;
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
