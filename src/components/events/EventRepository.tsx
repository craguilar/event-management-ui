
import { Event } from "./model/Event"
import { EventSummary } from "./model/EventSummary"
import api_details from '../../api-exports';
import { ConfigurationParameters } from "./configuration";

export class EventRepository {

  private apiConfigurationParams: ConfigurationParameters = {};

  constructor() {
    this.apiConfigurationParams = {
      basePath: api_details.base_endpoint
    }
  }

  async get(id: string): Promise<Event> {

    return fetch(this.apiConfigurationParams.basePath + `/events/` + id)
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return response.json();
        } else {
          throw response;
        }
      });
  }

  async list(): Promise<EventSummary[]> {
    return fetch(this.apiConfigurationParams.basePath + `/events`)
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return response.json();
        } else {
          throw response;
        }
      });
  }

  async add(event: Event): Promise<Event> {

    return fetch(this.apiConfigurationParams.basePath + `/events`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(event)
      })
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return response.json();
        } else {
          throw response;
        }
      });
  }

  async update(event: Event): Promise<Event> {
    return fetch(this.apiConfigurationParams.basePath + `/events`,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(event)
      })
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return response.json();
        } else {
          throw response;
        }
      });
  }

}