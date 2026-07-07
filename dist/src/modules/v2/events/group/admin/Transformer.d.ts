export default class EventsGroupsTransformer {
    transform(group: any): {
        id: any;
        title: any;
        tag: any;
        event_link: any;
    };
    collection(groups: any[]): {
        id: any;
        title: any;
        tag: any;
        event_link: any;
    }[];
    loginInfo(client: any): {
        username: any;
        password: any;
    };
}
