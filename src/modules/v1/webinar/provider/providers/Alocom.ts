import WebService from "src/modules/services/WebService";
import { UpdateWebinarDto } from "src/modules/v1/webinar/app/dto/update-webinar.dto";

export default class AlocomWebinarProvider {
  private readonly endpoint: string;
  private readonly username: string;
  private readonly password: string;
  private token: string;
  private serviceInfo: { agent_service_id: number; max_online_user: number };

  private readonly webService: WebService;
  constructor() {
    this.endpoint = "https://pnlapi.alocom.co";
    this.username = "persian_gulf";
    this.password = "test@123";
    this.webService = new WebService();

    //     bind
    this.registerUser = this.registerUser.bind(this);
  }

  async login() {
    console.log("*** Login In Alocom ***");
    const value = {
      username: this.username,
      password: this.password,
      "remembr me": 1,
    };

    try {
      return await this.webService
        .post(`${this.endpoint}/api/v1/auth/login`, value)
        .then(async (response) => {
          this.token = `Bearer ${response.data.token}`;
          // get agent service
          await this.getActiveService();
          return true;
        })
        .catch((error) => {
          console.log("*** Error Login in Alocom  *** ");
          console.log(error.response.status);
        });
    } catch (error) {
      console.log("*** Catch Error Login in Alocom  *** ");
      console.log(error.response.status);
      return false;
    }
  }

  public async registerUser(user: any) {
    console.log(user);
    return await this.login().then(async (data) => {
      return await this.webService
        .post(`${this.endpoint}/api/v1/agents/users`, user, {
          headers: {
            Authorization: this.token,
          },
        })
        .then((data) => {
          return data;
        })
        .catch(async (error) => {
          console.log("*** Error register User in Alocom  *** ");
          console.log(error.response.data);
        });
    });
  }

  public async updateUser(userInfo: any) {
    return await this.login().then(async (data) => {
      return await this.webService
        .patch(
          `${this.endpoint}/api/v1/agents/users/${userInfo.agentUser}`,
          userInfo,
          {
            headers: {
              Authorization: this.token,
            },
          }
        )
        .then((data) => {
          return data;
        })
        .catch(async (error) => {
          console.log("*** Error Update User in Alocom  *** ");
          console.log(error.response.status);
        });
    });
  }

  // remove user
  public async removeUser(agentUser: any) {
    return await this.login().then(async (data) => {
      return await this.webService
        .delete(`${this.endpoint}/api/v1/agents/users/${agentUser}`, {
          headers: {
            Authorization: this.token,
          },
        })
        .then((data) => {
          return data;
        })
        .catch(async (error) => {
          console.log("*** Error Update User in Alocom  *** ");
          console.log(error.response.status);
        });
    });
  }

  // get Active Service
  public async getActiveService() {
    console.log("*** getActiveService ***");
    return await this.webService
      .get(`${this.endpoint}/api/v1/agents/services/active-services`, {
        headers: {
          Authorization: this.token,
        },
      })
      .then(async (data) => {
        if (data.status === 200) {
          const result = data.data.activeServices[0];
          // save service info
          this.serviceInfo = {
            agent_service_id: result.agent_service_id,
            max_online_user: result.max_online_user,
          };
          return;
        }
      })
      .catch(async (error) => {
        console.log("*** Error getActiveService in Alocom  *** ");
        console.log("Catch Error ");
        console.log(error.response.status);

        if (error.response.status === 401) {
          // console.log("*** Expired Token ***");
          await this.login();
          await this.getActiveService();
          return;
        }
        return false;
      });
  }

  // create new event
  public async createNewEvent(eventInfo: any) {
    await this.login();

    // prepare webinar data
    const data = {
      title: eventInfo.title + "-" + this.generateTimeStamp(),
      agent_service_id: this.serviceInfo.agent_service_id,
      slug: eventInfo.slug,
      max_user: this.serviceInfo.max_online_user,
      status: "1",
      is_unlimited: "1",
      warning_time: 300,
      start_by_admin: 0,
      guest_access: eventInfo.guest_access,
      language: "fa",
    };

    // Created Event in Alocom
    return await this.webService
      .post(`${this.endpoint}/api/v1/agents/events`, data, {
        headers: {
          Authorization: this.token,
        },
      })
      .then((data) => {
        console.log("*** SuccessFully Created Event in Alocom *** ");
        return data.data.event;
      })
      .catch(async (error) => {
        console.log("*** Error Create New Event in Alocom  *** ");
        console.log(error.response.data.errors);
      });
  }

  // add user to event whit teacher role
  public async addUsersToEvent(event_id: number, users: any) {
    console.log("*** add Users To Event ***");

    await this.login();
    return await this.webService
      .post(
        `${this.endpoint}/api/v1/agents/events/${event_id}/add-users`,
        users,
        {
          headers: {
            Authorization: this.token,
          },
        }
      )
      .then((data) => {
        console.log(
          "*** Admin Creattor Webinar Added to Event users with teacher role *** "
        );
        return data.data.event;
      })
      .catch(async (error) => {
        console.log("*** Error add User To Event_teacherRole in Alocom  *** ");
        console.log(error.response.status);
        console.log(error.response.data);
      });
  }

  // delete event
  public async deleteWebinar(webinar_id: number) {
    console.log("*** Delete Webinar in Alocom *** ");
    await this.login();

    await this.webService
      .delete(`${this.endpoint}/api/v1/agents/events/${webinar_id}`, {
        headers: { Authorization: this.token },
      })
      .then((data) => {
        return true;
      })
      .catch(async (error) => {
        // TODO test log
        console.log("*** Error Delete Webinar in Alocom *** ");
        // console.log(error.response);

        // if (error.response.status === 401) {
        //   // console.log("Expired Token");
        //   return await this.login().then(async () => {
        //     await this.deleteWebinar(webinar_id);
        //     return;
        //   });
        // } else {
        //   return false;
        // }
      });
  }

  // get event info
  public async getEventInfo(webinar_id: number) {
    console.log("*** Get Webinar Info from Alocom *** ");
    await this.login();

    return await this.webService
      .get(`${this.endpoint}/api/v1/agents/events/${webinar_id}`, {
        headers: { Authorization: this.token },
      })
      .then((data) => {
        return data;
      })
      .catch(async (error) => {
        console.log("*** Error: Get Event Info *** ");
        console.log(error.response.status);

        if (error.response.status === 401) {
          // console.log("Expired Token");
          return await this.login().then(async () => {
            await this.deleteWebinar(webinar_id);
            return;
          });
        } else {
          return false;
        }
      });
  }
  // update event
  public async updateWebinar(werbinarInfo: UpdateWebinarDto) {
    console.log("*** Update Webinar in Alocom *** ");
    await this.login();

    // prepare update data
    const data = {
      title: werbinarInfo.title + "-" + this.generateTimeStamp(),
      agent_service_id: this.serviceInfo.agent_service_id,
      slug: werbinarInfo.slug,
      max_user: this.serviceInfo.max_online_user,
      status: "1",
      is_unlimited: "1",
      warning_time: 300,
      start_by_admin: 0,
      guest_access: werbinarInfo.guest_access,
      language: "fa",
    };

    return await this.webService
      .patch(
        `${this.endpoint}/api/v1/agents/events/${werbinarInfo.webinar_provider_id}`,
        data,
        {
          headers: { Authorization: this.token },
        }
      )
      .then(async (data) => {
        if (data.status === 200) {
          // get webinar info and send to client
          return await this.getEventInfo(werbinarInfo.webinar_provider_id);
        }
        return data;
      })
      .catch(async (error) => {
        console.log("*** Error in Update Webinar *** ");
        console.log(error.response.status);

        if (error.response.status === 409) {
          return false;
        } else if (error.response.status === 422) {
          return false;
        } else {
          return false;
        }
      });
  }

  private generateTimeStamp() {
    return new Date().getTime().toString();
  }
}
