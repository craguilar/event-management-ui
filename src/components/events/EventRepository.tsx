import { Event } from "./model/Event";
import { EventSummary } from "./model/EventSummary";
import api_details from "../../api-exports";
import { ConfigurationParameters } from "../api-configuration";
import { Auth } from "aws-amplify";
import { CognitoUserSession } from "amazon-cognito-identity-js";

// TODO: Thhis class requires refactor
export class EventRepository {
  private apiConfigurationParams: ConfigurationParameters = {};

  waitUser = () =>
    Auth.currentSession()
      .then((res: CognitoUserSession) => {
        const accessToken = res.getIdToken();
        const jwt = accessToken.getJwtToken();
        this.apiConfigurationParams = {
          basePath: api_details.base_endpoint,
          accessToken: jwt,
        };
      })
      .catch(() => console.log("Not signed in"));

  constructor() {
    this.apiConfigurationParams = {
      basePath: api_details.base_endpoint,
    };
  }

  async get(id: string): Promise<Event> {
    await this.waitUser();
    return fetch(this.apiConfigurationParams.basePath + `/events/` + id, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization:
          "Bearer " +
          (this.apiConfigurationParams.accessToken != undefined
            ? this.apiConfigurationParams.accessToken
            : "-"),
      },
    }).then(response => {
      if (response.status >= 200 && response.status < 300) {
        return response.json();
      } else {
        throw response;
      }
    });
  }

  async list(): Promise<EventSummary[]> {
    await this.waitUser();
    return fetch(this.apiConfigurationParams.basePath + `/events`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization:
          "Bearer " +
          (this.apiConfigurationParams.accessToken != undefined
            ? this.apiConfigurationParams.accessToken
            : "-"),
      },
    }).then(response => {
      if (response.status >= 200 && response.status < 300) {
        return response.json();
      } else {
        throw response;
      }
    });
  }

  async add(event: Event): Promise<Event> {
    // Date should be serialized as 2023-01-21T09:33:10-08:00
    await this.waitUser();
    return fetch(this.apiConfigurationParams.basePath + `/events`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization:
          "Bearer " +
          (this.apiConfigurationParams.accessToken != undefined
            ? this.apiConfigurationParams.accessToken
            : "-"),
      },
      body: JSON.stringify(event),
    }).then(response => {
      if (response.status >= 200 && response.status < 300) {
        return response.json();
      } else {
        throw response;
      }
    });
  }

  async update(event: Event): Promise<Event> {
    await this.waitUser();
    return fetch(this.apiConfigurationParams.basePath + `/events`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization:
          "Bearer " +
          (this.apiConfigurationParams.accessToken != undefined
            ? this.apiConfigurationParams.accessToken
            : "-"),
      },
      body: JSON.stringify(event),
    }).then(response => {
      if (response.status >= 200 && response.status < 300) {
        return response.json();
      } else {
        throw response;
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async delete(id: string): Promise<any> {
    await this.waitUser();
    return fetch(this.apiConfigurationParams.basePath + `/events/` + id, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization:
          "Bearer " +
          (this.apiConfigurationParams.accessToken != undefined
            ? this.apiConfigurationParams.accessToken
            : "-"),
      },
    }).then(response => {
      if (response.status >= 200 && response.status < 300) {
        return "";
      } else {
        throw response;
      }
    });
  }
}
