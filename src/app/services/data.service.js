"use strict";
/*
 * Data service.
 *
 * @author Michel Megens
 * @email  michel@michelmegens.net
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.DataService = exports.OrderDirection = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../environments/environment");
var OrderDirection;
(function (OrderDirection) {
    OrderDirection["ascending"] = "asc";
    OrderDirection["descending"] = "desc";
    OrderDirection["none"] = "";
})(OrderDirection = exports.OrderDirection || (exports.OrderDirection = {}));
var DataService = /** @class */ (function () {
    function DataService(http, login) {
        this.http = http;
        this.login = login;
        this.options = {};
    }
    DataService.prototype.getFromMany = function (sensorId, start, end, limit, skip, order) {
        if (limit === void 0) { limit = 0; }
        if (skip === void 0) { skip = 0; }
        if (order === void 0) { order = OrderDirection.none; }
        var key = this.login.getSysKey();
        var url = environment_1.environment.dataApiHost + "/measurements?key=" + key;
        var filter = {
            end: end.toISOString(),
            start: start.toISOString(),
            latitude: null,
            longitude: null,
            radius: null,
            limit: limit,
            skip: skip,
            sensorIds: sensorId,
            orderDirection: order
        };
        return this.http.post(url, JSON.stringify(filter), this.options);
    };
    DataService.prototype.getNearFromMany = function (sensorIds, start, end, location, radius, limit, skip, order) {
        if (limit === void 0) { limit = 0; }
        if (skip === void 0) { skip = 0; }
        if (order === void 0) { order = OrderDirection.none; }
        var key = this.login.getSysKey();
        var url = environment_1.environment.dataApiHost + "/measurements?key=" + key;
        var filter = {
            end: end.toISOString(),
            start: start.toISOString(),
            latitude: location.latitude,
            longitude: location.longitude,
            radius: radius,
            limit: limit,
            skip: skip,
            sensorIds: sensorIds,
            orderDirection: order
        };
        return this.http.post(url, JSON.stringify(filter), this.options);
    };
    DataService.prototype.get = function (sensorId, start, end, limit, skip, order) {
        if (limit === void 0) { limit = 0; }
        if (skip === void 0) { skip = 0; }
        if (order === void 0) { order = OrderDirection.none; }
        var key = this.login.getSysKey();
        var url = environment_1.environment.dataApiHost + "/measurements?key=" + key + "&sensorId=" + sensorId + "&start=" + start.toISOString() + "&end=" + end.toISOString();
        if (limit > 0) {
            url += "&limit=" + limit;
        }
        if (skip > 0) {
            url += "&skip=" + skip;
        }
        if (order !== OrderDirection.none) {
            url += "&order=" + order;
        }
        return this.http.get(url, this.options);
    };
    DataService.prototype.getNear = function (sensorId, start, end, location, radius, limit, skip, order) {
        if (limit === void 0) { limit = 0; }
        if (skip === void 0) { skip = 0; }
        if (order === void 0) { order = OrderDirection.none; }
        var key = this.login.getSysKey();
        var url = environment_1.environment.dataApiHost + "/measurements?key=" + key + "&sensorId=" + sensorId +
            ("&start=" + start.toISOString() + "&end=" + end.toISOString()) +
            ("&longitude=" + location.longitude + "&latitude=" + location.latitude + "&radius=" + radius);
        if (limit > 0) {
            url += "&limit=" + limit;
        }
        if (skip > 0) {
            url += "&skip=" + skip;
        }
        if (order !== OrderDirection.none) {
            url += "&order=" + order;
        }
        return this.http.get(url, this.options);
    };
    DataService = __decorate([
        core_1.Injectable()
    ], DataService);
    return DataService;
}());
exports.DataService = DataService;
