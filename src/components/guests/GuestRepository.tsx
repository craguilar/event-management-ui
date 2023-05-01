import Guest from "./model/Guest";
import api_details from "../../api-exports";
import { ConfigurationParameters } from "../api-configuration";
import { Auth } from "aws-amplify";
import { CognitoUserSession } from "amazon-cognito-identity-js";
import CopyFromRequest from "./model/CopyFromRequest";

// TODO: Thhis class requires refactor +1
export class GuestRepository {
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

  async get(eventId: string, guestId: string): Promise<Guest> {
    await this.waitUser();
    return fetch(
      this.apiConfigurationParams.basePath +
        `/guests/` +
        guestId +
        "?eventId=" +
        eventId,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization:
            "Bearer " +
            (this.apiConfigurationParams.accessToken != undefined
              ? this.apiConfigurationParams.accessToken
              : "-"),
        },
      }
    ).then(response => {
      if (response.status >= 200 && response.status < 300) {
        return response.json();
      } else {
        throw response;
      }
    });
  }

  async list(eventId: string): Promise<Guest[]> {
    await this.waitUser();
    return fetch(
      this.apiConfigurationParams.basePath + `/guests?eventId=` + eventId,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization:
            "Bearer " +
            (this.apiConfigurationParams.accessToken != undefined
              ? this.apiConfigurationParams.accessToken
              : "-"),
        },
      }
    ).then(response => {
      if (response.status >= 200 && response.status < 300) {
        return response.json();
      } else {
        throw response;
      }
    });
  }

  async add(eventId: string | undefined, event: Guest): Promise<Guest> {
    await this.waitUser();
    return fetch(
      this.apiConfigurationParams.basePath + `/guests?eventId=` + eventId,
      {
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
      }
    ).then(response => {
      if (response.status >= 200 && response.status < 300) {
        return response.json();
      } else {
        throw response;
      }
    });
  }

  async copyFrom(eventId: string | undefined, request: CopyFromRequest): Promise<any> {
    await this.waitUser();
    return fetch(
      this.apiConfigurationParams.basePath + `/guests/actions/copy?eventId=` + eventId,
      {
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
        body: JSON.stringify(request),
      }
    ).then(response => {
      if (response.status >= 200 && response.status < 300) {
        return "";
      } else {
        throw response;
      }
    });
  }

  async update(eventId: string, event: Guest): Promise<Guest> {
    await this.waitUser();
    return fetch(
      this.apiConfigurationParams.basePath + `/guests?eventId=` + eventId,
      {
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
      }
    ).then(response => {
      if (response.status >= 200 && response.status < 300) {
        return response.json();
      } else {
        throw response;
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async delete(eventId: string, guestId: string | undefined): Promise<any> {
    await this.waitUser();
    return fetch(
      this.apiConfigurationParams.basePath +
        `/guests/` +
        guestId +
        "?eventId=" +
        eventId,
      {
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
      }
    ).then(response => {
      if (response.status >= 200 && response.status < 300) {
        return "";
      } else {
        throw response;
      }
    });
  }
}
