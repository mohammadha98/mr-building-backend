import { CreateWebinarDto } from "../app/dto/create-webinar.dto";
import AlocomWebinarProvider from "./providers/Alocom";

export default class EventService {
  private readonly defaultProvider: AlocomWebinarProvider;
  constructor() {
    this.defaultProvider = new AlocomWebinarProvider();
  }

  // login
  public async login() {
    return await this.defaultProvider.login();
  }

  // registerUser
  public async registerUser(user: any) {
    return await this.defaultProvider.registerUser(user);
  }

  // create new event
  public async createNewEvent(eventInfo: CreateWebinarDto) {
    return await this.defaultProvider.createNewEvent(eventInfo);
  }

  // add user to event whit teacher role
  public async addUsersToEvent(event_id: number, users: any) {
    return await this.defaultProvider.addUsersToEvent(event_id, users);
  }

  // delete event
  public async deleteWebinar(webinar_id: number) {
    return await this.defaultProvider.deleteWebinar(webinar_id);
  }

  // update event
  public async updateWebinar(werbinarInfo: any) {
    return await this.defaultProvider.updateWebinar(werbinarInfo);
  }

  // update user
  public async updateUser(userInfo: any) {
    return await this.defaultProvider.updateUser(userInfo);
  }

  // remove user
  public async removeUser(agentUser: any) {
    return await this.defaultProvider.removeUser(agentUser);
  }
}
