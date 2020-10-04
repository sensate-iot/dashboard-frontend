"use strict";
/*
 * API key models.
 *
 * @author Michel Megens
 * @email  dev@bietje.net
 */
exports.__esModule = true;
exports.ApiKeyType = exports.ApiKey = void 0;
var ApiKey = /** @class */ (function () {
    function ApiKey() {
    }
    return ApiKey;
}());
exports.ApiKey = ApiKey;
var ApiKeyType;
(function (ApiKeyType) {
    ApiKeyType[ApiKeyType["SensorKey"] = 0] = "SensorKey";
    ApiKeyType[ApiKeyType["SystemKey"] = 1] = "SystemKey";
    ApiKeyType[ApiKeyType["ApiKey"] = 2] = "ApiKey";
})(ApiKeyType = exports.ApiKeyType || (exports.ApiKeyType = {}));
