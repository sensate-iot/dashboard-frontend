"use strict";
/*
 * API key service.
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
exports.ApiKeyService = void 0;
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var environment_1 = require("../../environments/environment");
var ApiKeyService = /** @class */ (function () {
    function ApiKeyService(client) {
        this.client = client;
        this.options = {
            observe: 'response',
            headers: new http_1.HttpHeaders().set('Content-Type', 'application/json')
        };
    }
    ApiKeyService.prototype.create = function (name, readonly) {
        var create = {
            "name": name,
            "readOnly": readonly
        };
        return this.client.post(environment_1.environment.authApiHost + '/apikeys/create', create);
    };
    ApiKeyService.prototype.revoke = function (id) {
        return this.client["delete"](environment_1.environment.authApiHost + '/apikeys/revoke?id=' + id, this.options);
    };
    ApiKeyService.prototype.revokeByKey = function (key) {
        return this.client["delete"](environment_1.environment.authApiHost + '/apikeys/revoke?key=' + key, this.options);
    };
    ApiKeyService.prototype.revokeAll = function (systemonly) {
        return this.client["delete"](environment_1.environment.authApiHost + '/apikeys/revoke?system=' + systemonly, this.options);
    };
    ApiKeyService.prototype.refresh = function (id) {
        return this.client.patch(environment_1.environment.authApiHost + '/apikeys/' + id, null, this.options);
    };
    ApiKeyService.prototype.filter = function (filter) {
        return this.client.post(environment_1.environment.authApiHost + "/apikeys", JSON.stringify(filter));
    };
    ApiKeyService.prototype.getAllKeys = function () {
        return this.client.get(environment_1.environment.authApiHost + '/apikeys');
    };
    ApiKeyService = __decorate([
        core_1.Injectable()
    ], ApiKeyService);
    return ApiKeyService;
}());
exports.ApiKeyService = ApiKeyService;
