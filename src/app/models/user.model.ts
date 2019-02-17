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
  registeredAt : Date | string;
  roles : string[];
}

export class Profile {
  firstName : string;
  lastName : string;
  newPassword : string;
  currentPassword : string;

  constructor() {
    this.currentPassword = null;
    this.newPassword = null;
    this.lastName = null;
    this.firstName = null;
  }
}

export class RoleUpdate {
  Role : string;
  UserId : string;
}

export class UserRoles {
  public roles : string[];
  public email : string;
}
