"use strict";
/*
 * User account API services.
 *
 * @author Michel Megens
 * @email  dev@bietje.net
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.AccountService = void 0;
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var environment_1 = require("../../environments/environment");
var operators_1 = require("rxjs/operators");
var AccountService = /** @class */ (function () {
    function AccountService(http) {
        this.http = http;
        this.options = {
            observe: 'response',
            headers: new http_1.HttpHeaders().set('Content-Type', 'application/json')
        };
    }
    AccountService.prototype.getUser = function () {
        return this.http.get(environment_1.environment.authApiHost + '/accounts').pipe(operators_1.map(function (value) {
            var raw = value.registeredAt;
            value.registeredAt = new Date(Date.parse(raw));
            return value;
        }));
    };
    AccountService.prototype.getAllUsers = function () {
        return this.http.get(environment_1.environment.authApiHost + '/accounts/list');
    };
    AccountService.prototype.updateUser = function (user) {
        var profile = {
            "FirstName": user.firstName,
            "LastName": user.lastName,
            "Password": user.newPassword,
            "CurrentPassword": user.currentPassword
        };
        return this.http.patch(environment_1.environment.authApiHost + '/accounts', profile, {
            observe: 'response',
            headers: new http_1.HttpHeaders().set('Content-Type', 'application/json')
        });
    };
    AccountService.prototype.updateRoles = function (updates) {
        if (updates == null)
            return;
        var data = JSON.stringify(updates);
        return this.http.patch(environment_1.environment.authApiHost + '/accounts/roles', data, this.options);
    };
    AccountService.prototype.updateEmail = function (newMail) {
        var data = {
            "NewEmail": newMail
        };
        return this.http.post(environment_1.environment.authApiHost + '/accounts/update-email', data);
    };
    AccountService.prototype.confirmUpdateEmail = function (token) {
        var data = {
            "Token": token
        };
        return this.http.post(environment_1.environment.authApiHost + '/accounts/confirm-update-email', data, {
            observe: 'response',
            headers: new http_1.HttpHeaders().set('Content-Type', 'application/json')
        });
    };
    AccountService.prototype.confirmPhoneNumber = function (token) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.get(environment_1.environment.authApiHost + '/accounts/confirm-phone-number/' + token, {
                observe: 'response',
                headers: new http_1.HttpHeaders().set('Content-Type', 'application/json')
            }).toPromise().then(function () {
                localStorage.setItem('phone-confirmed', 'true');
                resolve();
            }, function (msg) {
                reject(msg);
            });
        });
    };
    AccountService.prototype.updatePhoneNumber = function (phonenumber) {
        var data = {
            "PhoneNumber": phonenumber
        };
        return this.http.patch(environment_1.environment.authApiHost + '/accounts/update-phone-number', data, {
            observe: 'response',
            headers: new http_1.HttpHeaders().set('Content-Type', 'application/json')
        });
    };
    AccountService.phoneIsConfirmed = function () {
        var confirmed = localStorage.getItem('phone-confirmed');
        if (confirmed == null)
            return false;
        return confirmed == 'true';
    };
    AccountService.prototype.getRoles = function () {
        return __awaiter(this, void 0, void 0, function () {
            var roles;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        roles = localStorage.getItem('roles');
                        if (roles !== null) {
                            return [2 /*return*/, JSON.parse(roles)];
                        }
                        return [4 /*yield*/, this.checkAndStoreRoles()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.getRoles()];
                }
            });
        });
    };
    AccountService.prototype.checkAndStoreRoles = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.get(environment_1.environment.authApiHost + '/accounts/roles').subscribe(function (value) {
                localStorage.setItem('roles', JSON.stringify(value));
                if (value.roles.indexOf('Administrators') >= 0) {
                    localStorage.setItem('admin', 'true');
                }
                resolve();
            }, function () {
                resolve();
            });
        });
    };
    AccountService.isAdmin = function () {
        var value = localStorage.getItem('admin');
        if (!value) {
            return false;
        }
        return value === 'true';
    };
    AccountService.prototype.rawCheckEmailConfirmed = function () {
        return this.http.get(environment_1.environment.authApiHost + '/accounts/phone-confirmed', {
            observe: 'response',
            headers: new http_1.HttpHeaders().set('Content-Type', 'application/json')
        });
    };
    AccountService.prototype.deleteUser = function () {
        return this.http["delete"](environment_1.environment.authApiHost + "/accounts");
    };
    AccountService.prototype.checkPhoneConfirmed = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.rawCheckPhoneConfirmed().pipe(operators_1.map(function (res) {
                if (res.errorCode != 200)
                    return 'false';
                return res.message;
            })).subscribe(function (res) {
                localStorage.setItem('phone-confirmed', res.toString());
                resolve(res.toString() === 'true');
            }, function () { resolve(true); });
        });
    };
    AccountService.prototype.rawCheckPhoneConfirmed = function () {
        return this.http.get(environment_1.environment.authApiHost + '/accounts/phone-confirmed');
    };
    AccountService = __decorate([
        core_1.Injectable()
    ], AccountService);
    return AccountService;
}());
exports.AccountService = AccountService;
