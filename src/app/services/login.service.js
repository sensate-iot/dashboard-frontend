"use strict";
/*
 * Login service.
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
exports.__esModule = true;
exports.LoginService = void 0;
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var environment_1 = require("../../environments/environment");
var jwt_model_1 = require("../models/jwt.model");
var moment = require("moment");
var LoginService = /** @class */ (function () {
    function LoginService(http, accounts, cookies, keys) {
        this.http = http;
        this.accounts = accounts;
        this.cookies = cookies;
        this.keys = keys;
        this.options = {
            observe: 'response',
            headers: new http_1.HttpHeaders().set('Content-Type', 'application/json')
        };
        this.host = window.location.hostname;
    }
    LoginService_1 = LoginService;
    LoginService.prototype.getUserId = function () {
        var jwt = this.getJwtToken();
        if (jwt === null) {
            return null;
        }
        var json = atob(this.getJwtToken().split('.')[1]);
        var obj = JSON.parse(json);
        return obj.sub;
    };
    LoginService.prototype.readAuthCookie = function () {
        var data = this.cookies.get(LoginService_1.AuthCookie);
        if (data === null || data.length <= 0) {
            return null;
        }
        var json = atob(data);
        var jwt = JSON.parse(json);
        localStorage.setItem('jwt', json);
        localStorage.setItem('syskey', jwt.systemApiKey);
        return jwt;
    };
    LoginService.prototype.isLoggedIn = function () {
        var jwt = this.readAuthCookie();
        if (jwt === null || jwt === undefined) {
            return false;
        }
        return jwt.refreshToken != null;
    };
    LoginService.prototype.revokeAllTokens = function () {
        var _this = this;
        var jwt = this.getJwt();
        if (jwt == null || jwt.refreshToken == null) {
            this.resetLogin();
            return;
        }
        this.keys.revokeAll(true).subscribe(function () { });
        return new Promise(function (resolve, reject) {
            _this.http["delete"](environment_1.environment.authApiHost + '/tokens/revoke-all', {
                headers: new http_1.HttpHeaders().set('Content-Type', 'application/json').set('Cache-Control', 'no-cache')
            }).subscribe(function () {
                _this.resetLogin();
                resolve();
            }, function () {
                console.debug("Unable to revoke all tokens!");
                _this.resetLogin();
                reject();
            });
        });
    };
    LoginService.prototype.logout = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var jwt = _this.getJwt();
            if (jwt == null || jwt.refreshToken == null) {
                _this.resetLogin();
                return;
            }
            var key = localStorage.getItem('syskey');
            if (key != null) {
                _this.keys.revokeByKey(key).subscribe(function () {
                    console.debug('System API key revoked!');
                });
            }
            _this.http["delete"](environment_1.environment.authApiHost + '/tokens/revoke/' + jwt.refreshToken, {
                headers: new http_1.HttpHeaders().set('Content-Type', 'application/json').set('Cache-Control', 'no-cache')
            }).subscribe(function () {
                _this.resetLogin();
                resolve();
            }, function () {
                console.debug('Unable to logout on server!');
                _this.resetLogin();
                resolve();
            });
        });
    };
    LoginService.prototype.refresh = function () {
        var jwt = this.getJwt();
        if (jwt == null)
            return;
        var data = {
            "Email": jwt.email,
            "RefreshToken": jwt.refreshToken
        };
        return this.http.post(environment_1.environment.authApiHost + '/tokens/refresh', data, {
            headers: new http_1.HttpHeaders().set('Content-Type', 'application/json').set('Cache-Control', 'none')
        });
    };
    LoginService.prototype.updateJwt = function (refresh, token, expiry) {
        var jwt = this.getJwt();
        jwt.refreshToken = refresh;
        jwt.jwtToken = token;
        jwt.expiresInMinutes = expiry;
        this.setSession(jwt);
    };
    LoginService.prototype.getJwtToken = function () {
        var jwt = this.getJwt();
        if (jwt) {
            return jwt.jwtToken;
        }
        return null;
    };
    LoginService.prototype.getJwt = function () {
        var data = localStorage.getItem('jwt');
        if (!data)
            return null;
        return JSON.parse(data, function (key, value) {
            if (value !== '')
                return value;
            var result = new jwt_model_1.Jwt();
            result.expiresInMinutes = value.expiresInMinutes;
            result.jwtExpiresInMinutes = value.jwtExpiresInMinutes;
            result.jwtToken = value.jwtToken;
            result.refreshToken = value.refreshToken;
            result.email = value.email;
            return result;
        });
    };
    LoginService.prototype.resetLogin = function () {
        localStorage.removeItem('jwt');
        localStorage.removeItem('roles');
        localStorage.removeItem('admin');
        localStorage.removeItem('userId');
        localStorage.removeItem('phone-confirmed');
        localStorage.removeItem('syskey');
        console.debug("Removing cookie!");
        this.cookies["delete"](LoginService_1.AuthCookie, '/', this.host);
    };
    LoginService.prototype.getSysKey = function () {
        if (!this.isLoggedIn()) {
            return null;
        }
        return localStorage.getItem('syskey');
    };
    LoginService.prototype.setSession = function (data) {
        var now = moment().add(data.expiresInMinutes, 'minutes').toDate();
        localStorage.setItem('jwt', JSON.stringify(data));
        localStorage.setItem('syskey', data.systemApiKey);
        var cookie = btoa(JSON.stringify(data));
        console.debug("Setting cookie for: " + this.host);
        this.cookies.set(LoginService_1.AuthCookie, cookie, now, '/', this.host);
    };
    var LoginService_1;
    LoginService.AuthCookie = 'SensateIoTAuth';
    LoginService = LoginService_1 = __decorate([
        core_1.Injectable()
    ], LoginService);
    return LoginService;
}());
exports.LoginService = LoginService;
