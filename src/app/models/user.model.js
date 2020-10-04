"use strict";
/*
 * User model.
 *
 * @author Michel Megens
 * @email  dev@bietje.net
 */
exports.__esModule = true;
exports.UserRoles = exports.RoleUpdate = exports.Profile = exports.User = void 0;
var User = /** @class */ (function () {
    function User() {
    }
    return User;
}());
exports.User = User;
var Profile = /** @class */ (function () {
    function Profile() {
        this.currentPassword = null;
        this.newPassword = null;
        this.lastName = null;
        this.firstName = null;
    }
    return Profile;
}());
exports.Profile = Profile;
var RoleUpdate = /** @class */ (function () {
    function RoleUpdate() {
    }
    return RoleUpdate;
}());
exports.RoleUpdate = RoleUpdate;
var UserRoles = /** @class */ (function () {
    function UserRoles() {
    }
    return UserRoles;
}());
exports.UserRoles = UserRoles;
