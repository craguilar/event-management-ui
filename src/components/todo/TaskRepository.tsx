import Task from "./model/Task";
import api_details from "../../api-exports";
import { ConfigurationParameters } from "../api-configuration";
import { Auth } from "aws-amplify";
import { CognitoUserSession } from "amazon-cognito-identity-js";

// TODO: Thhis class requires refactor
export class TaskRepository {
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

  async get(eventId: string, taskId: string): Promise<Task> {
    await this.waitUser();
    return fetch(
      this.apiConfigurationParams.basePath +
        `/tasks/` +
        taskId +
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

  async list(eventId: string): Promise<Task[]> {
    await this.waitUser();
    return fetch(
      this.apiConfigurationParams.basePath + `/tasks?eventId=` + eventId,
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

  async add(eventId: string, task: Task): Promise<Task> {
    await this.waitUser();
    return fetch(
      this.apiConfigurationParams.basePath + `/tasks?eventId=` + eventId,
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
        body: JSON.stringify(task),
      }
    ).then(response => {
      if (response.status >= 200 && response.status < 300) {
        return response.json();
      } else {
        throw response;
      }
    });
  }

  async update(eventId: string, task: Task): Promise<Task> {
    await this.waitUser();
    return fetch(
      this.apiConfigurationParams.basePath + `/tasks?eventId=` + eventId,
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
        body: JSON.stringify(task),
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
  async delete(eventId: string, taskId: string): Promise<any> {
    await this.waitUser();
    return fetch(
      this.apiConfigurationParams.basePath +
        `/tasks/` +
        taskId +
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
