import { UpdateWebinarDto } from "src/modules/v1/webinar/app/dto/update-webinar.dto";
export default class AlocomWebinarProvider {
    private readonly endpoint;
    private readonly username;
    private readonly password;
    private token;
    private serviceInfo;
    private readonly webService;
    constructor();
    login(): Promise<boolean | void>;
    registerUser(user: any): Promise<void | import("axios").AxiosResponse<any, any>>;
    updateUser(userInfo: any): Promise<void | import("axios").AxiosResponse<any, any>>;
    removeUser(agentUser: any): Promise<void | import("axios").AxiosResponse<any, any>>;
    getActiveService(): Promise<boolean | void>;
    createNewEvent(eventInfo: any): Promise<any>;
    addUsersToEvent(event_id: number, users: any): Promise<any>;
    deleteWebinar(webinar_id: number): Promise<void>;
    getEventInfo(webinar_id: number): Promise<false | void | import("axios").AxiosResponse<any, any>>;
    updateWebinar(werbinarInfo: UpdateWebinarDto): Promise<boolean | void | import("axios").AxiosResponse<any, any>>;
    private generateTimeStamp;
}
