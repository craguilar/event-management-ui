/**
 * Main Event object .
 * @export
 * @interface Event
 */
export interface Event {
  id?: string;
  name: string;
  mainLocation: string;
  eventDay: string;
  description?: string;
  timeCreatedOn?: string;
  timeUpdatedOn?: string;
  isNotificationEnabled?: boolean;
}
