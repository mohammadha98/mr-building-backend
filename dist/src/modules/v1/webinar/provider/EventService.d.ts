import { CreateWebinarDto } from "../app/dto/create-webinar.dto";
export default class EventService {
    private readonly defaultProvider;
    constructor();
    login(): Promise<boolean | void>;
    registerUser(user: any): Promise<void | import("axios").AxiosResponse<any, any>>;
    createNewEvent(eventInfo: CreateWebinarDto): Promise<any>;
    addUsersToEvent(event_id: number, users: any): Promise<any>;
    deleteWebinar(webinar_id: number): Promise<void>;
    updateWebinar(werbinarInfo: any): Promise<boolean | void | import("axios").AxiosResponse<any, any>>;
    updateUser(userInfo: any): Promise<void | import("axios").AxiosResponse<any, any>>;
    removeUser(agentUser: any): Promise<void | import("axios").AxiosResponse<any, any>>;
}
