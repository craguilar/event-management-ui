/**
 * Main car object . 
 * @export
 * @interface Car
 */
export interface Event {
  id?: string;
  name: string;
  mainLocation: string;
  eventDay: string;
  description?: string;
  timeCreatedOn?: string;
  timeUpdatedOn?: string;
}