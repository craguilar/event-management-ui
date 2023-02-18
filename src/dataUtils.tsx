// Credit to https://github.com/angular/angular.js/blob/65f800e19ec669ab7d5abbd2f6b82bf60110651a/src/ng/directive/input.js#L27
const EMAIL_REGEXP =
  /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;
const DateFormat = "dddd, MMMM Do YYYY, h:mm:ss a";
const CURRENCY_FORMATTER = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

// TODO: Utility should move there
function validateEmail(tag: string): boolean {
  if (!EMAIL_REGEXP.test(tag)) {
    return false;
  }
  return true;
}

export { validateEmail, DateFormat, CURRENCY_FORMATTER };
