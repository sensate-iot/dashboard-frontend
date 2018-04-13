/*
 * User model.
 *
 * @author Michel Megens
 * @email  dev@bietje.net
 */

export class User {
  id : string;
  firstName : string;
  lastName  : string;
  email : string;
  phoneNumber : string;
}

export class Profile {
  firstName : string;
  lastName : string;
  phoneNumber : string;
  newPassword : string;
  currentPassword : string;

  constructor() {
    this.currentPassword = null;
    this.newPassword = null;
    this.phoneNumber = null;
    this.lastName = null;
    this.firstName = null;
  }
}
