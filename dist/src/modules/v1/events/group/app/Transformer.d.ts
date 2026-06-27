export default class EventsGroupsTransformer {
    transform(group: any, client_info: any): {
        id: any;
        title: any;
        tag: any;
        event_link: any;
        login_info: {
            username: any;
            password: any;
        };
    };
    collection(groups: any[], client_info: any): {
        id: any;
        title: any;
        tag: any;
        event_link: any;
        login_info: {
            username: any;
            password: any;
        };
    }[];
    loginInfo(client: any): {
        username: any;
        password: any;
    };
}
