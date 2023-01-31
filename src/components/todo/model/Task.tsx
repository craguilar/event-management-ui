/**
 * Main Task object .
 * @export
 * @interface Task
 */
export default interface Task {
  id?: string;
  name: string;
  status: string;
  timeCreatedOn?: string;
  timeUpdatedOn?: string;
}
