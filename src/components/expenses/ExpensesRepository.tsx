import { ExpenseCategory } from "./model/ExpenseCategory";
import api_details from "../../api-exports";
import { ConfigurationParameters } from "../api-configuration";
import { Auth } from "aws-amplify";
import { CognitoUserSession } from "amazon-cognito-identity-js";

// TODO: Thhis class requires refactor +1
export class ExpensesRepository {
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

  async get(eventId: string, expenseId: string): Promise<ExpenseCategory> {
    await this.waitUser();
    return fetch(
      this.apiConfigurationParams.basePath +
        `/expenses/` +
        expenseId +
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

  async list(eventId: string): Promise<ExpenseCategory[]> {
    await this.waitUser();
    return fetch(
      this.apiConfigurationParams.basePath + `/expenses?eventId=` + eventId,
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

  async add(eventId: string, event: ExpenseCategory): Promise<ExpenseCategory> {
    await this.waitUser();
    return fetch(
      this.apiConfigurationParams.basePath + `/expenses?eventId=` + eventId,
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

  async update(
    eventId: string,
    event: ExpenseCategory
  ): Promise<ExpenseCategory> {
    await this.waitUser();
    return fetch(
      this.apiConfigurationParams.basePath + `/expenses?eventId=` + eventId,
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
  async delete(eventId: string, expenseId: string): Promise<any> {
    await this.waitUser();
    return fetch(
      this.apiConfigurationParams.basePath +
        `/expenses/` +
        expenseId +
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
