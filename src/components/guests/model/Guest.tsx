/**
 * Main Guest object .
 * @export
 * @interface Guest
 */
export default interface Guest {
  id?: string;
  firstName: string;
  lastName: string;
  guestOf?: string;
  email?: string;
  phone?: string;
  isTentative: boolean;
  country?: string;
  state?: string;
  numberOfSeats: number;
  requiresInvite?: boolean;
  isNotAttending?: boolean;
  timeCreatedOn?: string;
  timeUpdatedOn?: string;
}
